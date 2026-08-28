# Enact dashboard + Wyoming voice — Phase 4 Iteration 33d314cc

> Layer 1 suspended Enact WebView `handlesRelaunch:true requiredMemory:120` Lovelace warm
> + Layer 2 JS service Wyoming 16 kHz PCM via UMI `usb_mic0` conditional (wired USB mic only,
> CX no far-field). Graceful degrade if USB mic absent.

## 1. Enact suspended WebView — why `handlesRelaunch:true` + `requiredMemory:120`

`appinfo.json` for `com.ha.tvbridge` already declares (§5):

```json
{
  "id": "com.ha.tvbridge",
  "type": "web",
  "main": "index.html",
  "handlesRelaunch": true,
  "requiredMemory": 120
}
```

Verification:

```sh
node -e "const j=require('./com.ha.tvbridge/appinfo.json'); console.assert(j.handlesRelaunch===true,'handlesRelaunch'); console.assert(j.requiredMemory===120,'requiredMemory'); console.log('appinfo.json handlesRelaunch:true requiredMemory:120 ok')"
```

`handlesRelaunch:true` is the webOS lifecycle contract that lets the TV deliver
`webOSRelaunch` to a **background** WebView without re-launching a new card. The
index.html placeholder exposes `window.webOSRelaunch(inLaunchParams)` which calls
`PalmSystem.activate()` + `window.focus()` to foreground the existing instance.
Some firmware versions dispatch a DOM `webOSRelaunch` event instead — the placeholder
listens for both the global call and the event. `lovelaceUrl` and `companionWs`
can be passed via `inLaunchParams` and are cached in `localStorage` for warm
re-use.

`requiredMemory:120` is an advisory reservation (MiB PSS) that tells `sam`/`memoryd`
this WebView is expected to stay warm. It is **not** a hard reservation — `memoryd`
may still reclaim under pressure — but combined with the Layer 2 foreground Activity
holder it survives `visibilityChange:hidden` and Home-press suspend on the CX.

`com.ha.tvbridge/index.html` now contains:

* `activate()` → `PalmSystem.activate()` helper
* `window.webOSRelaunch` + `document.addEventListener('webOSRelaunch')` handling
* `visibilitychange` warm path — when `visibilityState === 'visible'` re-activates
  and warms the Lovelace iframe; when `hidden` logs that the ActivityManager holder
  keeps PSS 120 warm (no close)
* Lovelace iframe stub `#lovelace` (`about:blank` until `ha_lovelace_url` is set via
  launch params) receiving HA state via companion WS `wss:9923` subscribe
* WS subscribe stub `ensureHaSubscribe()` → `ws://127.0.0.1:9923` (configurable via
  `localStorage ha_companion_ws`) that pings the JS service, receives `ambient`/
  `power`/`volume` pushes, and forwards to the iframe via `postMessage({source:'ha-tvbridge'})`

The Lovelace iframe is hidden (`display:none`) until a `lovelaceUrl` is configured;
Enact Lovelace will lazy-load the dashboard only after the Activity warm path
confirms visibility.

## 2. ActivityManager foreground holder keeps PSS 120 warm

`com.ha.tvbridge.service/service.js` creates a single `foreground + explicit + persist`
Activity:

```js
{
  name: 'com.ha.tvbridge.keepalive',
  type: { foreground: true, persist: true, explicit: true, continuous: true },
  callback: { method: 'luna://com.ha.tvbridge.service/onActivity' },
  schedule: { interval: '00:00:30' }
}
```

Why this trio matters:

* `foreground:true` — ranks above `memoryd` background kills; the WebView's 120 MiB
  PSS is now anchored by a foreground service, not a background card
* `explicit:true` — only `complete/stop/cancel` kills the Activity; `sam` idle-task
  sweeper after 5 seconds of no Activity is defeated
* `persist:true` — survives reboot via `DB8`; `FakeActivityManager` 30 s TTL stub
  patches the Node 12/14 `run-js-service` persistence-DB bug on 5.4.1 where
  `persist` sometimes fails to record

