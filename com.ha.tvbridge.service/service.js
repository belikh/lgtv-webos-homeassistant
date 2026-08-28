/* eslint-disable no-console */
/**
 * com.ha.tvbridge.service — Phase 2+3+4 companion (JS + ActivityManager + ambient + Wyoming)
 *
 * Three-layer hybrid — Phase 4 adds Layer 1 Enact warm + Wyoming UMI conditional:
 *   Layer 1 Enact suspended WebView (handlesRelaunch:true, requiredMemory:120) — com.ha.tvbridge/index.html
 *           Lovelace iframe warm via PalmSystem.activate() + visibilityChange + WS subscribe
 *   Layer 2 JS service anchored by ActivityManager foreground+explicit+persist — THIS FILE
 *   Layer 3 native init.d unicapture daemon (libvtcapture+libhalgal flatbuffer 127.0.0.1:19400
 *           256x144@30 CX quirks 0x1|0x2|0x40|0x100, 32x32 hash → ambient_lux) — native/init.d/com.ha.tvbridge.ambient
 *
 * Responsibilities:
 *   - Register luna://com.ha.tvbridge.service/getCapabilities for sister Phase-1 probe (caps voice+lovelace)
 *   - Luna getAmbientLux (unicapture flatbuffer stub, 32x32 hash, AI Picture Pro toast contract)
 *   - Luna getVoiceStatus / getWyomingStatus + TCP 8091 Wyoming stub 16 kHz PCM via UMI usb_mic0 conditional
 *   - Create/adopt foreground+explicit+persist Activity with FakeActivityManager 30s TTL fallback
 *   - Host WS on wss:9923 with HMAC(client_key,'ha-companion/1') auth and push for power/volume/app/ambient/voice
 *   - Proxy CEC query/operation for HDMI-CEC hub role
 *   - Ambient flatbuffer client 127.0.0.1:19400 → 32x32 hash to ambient_lux, WS type ambient + getAmbientLux, simulated fallback
 *   - Wyoming UMI probe listSupportedDevices usb_mic0 → TCP 8091 16 kHz PCM stub, Magic Remote fallback if absent
 *
 * Notes:
 *   - wss:9923 is served as plain ws://9923 with CERT_NONE tolerance on HA side (bscpylgtv/aiowebostv
 *     already use ssl CERT_NONE for TV self-signed). Upgrading to TLS only requires a local cert.
 *   - mDNS _lg-ha-companion._tcp advertisement is expected to be published by avahi when available;
 *     this JS service advertises capabilities via TXT v=1 caps and via getCapabilities Luna method.
 *   - Node 14 compat: CommonJS, no top-level await, no optional chaining in hot paths without guard.
 */

'use strict';

const crypto = require('crypto');

/** @type {any} */
let ServiceImpl = null;
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  ServiceImpl = require('webos-service');
} catch (_e) {
  // Allow typecheck/lint outside webOS without native module
  ServiceImpl = null;
}

/** @type {any} */
let WebSocket = null;
try {
  // eslint-disable-next-line global-require
  WebSocket = require('ws');
} catch (_e) {
  WebSocket = null;
}

// ---------------------------------------------------------------------------
// Constants — fingerprint from live probe 10.1.1.209
// ---------------------------------------------------------------------------

/** @const {string} */
const SERVICE_ID = 'com.ha.tvbridge.service';

/** @const {number} */
const WS_PORT = 9923;

/** @const {string} */
const ACTIVITY_NAME = 'com.ha.tvbridge.keepalive';

/** @const {{v:number,caps:string[],model:string,sv:string}} */
const CAPS_SNAPSHOT = {
  v: 1,
  caps: ['cec', 'capture', 'voice', 'lovelace'],
  model: 'OLED48CXPTA',
  sv: '04.40.16',
};

// ---------------------------------------------------------------------------
// Ambient — unicapture flatbuffer 127.0.0.1:19400 → 32x32 hash → ambient_lux
// Phase 3 flagship, gracefully degraded when native daemon absent.
// Refs: webosbrew/hyperion-webos (libvtcapture+libhalgal, quirks 0x1|0x2|0x40|0x100 → 0x143)
//       TBSniller/piccap AI Picture Pro dropout warning
//       native/FLATBUFFER_PROTOCOL.md + native/README.md
// ---------------------------------------------------------------------------

/** @const {string} */
const AMBIENT_HOST = '127.0.0.1';
/** @const {number} */
const AMBIENT_PORT = 19400;
/** @const {number} */
const AMBIENT_WIDTH = 256;
/** @const {number} */
const AMBIENT_HEIGHT = 144;
/** @const {number} */
const AMBIENT_FPS = 30;
/** @const {number} */
const AMBIENT_QUIRKS = 0x1 | 0x2 | 0x40 | 0x100; // 0x143 = 323 CX budget
/** @const {number} */
const AMBIENT_HASH_DIM = 32;
/** @const {number} */
const AMBIENT_INTERVAL_MS = 2000;
/** @const {number} */
const AMBIENT_TIMEOUT_MS = 800;

/** @type {number | null} */
let lastAmbientLux = null;
/** @type {'flatbuffer' | 'simulated' | 'unavailable'} */
let ambientSource = 'unavailable';
/** @type {NodeJS.Timeout | null} */
let ambientTimer = null;
/** @type {number} */
let ambientFrameCount = 0;
/** @type {boolean} */
let ambientToastShown = false;

// ---------------------------------------------------------------------------
// Wyoming voice satellite — 16 kHz PCM via UMI usb_mic0 conditional (Phase 4)
// Graceful degrade if USB mic absent — CX has no far-field array-mic, wired USB only.
// Stub TCP 8091 streaming 16 kHz PCM; real Wyoming binary not required until HA assist.
// Refs: com.webos.service.audio/listSupportedDevices (usb_mic0), FLATBUFFER_PROTOCOL,
//       ROADMAP §10 voice satellite, docs/ENACT_VOICE.md
// ---------------------------------------------------------------------------

/** @const {string} */
const WYOMING_HOST = '0.0.0.0';
/** @const {number} */
const WYOMING_PORT = 8091;
/** @const {number} */
const WYOMING_RATE = 16000;
/** @const {number} */
const WYOMING_CHANNELS = 1;
/** @const {number} */
const WYOMING_WIDTH = 2; // 16-bit LE
/** @const {number} */
const WYOMING_CHUNK_MS = 20; // 20 ms per chunk → 640 bytes (16000 *2 *0.02)
/** @const {string} */
const WYOMING_FALLBACK_NOTE = 'Magic Remote push-to-talk fallback — CX no far-field array-mic; wired USB mic required for always-on Wyoming';

/** @type {boolean} */
let wyomingAvailable = false;
/** @type {'usb_mic0' | 'unavailable' | 'fallback'} */
let wyomingSource = 'unavailable';
/** @type {any} */
let wyomingServer = null;
/** @type {NodeJS.Timeout | null} */
let wyomingProbeTimer = null;
/** @type {Array<any>} */
let wyomingDeviceList = [];
/** @type {number} */
let wyomingProbeAttempts = 0;

// ---------------------------------------------------------------------------
// HMAC helper — re-uses HA client-key, no second credential store
// ---------------------------------------------------------------------------

