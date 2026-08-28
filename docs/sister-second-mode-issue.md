---
title: "feat: native-app-present second mode — companion WS + capability negotiation"
labels: enhancement, platinum
---

## Summary
Add root-aware second mode to `ha_chros73_bscpylgtv` that auto-detects `com.ha.tvbridge` on 10.1.1.209 via SSDP→WS HB exec→mDNS TXT→cap probe, installs IPK on consent via Homebrew/appInstallService hybrid, and gates 7 new entities behind `companion_present`.

Full design is §10 of research/notes/final_report_lgtv-webos-ha-root-1a89ff.md. This issue tracks the 15 tests and `quality_scale.yaml` strict-typing lift.

## Acceptance Criteria
- `ruff` + `mypy --strict` + `pytest -q 340` + `hassfest` 54/54 done
- See roadmap §10 for 15 enumerated tests.

## Phase 3 addendum — ambient flagship (Iteration 4215abe1 2026-10-13×14, Issues #12 #13)

> Depends on §2 matrix row 8, §3-5 hybrid lifecycle, and Phase 2 JS service already landed (`com.ha.tvbridge.service` `wss:9923` + ActivityManager). This phase implements layer 3 conditional native `init.d` daemon re-using `hyperion-webos` `unicapture` pattern (`libvtcapture` + `libhalgal` flatbuffer `127.0.0.1:19400` at `256×144@30` CX budget, quirks `0x1|0x2|0x40|0x100` → `0x143` (323), `32×32` hash for `ambient_lux`). It is the flagship rooted justification and must degrade gracefully on stock.

### What landed in this repo (lgtv-webos-homeassistant)

- **`native/` scaffold** — `README.md` + `init.d/com.ha.tvbridge.ambient` (webosbrew `startup.sh` → `/var/lib/webosbrew/init.d` forwarding to JS service) + `elevate-service.md` (`roles.d` `all` + `ls-control scan-services`) + `FLATBUFFER_PROTOCOL.md` (CX budget, quirks, `32×32` hash, AI Picture Pro contract) + `types/ambient-bridge.d.ts`.
- **`com.ha.tvbridge.service/service.js` ambient bridge** — unicapture flatbuffer client stub reading `127.0.0.1:19400` (or simulating when absent), hashing to `32×32` `ambient_lux`, exposing via WS (`type: ambient`, `type: getAmbientLux`) and via Luna `luna://com.ha.tvbridge.service/getAmbientLux` (cached + background `pollAmbientOnce`), and respecting AI Picture Pro off-contract toast via `system.notifications/createToast` (one-shot per boot, `maybeNotifyAiPictureContract`).
- **Graceful degrade** — when native daemon absent: `source: simulated`, jitter `±10 lx` around `lastAmbientLux` or `100 lx`; when stock TV without root: `getAmbientLux` with `strict:true` returns `{returnValue:false, errorText:"ambient unavailable — root required"}` and `getCapabilities.ambient.available: false`.

### Sister repo direction — `sensor ambient_lux` real push

`sensor ambient_lux` was already gated Phase 1 (`available: companion_present and "capture" in companion_caps`). With this scaffold it now gets **real push** when companion caps includes `capture`:

- **Companion `getCapabilities`** now returns `ambient: {available, source, lastLux, meta}` alongside `v/caps/model/sv/wsPort`. Sister coordinator should treat `caps includes "capture"` **or** `ambient.available` as the gate for real push (backwards compat: `capture` cap alone still gates).
- **WS push** — JS service broadcasts `{"type":"ambient","payload":{"lux":216,"source":"flatbuffer","ts":...,"meta":{...}}}` every `2000 ms` and answers `getAmbientLux` over WS (`type: getAmbientLux` → `ambient` + `getAmbientLuxResult`). Sister coordinator’s `WebOsClient` companion WS should subscribe to `ambient` and call `coordinator.async_set_updated_data` to drive `sensor ambient_lux` (`device_class illuminance`, `state_class measurement`, `unit lx`) without polling.
- **Luna pull** — `luna://com.ha.tvbridge.service/getAmbientLux` remains the 2 s `test_before_configure` companion probe for `mDNS` TXT `cap=capture` race; sister should prefer WS push but keep Luna as fallback for `inject-websession` diagnostics.
- **AI Picture Pro contract** — when `ambient.source === "flatbuffer"` the TV shows a one-shot toast: *“Ambient capture active — turn off AI Picture Pro … (Settings → General → AI Service)”*. Sister docs should surface this as a persistent notification/repair issue with the same wording and link to `native/FLATBUFFER_PROTOCOL.md` — do not auto-remediate, just warn (PicCap dropout `200–500 ms` contract).
- **Docs only** — do not yet fully implement native daemon in sister (`ha_chros73_bscpylgtv`); only docs + gating. The native binary stays in `lgtv-webos-homeassistant/native` and is built via `buildroot-nc4`. Sister’s `ambient_lux` entity stays `available: false` (not removed) when companion absent, `diagnostics` redacts `host/client_key/ipkHash` + raw `lux` hash, and `capture` cap absence is an `Unavailable` not a `Remove`.

### Verify (sister, docs-only)

- `grep -R ambient_lux custom_components` shows `available: companion_present` gate intact.
- `com.ha.tvbridge.service/getAmbientLux` via `luna-send` or `wscat -c ws://10.1.1.209:9923?type=getAmbientLux` returns `{lux, source, meta}`.
- `docs/sister-second-mode-issue.md` Phase 3 section present; no code change in sister yet beyond docs comment.

References: `native/README.md`, `native/FLATBUFFER_PROTOCOL.md`, `types/ambient-bridge.d.ts`, `native/elevate-service.md`, `webosbrew/hyperion-webos`, `TBSniller/piccap`.

### Roadmap traceability

- §2 matrix row 8 (capture/ambient) + §3-5 hybrid lifecycle → Phase 3 Iteration `4215abe1` 2026-10-13×14 → Issues **#12 unicapture native** + **#13 camera ambient_lux** (both `Todo` → scaffold `In Progress` next).

