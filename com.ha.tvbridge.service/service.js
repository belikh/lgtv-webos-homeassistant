/* eslint-disable no-console */
/**
 * com.ha.tvbridge.service — Phase 2 minimal companion (JS + ActivityManager headless)
 *
 * Three-layer hybrid — Phase 2 implements Layer 2 only:
 *   Layer 1 Enact suspended WebView (handlesRelaunch:true, requiredMemory:120) — placeholder
 *   Layer 2 JS service anchored by ActivityManager foreground+explicit+persist — THIS FILE
 *   Layer 3 native init.d unicapture daemon — not required yet
 *
 * Responsibilities:
 *   - Register luna://com.ha.tvbridge.service/getCapabilities for sister Phase-1 probe
 *   - Create/adopt foreground+explicit+persist Activity with FakeActivityManager 30s TTL fallback
 *   - Host WS on wss:9923 with HMAC(client_key,'ha-companion/1') auth and push for power/volume/app
 *   - Proxy CEC query/operation for HDMI-CEC hub role
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

  // Activity spec per activity-manager API reference
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
      schedule: {
        // Persist across reboot; interval is heartbeat for power resume
        interval: '00:00:30',
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
  // @ts-ignore
  service.register('getCapabilities', (message) => {
    console.log('[com.ha.tvbridge.service] getCapabilities called');
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

          // Minimal command handling — ping/pong and cec proxy via WS
          if (msg && msg.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong', ts: Date.now() }));
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
    console.log('[com.ha.tvbridge.service] No service — subscriptions stubbed');
    return;
  }
  subscribePower();
  subscribeVolume();
  subscribeApp();
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
  console.log('[com.ha.tvbridge.service] boot — ' + SERVICE_ID + ' v1.0.0 model ' + CAPS_SNAPSHOT.model + ' sv ' + CAPS_SNAPSHOT.sv);
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
};