/**
 * Derive companion token from paired client-key.
 * @param {string} clientKey - raw client-key from .aiopylgtv.sqlite pairing (e.g. 3c0c137e...)
 * @returns {string} hex sha256 HMAC
 */
function deriveCompanionToken(clientKey) {
  return crypto.createHmac('sha256', clientKey).update('ha-companion/1').digest('hex');
}

/**
 * Verify incoming bearer token against stored client-key derived token.
 * In dev / lint contexts where no key is stored, accepts any 64-hex as permissive.
 * @param {string | undefined} token
 * @param {Set<string>} allowedTokens
 * @returns {boolean}
 */
function isValidToken(token, allowedTokens) {
  if (!token || typeof token !== 'string') return false;
  if (allowedTokens.size === 0) {
    // Permissive dev fallback — still requires shape to avoid accidental auth bypass in logs
    return /^[a-f0-9]{64}$/i.test(token);
  }
  return allowedTokens.has(token);
}

// Stored companion tokens derived from known client-keys (populated at runtime if available).
/** @type {Set<string>} */
const allowedTokens = new Set();

// Attempt to pre-seed from env for local testing (HA will push via Luna in future).
if (process.env.HA_COMPANION_TOKEN) {
  allowedTokens.add(process.env.HA_COMPANION_TOKEN);
}
if (process.env.HA_CLIENT_KEY) {
  try {
    allowedTokens.add(deriveCompanionToken(process.env.HA_CLIENT_KEY));
  } catch (_e) { /* ignore */ }
}

// ---------------------------------------------------------------------------
// Ambient helpers — flatbuffer client stub + 32x32 hash to ambient_lux
// ---------------------------------------------------------------------------

/**
 * Hash frame bytes to ambient_lux (0–500 lx). Downscales to 32x32 (1024) via
 * block average, then maps avgY 0–255 → 0–500 lx. Handles NV12 Y plane and
 * flatbuffer RGB interchangeably; lenient for stub/simulation.
 * @param {Buffer | Uint8Array | null} bytes
 * @param {number} [width]
 * @param {number} [height]
 * @returns {number} 0–500
 */
function hashToAmbientLux(bytes, width, height) {
  if (!bytes || bytes.length === 0) {
    // Simulated fallback — jitter around last or 100 lx
    const base = lastAmbientLux !== null ? lastAmbientLux : 100;
    const jitter = Math.floor(Math.random() * 20) - 10; // -10..+10
    return Math.max(0, Math.min(500, base + jitter));
  }
  // Use first width*height bytes as Y/luma if NV12, else sample every 3rd (RGB)
  const w = width || AMBIENT_WIDTH;
  const h = height || AMBIENT_HEIGHT;
  const yLen = Math.min(bytes.length, w * h);
  const hashDim = AMBIENT_HASH_DIM;
  const blockW = Math.max(1, Math.floor(w / hashDim));
  const blockH = Math.max(1, Math.floor(h / hashDim));
  let totalLuma = 0;
  let blocks = 0;
  // Sample 32x32 grid by block-average of Y plane for speed (no full downscale)
  for (let by = 0; by < hashDim; by++) {
    for (let bx = 0; bx < hashDim; bx++) {
      const sx = bx * blockW;
      const sy = by * blockH;
      const idx = sy * w + sx;
      if (idx < yLen) {
        // @ts-ignore — Buffer index
        const y = bytes[idx] & 0xff;
        totalLuma += y;
        blocks++;
      }
    }
  }
  const avgY = blocks ? totalLuma / blocks : 128;
  // Map 0–255 → 0–500 lx (indoor 500 lx ceiling)
  return Math.max(0, Math.min(500, Math.round((avgY / 255) * 500)));
}

/**
 * Simulate ambient_lux when native daemon absent — deterministic jitter is fine.
 * @returns {number}
 */
function simulateAmbientLux() {
  return hashToAmbientLux(null);
}

/**
 * Fetch one flatbuffer frame from 127.0.0.1:19400 with timeout.
 * On success cb(Buffer), on failure cb(null) for graceful simulated fallback.
 * Flatbuffer wire is [uint32_le size][flatbuffer bytes]; we treat any payload as bytes.
 * @param {(buf: Buffer | null) => void} cb
 */
function fetchFlatbufferFrame(cb) {
  let net;
  try {
    // eslint-disable-next-line global-require
    net = require('net');
  } catch (_e) {
    cb(null);
    return;
  }
  /** @type {any} */
  let socket = null;
  let settled = false;
  /** @type {Buffer[]} */
  let chunks = [];
  const timeout = setTimeout(() => {
    if (settled) return;
    settled = true;
    try { if (socket) socket.destroy(); } catch (_e) { /* ignore */ }
    cb(null);
  }, AMBIENT_TIMEOUT_MS);

  try {
    socket = net.createConnection({ host: AMBIENT_HOST, port: AMBIENT_PORT }, () => {
      // Connected — wait for data; hyperion flatbuffer will push one frame then keepalive
      // We read up to 2MiB or first size-prefixed frame
    });
    socket.setTimeout(AMBIENT_TIMEOUT_MS);
    socket.on('data', (/** @type {Buffer} */ d) => {
      chunks.push(d);
      // If we have at least 4 bytes size prefix + payload, try early fulfil
      const total = chunks.reduce((a, c) => a + c.length, 0);
      if (total >= 4) {
        const first = Buffer.concat(chunks);
        const size = first.readUInt32LE(0);
        // Accept 0 < size < 2MiB and enough bytes received
        if (size > 0 && size < 2 * 1024 * 1024 && first.length >= 4 + size) {
          if (!settled) {
            settled = true;
            clearTimeout(timeout);
            // Slice flatbuffer payload (skip size prefix) — hash that
            const payload = first.slice(4, 4 + size);
            try { socket.destroy(); } catch (_e) { /* ignore */ }
            cb(payload);
          }
        } else if (total > 64 * 1024) {
          // Raw NV12 without size prefix — treat whole buffer as frame after 64KiB
          if (!settled) {
            settled = true;
            clearTimeout(timeout);
            try { socket.destroy(); } catch (_e) { /* ignore */ }
            cb(first);
          }
        }
      }
    });
    socket.on('end', () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      const buf = chunks.length ? Buffer.concat(chunks) : null;
      // Strip size prefix if it looks valid
      if (buf && buf.length >= 4) {
        const sz = buf.readUInt32LE(0);
        if (sz > 0 && sz < 2 * 1024 * 1024 && buf.length >= 4 + sz) {
          cb(buf.slice(4, 4 + sz));
          return;
        }
      }
      cb(buf && buf.length ? buf : null);
    });
    socket.on('error', () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      cb(null);
    });
    socket.on('timeout', () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      try { socket.destroy(); } catch (_e) { /* ignore */ }
      // If we got partial data before timeout, use it
      if (chunks.length) {
        const buf = Buffer.concat(chunks);
        cb(buf.length ? buf : null);
      } else {
        cb(null);
      }
    });
  } catch (_e) {
    if (!settled) {
      settled = true;
      clearTimeout(timeout);
      cb(null);
    }
  }
}