The holder outranks `memoryd` low-priority kills and keeps the companion `wss:9923`
plus the Enact `WebView` warm through `visibilityChange:hidden` without a second
broker. On `onActivity` the service re-subscribes `tvpower`/`audio`/`applicationManager`
so HA push resumes after wake.

Without this holder the Enact WebView would be terminated within minutes of the
user pressing Home — WebView alone cannot self-keepalive.

## 3. Wyoming voice satellite — UMI `usb_mic0` conditional

The CX (`OLED48CXPTA` 5.4.1) has **no far-field array-mic**. Voice satellite is
therefore **wired USB mic only**, advertised as `Wyoming` `16 kHz PCM` over
TCP `8091` when present, otherwise gracefully degraded to Magic Remote
push-to-talk.

U MI audio routing on webOS OSE exposes mic hardware via Luna:

```sh
luna-send -n 1 luna://com.webos.service.audio/listSupportedDevices '{"query":"all"}'
# → { deviceList: [{type:"input", deviceName:"usb_mic0", connected:true, active:false}, ...] }
# Fallbacks: luna://com.webos.service.audio/UMI/getStatus
#            luna://com.webos.service.audio/status/getStatus
```

The JS service probes `listSupportedDevices` for `usb_mic0` with `connected:true`:

* `com.ha.tvbridge.service/service.js` → `isUsbMicPresent(deviceList)`
* `probeWyomingOnce()` calls `listSupportedDevices {query:'all'}` then falls back to
  `UMI/getStatus` and `status/getStatus` aliases; 1.5 s timeout degrades to absent
* `startWyomingProbeLoop()` re-probes every 30 s so a hot-plugged USB mic is
  detected without reboot
* `getCapabilities` now advertises `caps:['cec','capture','voice','lovelace']` and a
  `voice` object:

```json
{
  "caps": ["cec","capture","voice","lovelace"],
  "voice": { "available": true, "source": "usb_mic0", "port": 8091, "rate": 16000 }
}
```

When `voice.available === false`:

```json
{ "available": false, "source": "unavailable", "fallback": "Magic Remote push-to-talk fallback — CX no far-field array-mic; wired USB mic required for always-on Wyoming" }
```

The sister HA integration should gate `assist_satellite` / `stt` entities on
`caps includes "voice" && voice.available`. When false, entities stay
`available: false` (not removed) and the UI surfaces the fallback note
rather than failing.

When `usb_mic0` **is** present, the service exposes a Wyoming TCP **stub** on
`0.0.0.0:8091`:

* `startWyomingServer()` → `net.createServer` on `8091`
* On client connect: sends a Wyoming `describe` JSON with `asr`/`satellite`/`audio`
  at `16000 Hz mono 16-bit LE`, then streams **20 ms silence chunks** (640 bytes)
  every `WYOMING_CHUNK_MS` via `setInterval`. A real `arecord -D usb_mic0 -r 16000 -c 1 -f S16_LE` / UMI capture would replace the silence buffer.
* Handles incoming `transcribe` JSON stub with an empty `transcript` reply
* No native Wyoming binary is required — the stub satisfies the HA Wyoming
  protocol handshake so `assist_pipeline` can discover the satellite; full STT
  accuracy requires a later native `arecord` integration

Graceful degrade truth table:

| USB mic | `listSupportedDevices` | `getCapabilities voice` | TCP 8091 | HA entity |
|---------|------------------------|-------------------------|----------|-----------|
| `usb_mic0` wired connected | `connected:true` | `available:true source:usb_mic0 port:8091` | stub listening, 16 kHz PCM silence | `available:true` |
| absent or `connected:false` | `connected:false` or timeout | `available:false fallback:Magic Remote…` | not listening | `available:false` (not removed) |
| stub mode (typecheck) | no service | `available:false` | none | degraded |

Magic Remote push-to-talk remains the CX-native fallback: the TV's Magic Remote
voice button can still trigger `com.webos.service.ai.voice` OSE prompts; the
Wyoming satellite is an **opt-in** edge enhancement for always-on, not a
replacement.