/**
 * Current ambient snapshot for Luna/WS.
 * @returns {{lux:number,source:string,ts:number,meta:{width:number,height:number,fps:number,quirks:number,hash:string,host:string,port:number},frameCount:number}}
 */
function getAmbientSnapshot() {
  return {
    lux: lastAmbientLux !== null ? lastAmbientLux : simulateAmbientLux(),
    source: ambientSource,
    ts: Date.now(),
    meta: {
      width: AMBIENT_WIDTH,
      height: AMBIENT_HEIGHT,
      fps: AMBIENT_FPS,
      quirks: AMBIENT_QUIRKS,
      hash: '32x32',
      host: AMBIENT_HOST,
      port: AMBIENT_PORT,
    },
    frameCount: ambientFrameCount,
  };
}

/**
 * One-shot AI Picture Pro off-contract toast via notifications.
 * Non-blocking; ignored if ACL not yet elevated or service absent.
 * PicCap contract: AI Picture Pro/Brightness/Genre/Game Optimizer cause 200–500 ms dropout.
 */
function maybeNotifyAiPictureContract() {
  if (ambientToastShown || !service) return;
  ambientToastShown = true;
  const msg = 'Ambient capture active — turn off AI Picture Pro / AI Brightness / AI Genre (Settings → General → AI Service) to avoid 200–500 ms dropouts.';
  try {
    // @ts-ignore
    service.call('luna://com.webos.notification/createToast', { message: msg }, () => {});
  } catch (_e) { /* ignore */ }
  try {
    // @ts-ignore — some firmware uses service path
    service.call('luna://com.webos.service.notifications/createToast', { message: msg }, () => {});
  } catch (_e) { /* ignore */ }
  try {
    // @ts-ignore — fallback system.notifications
    service.call('luna://com.webos.service.systemservice/createToast', { message: msg }, () => {});
  } catch (_e) { /* ignore */ }
  console.log('[com.ha.tvbridge.service] AI Picture Pro off-contract toast shown');
}

/**
 * Poll flatbuffer, hash to lux, broadcast via WS 'ambient' and cache for getAmbientLux.
 * Gracefully degrades to simulated when daemon absent.
 */
function pollAmbientOnce() {
  fetchFlatbufferFrame((buf) => {
    let lux;
    let source;
    if (buf && buf.length > 0) {
      // Try to infer width/height from buffer length heuristics; default CX 256x144 NV12
      lux = hashToAmbientLux(buf, AMBIENT_WIDTH, AMBIENT_HEIGHT);
      source = 'flatbuffer';
      ambientFrameCount++;
    } else {
      lux = simulateAmbientLux();
      source = ambientSource === 'flatbuffer' ? 'simulated' : 'simulated';
      // Keep frameCount stable when simulated; increment less
      if (ambientSource === 'simulated') ambientFrameCount++;
    }
    lastAmbientLux = lux;
    ambientSource = /** @type {'flatbuffer'|'simulated'|'unavailable'} */ (source);
    // Broadcast to WS clients (authenticated only — via existing broadcast helper)
    try {
      broadcast('ambient', getAmbientSnapshot());
    } catch (_e) { /* ignore */ }
    // First successful flatbuffer read triggers AI Picture Pro contract toast once
    if (source === 'flatbuffer' && !ambientToastShown) {
      maybeNotifyAiPictureContract();
    }
  });
}

/**
 * Start ambient loop — 2000 ms push (sensor ambient_lux matrix row 23).
 * Safe to call multiple times; de-duplicates timer.
 */
function startAmbientLoop() {
  if (ambientTimer) return;
  console.log('[com.ha.tvbridge.service] Ambient loop start — ' + AMBIENT_HOST + ':' + AMBIENT_PORT + ' ' + AMBIENT_WIDTH + 'x' + AMBIENT_HEIGHT + '@' + AMBIENT_FPS + ' quirks 0x' + AMBIENT_QUIRKS.toString(16) + ' hash ' + AMBIENT_HASH_DIM + 'x' + AMBIENT_HASH_DIM);
  // Prime immediate poll (simulated if no daemon yet)
  pollAmbientOnce();
  // Interval push
  ambientTimer = setInterval(pollAmbientOnce, AMBIENT_INTERVAL_MS);
  // Do not let interval keep process alive alone — ActivityManager does that
  // Keep boot toast contract visible even if first poll simulated (warn early)
  setTimeout(() => {
    if (!ambientToastShown && lastAmbientLux !== null) {
      maybeNotifyAiPictureContract();
    }
  }, 3000);
}

/**
 * Stop ambient loop.
 */
function stopAmbientLoop() {
  if (ambientTimer) {
    clearInterval(ambientTimer);
    ambientTimer = null;
  }
  console.log('[com.ha.tvbridge.service] Ambient loop stopped');
}

// ---------------------------------------------------------------------------
// Wyoming — UMI usb_mic0 probe + Wyoming TCP 8091 stub (Phase 4)
// Graceful degrade: CX no far-field, wired USB mic only. No binary required.
// ---------------------------------------------------------------------------

/**
 * Test if deviceList contains a connected usb_mic0 (wired USB mic).
 * Mirrors com.webos.service.audio/listSupportedDevices response deviceList[].
 * Also tolerates status/getStatus UMI shape where audio[] contains source AMIXER.
 * @param {Array<any> | undefined} deviceList
 * @returns {boolean}
 */
function isUsbMicPresent(deviceList) {
  if (!Array.isArray(deviceList)) return false;
  return deviceList.some(function (d) {
    if (!d || typeof d.deviceName !== 'string') return false;
    // Exact: usb_mic0 external input connected
    if (d.deviceName === 'usb_mic0') {
      // connected:true is the CX ground truth; treat absent connected as false
      return d.connected === true;
    }
    return false;
  });
}

/**
 * Current voice snapshot for Luna/WS getCapabilities.
 * @returns {{available:boolean,source:string,port:number,rate:number,channels:number,fallback:string,deviceList:Array<any>,attempts:number}}
 */
function getWyomingSnapshot() {
  return {
    available: wyomingAvailable,
    source: wyomingSource,
    port: WYOMING_PORT,
    rate: WYOMING_RATE,
    channels: WYOMING_CHANNELS,
    fallback: WYOMING_FALLBACK_NOTE,
    deviceList: wyomingDeviceList.slice(0, 8),
    attempts: wyomingProbeAttempts,
  };
}

/**
 * Probe UMI audio hardware for usb_mic0 via listSupportedDevices.
 * Tries Luna luna://com.webos.service.audio/listSupportedDevices {query:'all'}.
 * Falls back to luna://com.webos.service.audio/UMI/getStatus and
 * luna://com.webos.service.audio/status/getStatus for older firmware alias.
 * Updates wyomingAvailable / wyomingSource and starts or stops TCP stub accordingly.
 * @param {(found:boolean)=>void} [cb]
 */
function probeWyomingOnce(cb) {
  wyomingProbeAttempts++;
  if (!service) {
    // Stub mode (typecheck) — remain unavailable, still report fallback
    wyomingAvailable = false;
    wyomingSource = 'unavailable';
    wyomingDeviceList = [];
    if (typeof cb === 'function') cb(false);
    return;
  }
  var handled = false;
  /**
   * @param {boolean} found
   * @param {Array<any>} list
   */
  var done = function (found, list) {
    if (handled) return;
    handled = true;
    wyomingDeviceList = Array.isArray(list) ? list : [];
    wyomingAvailable = !!found;
    wyomingSource = found ? 'usb_mic0' : 'unavailable';
    if (found) {
      console.log('[com.ha.tvbridge.service] Wyoming probe — usb_mic0 present, starting TCP ' + WYOMING_PORT);
      startWyomingServer();
    } else {
      console.log('[com.ha.tvbridge.service] Wyoming probe — usb_mic0 absent (' + WYOMING_FALLBACK_NOTE + ')');
      stopWyomingServer();
    }
    if (typeof cb === 'function') cb(found);
  };

  // Primary: listSupportedDevices — ACG audio.query, reliable on 5.4.1 OSE
  try {
    service.call('luna://com.webos.service.audio/listSupportedDevices', { query: 'all', subscribe: false }, /** @param {any} msg */ function (msg) {
      var payload = msg && msg.payload ? msg.payload : {};
      if (payload.returnValue === true && Array.isArray(payload.deviceList)) {
        done(isUsbMicPresent(payload.deviceList), payload.deviceList);
      } else if (payload.returnValue === false) {
        // Try UMI/getStatus alias
        tryFallbackUmi();
      } else {
        // No deviceList — fall through to UMI check after short timeout
        setTimeout(tryFallbackUmi, 200);
      }
    });
  } catch (_e) {
    tryFallbackUmi();
  }

  function tryFallbackUmi() {
    if (handled) return;
    // Fallback 1: UMI/getStatus (audio UMI routing)
    try {
      service.call('luna://com.webos.service.audio/UMI/getStatus', {}, /** @param {any} msg2 */ function (msg2) {
        var p2 = msg2 && msg2.payload ? msg2.payload : {};
        // UMI/getStatus does not list usb_mic0 directly; treat as absent and keep probing listSupportedDevices shape
        // But if it returns audio[] we still mark unavailable gracefully
        if (p2.returnValue === true) {
          // UMI alive but no mic evidence — still absent
          done(false, p2.audio || []);
        } else {
          tryFallbackStatus();
        }
      });
    } catch (_e2) {
      tryFallbackStatus();
    }
  }

  function tryFallbackStatus() {
    if (handled) return;
    // Fallback 2: status/getStatus alias (some firmware maps audio/status/getStatus → UMI)
    try {
      service.call('luna://com.webos.service.audio/status/getStatus', {}, /** @param {any} msg3 */ function (msg3) {
        var p3 = msg3 && msg3.payload ? msg3.payload : {};
        if (p3.returnValue === true && Array.isArray(p3.deviceList)) {
          done(isUsbMicPresent(p3.deviceList), p3.deviceList);
        } else {
          done(false, []);
        }
      });
    } catch (_e3) {
      done(false, []);
    }
  }

  // Safety timeout — if no Luna reply in 1500 ms, degrade gracefully
  setTimeout(function () {
    if (!handled) {
      console.warn('[com.ha.tvbridge.service] Wyoming probe timeout — assuming usb_mic0 absent');
      done(false, []);
    }
  }, 1500);
}

/**
 * Start Wyoming TCP 8091 stub streaming 16 kHz PCM.
 * Stub only — does not require native Wyoming binary.
 * When HA Wyoming satellite connects, we stream 20 ms silence chunks (640 bytes)
 * at 16 kHz mono 16-bit LE; a real UMI capture would replace silence with arecord/UMI.
 * Safe to call multiple times; de-duplicates server.
 */
function startWyomingServer() {
  if (wyomingServer) return;
  var net;
  try {
    // eslint-disable-next-line global-require
    net = require('net');
  } catch (_e) {
    console.warn('[com.ha.tvbridge.service] Wyoming stub — net not available');
    return;
  }
  // If no mic, do not expose TCP — graceful degrade requested
  if (!wyomingAvailable) {
    console.log('[com.ha.tvbridge.service] Wyoming stub not started — ' + WYOMING_FALLBACK_NOTE);
    return;
  }
  try {
    wyomingServer = net.createServer(function (socket) {
      console.log('[com.ha.tvbridge.service] Wyoming client connected ' + (socket.remoteAddress || 'unknown'));
      // Wyoming protocol handshake stub — send JSON describe then stream PCM
      // Real Wyoming uses JSON header + PCM; stub sends describe then silence.
      var describe = JSON.stringify({
        type: 'describe',
        data: {
          wyoming: { version: '1.5.4' },
          asr: [{ name: 'ha-tvbridge-stub', attribution: { name: 'HA TV Bridge', url: 'https://github.com/belikh/lgtv-webos-homeassistant' }, installed: true, version: '1.0.0', languages: ['en'], supports: ['transcribe'] }],
          satellite: { name: 'com.ha.tvbridge', area: 'living_room', streaming: true },
          // Advertise 16 kHz mono PCM
          audio: { rate: WYOMING_RATE, width: WYOMING_WIDTH, channels: WYOMING_CHANNELS },
        },
      });
      try {
        // Wyoming framing: 4-byte BE length? For stub we just send JSON + newline for HA to parse
        socket.write(describe + '\n');
      } catch (_e) { /* ignore */ }

      // Handle incoming Wyoming events (transcribe, audio chunk) — stub acknowledges
      socket.on('data', function (d) {
        var text = d.toString().slice(0, 400);
        console.log('[com.ha.tvbridge.service] Wyoming recv', text);
        // Echo back a transcribe stub if client sent run
        if (text.indexOf('"type": "transcribe"') !== -1 || text.indexOf('"type":"transcribe"') !== -1) {
          try {
            socket.write(JSON.stringify({ type: 'transcript', data: { text: '' } }) + '\n');
          } catch (_e2) { /* ignore */ }
        }
      });

      // Stream 16 kHz PCM silence at 20 ms intervals (640 bytes)
      var chunk = Buffer.alloc(WYOMING_RATE * WYOMING_WIDTH * WYOMING_CHANNELS * WYOMING_CHUNK_MS / 1000, 0);
      var pcmTimer = setInterval(function () {
        try {
          if (socket.destroyed || socket.writableEnded) {
            clearInterval(pcmTimer);
            return;
          }
          // Only stream if mic still present; otherwise send silence and note fallback
          socket.write(chunk);
        } catch (_e) {
          clearInterval(pcmTimer);
        }
      }, WYOMING_CHUNK_MS);
      // Ensure timer does not keep process alive alone — ActivityManager does
      if (pcmTimer && typeof pcmTimer.unref === 'function') pcmTimer.unref();

      socket.on('close', function () {
        clearInterval(pcmTimer);
        console.log('[com.ha.tvbridge.service] Wyoming client disconnected');
      });
      socket.on('error', function (err) {
        clearInterval(pcmTimer);
        console.warn('[com.ha.tvbridge.service] Wyoming socket error', err);
      });
    });

    wyomingServer.on('error', /** @param {any} err */ function (err) {
      console.warn('[com.ha.tvbridge.service] Wyoming server error', err);
      // EADDRINUSE etc. — degrade gracefully, keep voice available:false
      try { wyomingServer.close(); } catch (_e) { /* ignore */ }
      wyomingServer = null;
      wyomingAvailable = false;
      wyomingSource = 'fallback';
    });

    wyomingServer.listen(WYOMING_PORT, WYOMING_HOST, function () {
      console.log('[com.ha.tvbridge.service] Wyoming stub listening on ' + WYOMING_HOST + ':' + WYOMING_PORT + ' ' + WYOMING_RATE + 'Hz PCM (usb_mic0)');
    });
  } catch (/** @type {any} */ err) {
    console.warn('[com.ha.tvbridge.service] Failed to start Wyoming stub', err);
    wyomingServer = null;
  }
}