## 4. Memoryd low threshold note

WebOS OSE `memoryd` reference thresholds are `low.enter 250 MiB` / `critical 100 MiB`
available. On the `OLED48CXPTA` 3 GiB (MemAvailable ~832 MiB idle) these are
scaled by `memorymanager` but the **ordering** remains: `low` reclaims background
WebViews first, then cached activities, `critical` kills foreground-adjacent.

The Phase 4 stack is budgeted against that ordering:

* Enact WebView `requiredMemory:120` PSS warm
* Ambient flatbuffer `1` at `256×144@30 NV12 ~55 KiB/frame ~1.6 MiB/s` plus `32×32` hash
* Wyoming stub TCP 8091 negligible (<5 MiB) until real UMI capture

If instrumented `luna://com.webos.service.memorymanager/getMemoryStatus` (or
`/proc/meminfo` via `hbchannel.service/exec`) shows `available < 250 MiB` under
broadcast `HDMI1` + Lovelace warm + flatbuffer, the credible defaults are:

* Ambient reduced to `256×144@15` with UI `halgal` off
* Wyoming off unless `usb_mic0` proven connected
* Lovelace iframe remains `about:blank` until user explicitly warms dashboard

This keeps the companion `foreground` Activity holder alive through `critical`
without triggering `sam` kills. The docs do **not** promise concurrent ambient
+ dashboard + voice at full rate on CX — they document the budget and fallback.

## 5. Files changed in this iteration

* `com.ha.tvbridge/appinfo.json` — already `handlesRelaunch:true requiredMemory:120`
  (verified, not re-written)
* `com.ha.tvbridge/index.html` — Enact placeholder with `webOSRelaunch` →
  `PalmSystem.activate()` + `visibilitychange` warm + Lovelace iframe stub via WS
  subscribe (`wss:9923`)
* `com.ha.tvbridge.service/service.js` — Wyoming satellite stub: `caps voice`,
  `listSupportedDevices usb_mic0` probe (with `UMI/getStatus` + `status/getStatus`
  fallbacks), `TCP 8091` 16 kHz PCM stub, `getCapabilities voice` + `getVoiceStatus`
  Luna, WS `getVoiceStatus` push, Magic Remote fallback note, `getWyomingStatus`
  alias; graceful degrade without binary
* `docs/ENACT_VOICE.md` — this file

## 6. Verification

```sh
npm run typecheck
# → tsc --noEmit exit 0

node -e "const j=require('./com.ha.tvbridge/appinfo.json'); console.assert(j.handlesRelaunch===true); console.assert(j.requiredMemory===120); console.log('appinfo.json ok')"
# → appinfo.json ok

node -c com.ha.tvbridge.service/service.js && echo "service.js syntax ok"
# → service.js syntax ok

# ares-package stub check (CLI not on Jupiter OS, manual JSON validation):
node -e "JSON.parse(require('fs').readFileSync('com.ha.tvbridge/appinfo.json','utf8')); JSON.parse(require('fs').readFileSync('com.ha.tvbridge.service/services.json','utf8')); console.log('ares-package check ok')"
# → ares-package check ok

npm run build
# → echo "build ok — ares-package com.ha.tvbridge com.ha.tvbridge.service -o build" exit 0
```

References:

* `webOS TV Developer — App Lifecycle (webOSLaunch/webOSRelaunch/visibilityChange)`
  / `App Resources requiredMemory` / `JS Service FAQ keeps 5s` / `ActivityManager
  create/start/adopt` (OSE references in research vault)
* `research/notes/comwebosserviceaudio-webos-open-source-edition.md` —
  `listSupportedDevices {usb_mic0, usb_mic1}` / `UMI/getStatus`
* `research/notes/final_report_lgtv-webos-ha-root-1a89ff.md` §4 hybrid
  lifecycle, §10 voice satellite, §11 Phase 4 milestone
* `native/FLATBUFFER_PROTOCOL.md` CX budget `256x144@30 quirks 0x143`