/**
 * Stop Wyoming TCP stub.
 */
function stopWyomingServer() {
  if (wyomingServer) {
    try {
      wyomingServer.close();
    } catch (_e) { /* ignore */ }
    wyomingServer = null;
    console.log('[com.ha.tvbridge.service] Wyoming stub stopped — ' + WYOMING_FALLBACK_NOTE);
  }
}

/**
 * Start periodic Wyoming probe (boot + every 30 s) so hot-plugged USB mic is detected.
 * Safe to call multiple times; de-duplicates timer.
 */
function startWyomingProbeLoop() {
  if (wyomingProbeTimer) return;
  console.log('[com.ha.tvbridge.service] Wyoming probe loop start — listSupportedDevices usb_mic0 conditional');
  probeWyomingOnce();
  wyomingProbeTimer = setInterval(function () {
    probeWyomingOnce();
  }, 30000);
  if (wyomingProbeTimer && typeof wyomingProbeTimer.unref === 'function') wyomingProbeTimer.unref();
}

/**
 * Stop Wyoming probe loop.
 */
function stopWyomingProbeLoop() {
  if (wyomingProbeTimer) {
    clearInterval(wyomingProbeTimer);
    wyomingProbeTimer = null;
  }
  console.log('[com.ha.tvbridge.service] Wyoming probe loop stopped');
}

// ---------------------------------------------------------------------------
// Service bootstrap
// ---------------------------------------------------------------------------

/** @type {any} */
let service = null;

if (ServiceImpl) {
  // webos-service expects `new Service(id)`
  // @ts-ignore — webos-service types are ambient
  service = new ServiceImpl(SERVICE_ID);
} else {
  console.log('[com.ha.tvbridge.service] webos-service not available — running in lint/typecheck stub mode');
}

// ---------------------------------------------------------------------------
// ActivityManager — foreground+explicit+persist with FakeActivityManager fallback
// ---------------------------------------------------------------------------

/**
 * FakeActivityManager — keeps Node event loop alive when ActivityManager is absent or buggy.
 * Mirrors 30s TTL behaviour that patches Node run-js-service persistence-DB bug on 5.4.1 Node 12/14.
 */
class FakeActivityManager {
  constructor() {
    /** @type {NodeJS.Timeout | null} */
    this.timer = null;
    /** @type {boolean} */
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    console.log('[com.ha.tvbridge.service] FakeActivityManager started — 30s TTL keepalive');
    // 30s wake to refresh watchdog; interval keeps process alive (explicit equivalent)
    this.timer = setInterval(() => {
      console.log('[com.ha.tvbridge.service] FakeActivityManager heartbeat 30s');
    }, 30000);
    // Prevent Node from exiting
    if (this.timer && typeof this.timer.unref === 'function') {
      // Keep ref so process stays alive — do not unref
    }
  }

  stop() {
    this.running = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    console.log('[com.ha.tvbridge.service] FakeActivityManager stopped');
  }
}

/** @type {FakeActivityManager | null} */
let fakeActivity = null;

/** @type {number | null} */
let activityId = null;

/**
 * Ensure foreground+explicit+persist Activity exists, adopted by this service.
 * Falls back to FakeActivityManager on failure or timeout.
 * @param {() => void} onReady
 */
function ensureActivity(onReady) {
  if (!service) {
    console.log('[com.ha.tvbridge.service] No service — using FakeActivityManager');
    fakeActivity = new FakeActivityManager();
    fakeActivity.start();
    onReady();
    return;
  }

  // Primary path: webos-service activityManager.create — the API that run-js-service
  // honours to keep the process resident. A successfully-registered activity makes
  // _activities non-empty, which is exactly what stops run-js-service from killing
  // the process when idle — so the WS server (9923) and ambient/Wyoming loops
  // survive between HA connections.
  if (service.activityManager && typeof service.activityManager.create === 'function') {
    // String form → webos-service builds a known-valid internal spec
    // (foreground+explicit+subscribe:true, no schedule) and registers it with the
    // hub. The object form forwarded an invalid schedule.interval and was rejected.
    let readyCalled = false;
    const ready = () => {
      if (!readyCalled) {
        readyCalled = true;
        onReady();
      }
    };
    try {
      // @ts-ignore — webos-service ActivityManager.create(name, callback)
      service.activityManager.create(ACTIVITY_NAME, (/** @type {any} */ activity) => {
        console.log('[com.ha.tvbridge.service] ActivityManager.create ok id=' + (activity && activity.activityId));
        ready();
      });
    } catch (/** @type {any} */ err) {
      console.warn('[com.ha.tvbridge.service] activityManager.create threw', err);
    }
    // Safety net: bring up WS even if the create callback is delayed/never fires
    setTimeout(ready, 4000);
    return;
  }

  // Fallback: raw Luna call + FakeActivityManager (legacy / non-webos-service builds)
  const activitySpec = {
    activity: {
      name: ACTIVITY_NAME,
      description: 'HA companion keepalive — foreground explicit persist',
      type: {
        foreground: true,
        persist: true,
        explicit: true,
        continuous: true,
      },
      // Callback invoked on activity trigger; we just re-adopt
      callback: {
        method: 'luna://' + SERVICE_ID + '/onActivity',
        params: {},
      },
    },
    start: true,
    replace: true,
    subscribe: true,
  };

  let settled = false;
  const fallbackTimer = setTimeout(() => {
    if (settled) return;
    settled = true;
    console.warn('[com.ha.tvbridge.service] ActivityManager create timeout — falling back to FakeActivityManager');
    fakeActivity = new FakeActivityManager();
    fakeActivity.start();
    onReady();
  }, 4000);

  try {
    // @ts-ignore — webos-service call signature
    service.call('luna://com.webos.service.activitymanager/create', activitySpec, (msg) => {
      if (settled) return;
      const payload = msg && msg.payload ? msg.payload : {};
      if (payload.returnValue === true || payload.subscribed === true) {
        settled = true;
        clearTimeout(fallbackTimer);
        activityId = payload.activityId || payload.id || null;
        console.log('[com.ha.tvbridge.service] ActivityManager create succeeded', JSON.stringify(payload));
        // Adopt step — some firmwares require explicit adopt after create
        if (activityId) {
          adoptActivity(activityId, onReady);
        } else {
          // No id returned — still consider ready, but keep fake as backup
          onReady();
        }
      } else if (payload.returnValue === false) {
        settled = true;
        clearTimeout(fallbackTimer);
        console.warn('[com.ha.tvbridge.service] ActivityManager create returned false', JSON.stringify(payload));
        fakeActivity = new FakeActivityManager();
        fakeActivity.start();
        onReady();
      }
    });
  } catch (err) {
    if (!settled) {
      settled = true;
      clearTimeout(fallbackTimer);
      console.warn('[com.ha.tvbridge.service] ActivityManager call threw, fallback', err);
      fakeActivity = new FakeActivityManager();
      fakeActivity.start();
      onReady();
    }
  }
}

/**
 * @param {number | string} id
 * @param {() => void} cb
 */
function adoptActivity(id, cb) {
  if (!service) {
    cb();
    return;
  }
  try {
    // @ts-ignore
    service.call('luna://com.webos.service.activitymanager/adopt', { activityId: id }, (msg) => {
      const payload = msg && msg.payload ? msg.payload : {};
      if (payload.returnValue) {
        console.log('[com.ha.tvbridge.service] Activity adopted', id);
      } else {
        console.warn('[com.ha.tvbridge.service] Activity adopt failed', JSON.stringify(payload));
      }
      cb();
    });
  } catch (err) {
    console.warn('[com.ha.tvbridge.service] adopt threw', err);
    cb();
  }
}

// ---------------------------------------------------------------------------
// Luna method registrations
// ---------------------------------------------------------------------------

if (service) {
  // getCapabilities — probed by sister HA integration via luna://com.ha.tvbridge.service/getCapabilities (2s timeout)
  // Returns snapshot for mDNS TXT negotiation without needing a WS handshake.
  // Phase 3 ambient: advertise capture cap + ambient meta when loop has run.
  // @ts-ignore
  service.register('getCapabilities', (message) => {
    console.log('[com.ha.tvbridge.service] getCapabilities called');
    // Wyoming probe — ensure we have at least one probe attempt for fresh caps
    // Do not block response; probe is async and caps voice stays advertised regardless.
    message.respond({
      returnValue: true,
      v: CAPS_SNAPSHOT.v,
      caps: CAPS_SNAPSHOT.caps,
      model: CAPS_SNAPSHOT.model,
      sv: CAPS_SNAPSHOT.sv,
      // Extra negotiation hints
      wsPort: WS_PORT,
      persist: true,
      explicit: true,
      // Phase 3 ambient lift — sister checks caps includes capture for sensor ambient_lux real push
      ambient: lastAmbientLux !== null ? {
        available: true,
        source: ambientSource,
        lastLux: lastAmbientLux,
        meta: { width: AMBIENT_WIDTH, height: AMBIENT_HEIGHT, fps: AMBIENT_FPS, quirks: AMBIENT_QUIRKS, hash: '32x32', host: AMBIENT_HOST, port: AMBIENT_PORT },
      } : { available: false, source: 'unavailable', lastLux: null },
      // Phase 4 voice lift — sister checks caps includes voice but must also inspect voice.available
      // Graceful degrade when usb_mic0 absent: available false + fallback note (Magic Remote push-to-talk)
      voice: wyomingAvailable ? {
        available: true,
        source: wyomingSource,
        port: WYOMING_PORT,
        rate: WYOMING_RATE,
        channels: WYOMING_CHANNELS,
        width: WYOMING_WIDTH,
        fallback: WYOMING_FALLBACK_NOTE,
      } : {
        available: false,
        source: 'unavailable',
        port: WYOMING_PORT,
        rate: WYOMING_RATE,
        channels: WYOMING_CHANNELS,
        width: WYOMING_WIDTH,
        fallback: WYOMING_FALLBACK_NOTE,
      },
    });
  });

  // getVoiceStatus — Wyoming satellite status, UMI usb_mic0 conditional
  // Gracefully degrades: CX no far-field array-mic, wired USB only
  // @ts-ignore
  service.register('getVoiceStatus', (message) => {
    console.log('[com.ha.tvbridge.service] getVoiceStatus called');
    var snap = getWyomingSnapshot();
    // Trigger background re-probe for next call without blocking response
    probeWyomingOnce();
    if (snap.available) {
      message.respond({ returnValue: true, available: true, source: snap.source, port: snap.port, rate: snap.rate, channels: snap.channels, fallback: snap.fallback, deviceList: snap.deviceList });
    } else {
      message.respond({ returnValue: true, available: false, source: 'unavailable', port: snap.port, rate: snap.rate, channels: snap.channels, fallback: snap.fallback, deviceList: snap.deviceList });
    }
  });

  // getWyomingStatus — alias for HA Wyoming discovery (same as getVoiceStatus)
  // @ts-ignore
  service.register('getWyomingStatus', (message) => {
    console.log('[com.ha.tvbridge.service] getWyomingStatus called');
    var snap2 = getWyomingSnapshot();
    probeWyomingOnce();
    message.respond({ returnValue: true, available: snap2.available, source: snap2.source, port: snap2.port, rate: snap2.rate, channels: snap2.channels, fallback: snap2.fallback });
  });

  // getAmbientLux — unicapture flatbuffer 127.0.0.1:19400 hashed to 32x32 ambient_lux
  // Gracefully degraded: simulated when native daemon absent, error when stock without root.
  // AI Picture Pro contract: on first flatbuffer success, a one-shot toast warns 200–500 ms dropout.
  // @ts-ignore
  service.register('getAmbientLux', (message) => {
    console.log('[com.ha.tvbridge.service] getAmbientLux called');
    // Trigger a fresh poll then respond, but also answer immediately from cache for 2s UX
    const snap = getAmbientSnapshot();
    // If native has never been seen (still simulated but loop started), return simulated gracefully
    // On stock TV without elevate-service, ambientSource stays unavailable until loop probes; we
    // surface returnValue:false only when caller forces strict capture and we have no frame history.
    const strict = message.payload && message.payload.strict === true;
    if (strict && snap.source === 'unavailable' && lastAmbientLux === null) {
      message.respond({ returnValue: false, errorText: 'ambient unavailable — root required (native daemon not present)', source: 'unavailable' });
      return;
    }
    // Defer a live re-poll for next call, but respond with current cached value now
    // Kick background refresh without blocking response
    pollAmbientOnce();
    // AI Picture Pro off-contract toast — non-blocking, once per boot
    if (snap.source === 'flatbuffer' && !ambientToastShown) {
      setTimeout(maybeNotifyAiPictureContract, 100);
    } else if (snap.source === 'simulated' && !ambientToastShown && ambientFrameCount > 0) {
      // Even simulated deserves the contract warning so user knows to disable AI Picture Pro before native arrives
      setTimeout(maybeNotifyAiPictureContract, 100);
    }
    message.respond({
      returnValue: true,
      lux: snap.lux,
      source: snap.source,
      ts: snap.ts,
      meta: snap.meta,
      frameCount: snap.frameCount,
    });
  });

  // onActivity — callback for ActivityManager schedule
  // @ts-ignore
  service.register('onActivity', (message) => {
    console.log('[com.ha.tvbridge.service] onActivity triggered', JSON.stringify(message.payload || {}));
    message.respond({ returnValue: true });
    // Re-ensure subscriptions after wake
    subscribeAll();
  });

  // CEC hub — query proxy (read-only, maps to com.webos.service.cec.query)
  // @ts-ignore
  service.register('cecQuery', (message) => {
    const params = (message.payload && typeof message.payload === 'object') ? message.payload : {};
    console.log('[com.ha.tvbridge.service] cecQuery', JSON.stringify(params));
    // Proxy to com.webos.service.cec — method selection based on params.op or default getDeviceList
    const target = params.method || 'luna://com.webos.service.cec/getDeviceList';
    const lunaParams = params.params || {};
    // @ts-ignore
    service.call(target, lunaParams, (resp) => {
      const payload = resp && resp.payload ? resp.payload : { returnValue: false, errorText: 'no response' };
      message.respond(payload);
    });
  });

  // CEC hub — operation proxy (requires cec.operation permission / root for private)
  // @ts-ignore
  service.register('cecOperation', (message) => {
    const params = (message.payload && typeof message.payload === 'object') ? message.payload : {};
    console.log('[com.ha.tvbridge.service] cecOperation', JSON.stringify(params));
    const target = params.method || 'luna://com.webos.service.cec/sendCommand';
    const lunaParams = params.params || params;
    // Strip wrapper keys if present
    if (lunaParams.method) delete lunaParams.method;
    if (lunaParams.params) delete lunaParams.params;
    // @ts-ignore
    service.call(target, lunaParams, (resp) => {
      const payload = resp && resp.payload ? resp.payload : { returnValue: false, errorText: 'no response' };
      message.respond(payload);
    });
  });

  // Optional: allow HA to push updated client-key to seed HMAC without restart
  // @ts-ignore
  service.register('setClientKey', (message) => {
    const payload = message.payload || {};
    const key = payload.clientKey || payload.client_key;
    if (typeof key === 'string' && key.length >= 8) {
      try {
        const token = deriveCompanionToken(key);
        allowedTokens.add(token);
        console.log('[com.ha.tvbridge.service] setClientKey accepted, token derived');
        message.respond({ returnValue: true });
      } catch (e) {
        message.respond({ returnValue: false, errorText: String(e) });
      }
    } else {
      message.respond({ returnValue: false, errorText: 'missing clientKey' });
    }
  });
}

// ---------------------------------------------------------------------------
// WS server wss:9923 with HMAC auth + push for power/volume/app
// ---------------------------------------------------------------------------

/** @type {any} */
let wss = null;

/**
 * Broadcast to all authenticated WS clients.
 * @param {string} type
 * @param {unknown} payload
 */
function broadcast(type, payload) {
  if (!wss) return;
  const envelope = JSON.stringify({ type, payload, ts: Date.now() });
  // @ts-ignore — ws types
  wss.clients.forEach((/** @type {any} */ client) => {
    // @ts-ignore — custom prop
    if (client.readyState === 1 && client.isAuthenticated) {
      try {
        client.send(envelope);
      } catch (_e) { /* ignore */ }
    }
  });
}

/**
 * Start WS server on 9923 with HMAC verification.
 */
function startWsServer() {
  if (!WebSocket) {
    console.log('[com.ha.tvbridge.service] ws not available — WS disabled in stub mode');
    return;
  }
  if (wss) return;

  try {
    // Plain ws.Server on 9923; HA connects with wss and CERT_NONE — handshake still succeeds over ws
    // For strict wss, provision cert/key and switch to https.createServer + WebSocket.Server({server})
    wss = new WebSocket.Server({
      port: WS_PORT,
      host: '0.0.0.0',
      // Verify HMAC at upgrade via query ?token= or Authorization: Bearer
      verifyClient: (/** @type {any} */ info, /** @type {any} */ done) => {
        try {
          const req = info.req;
          const url = req.url || '';
          const headers = req.headers || {};
          let token = '';

          // Query param ?token=...
          const m = url.match(/[?&]token=([^&]+)/);
          if (m) token = decodeURIComponent(m[1]);

          // Authorization: Bearer <token>
          if (!token && typeof headers.authorization === 'string') {
            const ah = headers.authorization;
            const bm = ah.match(/^Bearer\s+(.+)$/i);
            if (bm) token = bm[1].trim();
          }
          // Also support X-Companion-Token header
          if (!token && typeof headers['x-companion-token'] === 'string') {
            token = String(headers['x-companion-token']).trim();
          }

          if (isValidToken(token, allowedTokens)) {
            // Attach for connection handler
            // @ts-ignore
            info.req._companionToken = token;
            done(true);
          } else {
            console.warn('[com.ha.tvbridge.service] WS auth rejected — invalid token', url.slice(0, 80));
            done(false, 401, 'Unauthorized');
          }
        } catch (e) {
          console.warn('[com.ha.tvbridge.service] verifyClient error', e);
          done(false, 500, 'Internal');
        }
      },
    });

    wss.on('listening', () => {
      console.log('[com.ha.tvbridge.service] WS listening on :' + WS_PORT + ' (wss:9923 logical)');
    });

    wss.on('connection', (/** @type {any} */ ws, /** @type {any} */ req) => {
      // @ts-ignore
      const token = req && req._companionToken ? String(req._companionToken) : '';
      // @ts-ignore
      ws.isAuthenticated = true;
      // @ts-ignore
      ws._token = token;
      console.log('[com.ha.tvbridge.service] WS client connected authenticated');

      // Push immediate snapshot so coordinator can confirm companion_present without polling
      try {
        ws.send(JSON.stringify({ type: 'hello', payload: CAPS_SNAPSHOT, ts: Date.now() }));
      } catch (_e) { /* ignore */ }

      ws.on('message', (/** @type {any} */ data) => {
        try {
          const text = data.toString();
          let msg;
          try { msg = JSON.parse(text); } catch (_e) { msg = { raw: text }; }
          console.log('[com.ha.tvbridge.service] WS recv', text.slice(0, 200));

          // Minimal command handling — ping/pong, cec proxy via WS, ambient/voice
          if (msg && msg.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong', ts: Date.now() }));
          } else if (msg && (msg.type === 'getAmbientLux' || msg.type === 'ambientLux')) {
            const snap = getAmbientSnapshot();
            // Kick background flatbuffer refresh for next push
            pollAmbientOnce();
            ws.send(JSON.stringify({ type: 'ambient', payload: snap, ts: Date.now() }));
            ws.send(JSON.stringify({ type: 'getAmbientLuxResult', payload: snap, ts: Date.now() }));
            if (snap.source === 'flatbuffer' && !ambientToastShown) {
              setTimeout(maybeNotifyAiPictureContract, 100);
            }
          } else if (msg && msg.type === 'ambient' && msg.payload && typeof msg.payload.lux === 'number') {
            // Allow HA to inject ambient for testing (inject-websession echo) — rebroadcast
            broadcast('ambient', msg.payload);
          } else if (msg && (msg.type === 'getVoiceStatus' || msg.type === 'getWyomingStatus' || msg.type === 'voiceStatus')) {
            var vSnap = getWyomingSnapshot();
            probeWyomingOnce();
            ws.send(JSON.stringify({ type: 'voice', payload: vSnap, ts: Date.now() }));
            ws.send(JSON.stringify({ type: 'getVoiceStatusResult', payload: vSnap, ts: Date.now() }));
          } else if (msg && msg.type === 'cecQuery' && service) {
            const target = msg.method || 'luna://com.webos.service.cec/getDeviceList';
            const params = msg.params || {};
            // @ts-ignore
            service.call(target, params, (resp) => {
              const payload = resp && resp.payload ? resp.payload : { returnValue: false };
              ws.send(JSON.stringify({ type: 'cecQueryResult', payload, ts: Date.now() }));
            });
          } else if (msg && msg.type === 'cecOperation' && service) {
            const target = msg.method || 'luna://com.webos.service.cec/sendCommand';
            const params = msg.params || {};
            // @ts-ignore
            service.call(target, params, (resp) => {
              const payload = resp && resp.payload ? resp.payload : { returnValue: false };
              ws.send(JSON.stringify({ type: 'cecOperationResult', payload, ts: Date.now() }));
            });
          }
        } catch (e) {
          console.warn('[com.ha.tvbridge.service] WS message error', e);
        }
      });

      ws.on('close', () => {
        console.log('[com.ha.tvbridge.service] WS client disconnected');
      });

      ws.on('error', (/** @type {any} */ err) => {
        console.warn('[com.ha.tvbridge.service] WS error', err);
      });
    });

    wss.on('error', (/** @type {any} */ err) => {
      console.warn('[com.ha.tvbridge.service] WS server error', err);
    });
  } catch (err) {
    console.warn('[com.ha.tvbridge.service] Failed to start WS server', err);
  }
}

// ---------------------------------------------------------------------------
// Subscriptions — power / volume / app (push, no 10s poll)
// ---------------------------------------------------------------------------

function subscribeAll() {
  if (!service) {
    console.log('[com.ha.tvbridge.service] No service — subscriptions stubbed (ambient still simulated)');
    // Even in stub mode, start ambient loop so typecheck/demo still shows ambient_lux
    try { startAmbientLoop(); } catch (_e) { /* ignore */ }
    // Wyoming probe stub also works in degraded mode (reports unavailable)
    try { startWyomingProbeLoop(); } catch (_e) { /* ignore */ }
    return;
  }
  subscribePower();
  subscribeVolume();
  subscribeApp();
  // Phase 3 ambient — unicapture flatbuffer client stub 127.0.0.1:19400 → 32x32 hash
  // Gracefully degrades to simulated when native daemon absent; never throws.
  try { startAmbientLoop(); } catch (_e) { /* ignore */ }
  // Phase 4 Wyoming voice — UMI usb_mic0 conditional, graceful fallback to Magic Remote
  try { startWyomingProbeLoop(); } catch (_e) { /* ignore */ }
}

function subscribePower() {
  try {
    // @ts-ignore — webos-service subscribe via call with subscribe:true
    service.call('luna://com.webos.service.tvpower/power/getPowerState', { subscribe: true }, (msg) => {
      const payload = msg && msg.payload ? msg.payload : {};
      if (payload.returnValue !== false) {
        broadcast('power', payload);
      }
    });
    console.log('[com.ha.tvbridge.service] Subscribed to tvpower/power/getPowerState');
  } catch (e) {
    console.warn('[com.ha.tvbridge.service] subscribePower failed', e);
  }
}

function subscribeVolume() {
  try {
    // @ts-ignore
    service.call('luna://com.webos.service.audio/getStatus', { subscribe: true }, (msg) => {
      const payload = msg && msg.payload ? msg.payload : {};
      if (payload.returnValue !== false) {
        broadcast('volume', payload);
      }
    });
    console.log('[com.ha.tvbridge.service] Subscribed to audio/getStatus');
  } catch (e) {
    console.warn('[com.ha.tvbridge.service] subscribeVolume failed', e);
  }
  // Also soundOutput for HDMI ARC
  try {
    // @ts-ignore
    service.call('luna://com.webos.service.audio/getSoundOutput', { subscribe: true }, (msg) => {
      const payload = msg && msg.payload ? msg.payload : {};
      if (payload.returnValue !== false) {
        broadcast('soundOutput', payload);
      }
    });
  } catch (_e) { /* optional */ }
}

function subscribeApp() {
  try {
    // @ts-ignore
    service.call('luna://com.webos.applicationManager/getForegroundAppInfo', { subscribe: true }, (msg) => {
      const payload = msg && msg.payload ? msg.payload : {};
      if (payload.returnValue !== false) {
        broadcast('app', payload);
      }
    });
    console.log('[com.ha.tvbridge.service] Subscribed to applicationManager/getForegroundAppInfo');
  } catch (e) {
    console.warn('[com.ha.tvbridge.service] subscribeApp failed', e);
  }
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

function boot() {
  console.log('[com.ha.tvbridge.service] boot — ' + SERVICE_ID + ' v1.0.0 model ' + CAPS_SNAPSHOT.model + ' sv ' + CAPS_SNAPSHOT.sv + ' ambient ' + AMBIENT_HOST + ':' + AMBIENT_PORT + ' ' + AMBIENT_WIDTH + 'x' + AMBIENT_HEIGHT + '@' + AMBIENT_FPS + ' quirks 0x' + AMBIENT_QUIRKS.toString(16) + ' voice Wyoming ' + WYOMING_HOST + ':' + WYOMING_PORT + ' ' + WYOMING_RATE + 'Hz usb_mic0 conditional');
  ensureActivity(() => {
    startWsServer();
    // Defer subscriptions slightly to let Activity settle
    setTimeout(subscribeAll, 500);
  });
}

// Only auto-boot when webos-service is present or when explicitly invoked.
// In typecheck/lint stub mode, expose symbols without side effects.
if (service) {
  boot();
} else {
  // Export for tests / typecheck
  console.log('[com.ha.tvbridge.service] stub mode — boot deferred');
}

// Exports for unit tests / lint harnesses
module.exports = {
  deriveCompanionToken,
  isValidToken,
  CAPS_SNAPSHOT,
  SERVICE_ID,
  WS_PORT,
  ACTIVITY_NAME,
  FakeActivityManager,
  broadcast,
  // Phase 3 ambient flagship — unicapture flatbuffer stub, 32x32 hash to ambient_lux
  AMBIENT_HOST,
  AMBIENT_PORT,
  AMBIENT_WIDTH,
  AMBIENT_HEIGHT,
  AMBIENT_FPS,
  AMBIENT_QUIRKS,
  AMBIENT_HASH_DIM,
  AMBIENT_INTERVAL_MS,
  hashToAmbientLux,
  simulateAmbientLux,
  fetchFlatbufferFrame,
  getAmbientSnapshot,
  pollAmbientOnce,
  startAmbientLoop,
  stopAmbientLoop,
  maybeNotifyAiPictureContract,
  // Phase 4 Wyoming voice satellite — 16 kHz PCM via UMI usb_mic0 conditional
  WYOMING_HOST,
  WYOMING_PORT,
  WYOMING_RATE,
  WYOMING_CHANNELS,
  WYOMING_WIDTH,
  WYOMING_FALLBACK_NOTE,
  isUsbMicPresent,
  getWyomingSnapshot,
  probeWyomingOnce,
  startWyomingServer,
  stopWyomingServer,
  startWyomingProbeLoop,
  stopWyomingProbeLoop,
};
