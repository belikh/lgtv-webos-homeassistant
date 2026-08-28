# native — layer 3 unicapture ambient daemon (Phase 3 scaffold)

> **Flagship rooted justification** — graceful degrade on stock. This layer is conditional; when absent, Phase 2 JS service remains fully functional and `sensor ambient_lux` is `available: false` (not removed).

## Architecture — three-layer hybrid (§4)

- **Layer 1 Enact** `com.ha.tvbridge` — suspended WebView `handlesRelaunch:true` `requiredMemory 120` (Lovelace dashboard, not required for ambient).
- **Layer 2 JS service** `com.ha.tvbridge.service` — `foreground+explicit+persist` Activity via `ActivityManager` + `FakeActivityManager` 30 s TTL fallback, `wss:9923` WS, `cec` proxy, and **ambient bridge** polling `127.0.0.1:19400`.
- **Layer 3 native** `com.ha.tvbridge.ambient` — optional `init.d` daemon re-using `hyperion-webos` `unicapture` pattern. This directory scaffolds it.

Without root or without this daemon, Layer 2 falls back to a simulated `ambient_lux` (≈100 lx jitter) and flags `source: simulated` so Home Assistant can mark the entity `unavailable` or `simulated`. No crash; no entity removed.

## Files in this scaffold

| File | Purpose |
|---|---|
| `init.d/com.ha.tvbridge.ambient` | `webosbrew` `startup.sh` template installed to `/var/lib/webosbrew/init.d/`; respawns `unicapture` and forwards flatbuffer to `127.0.0.1:19400` |
| `elevate-service.md` | `roles.d` `all` acls patch note (`allowedNames ['*']` + `client-permissions ['all']` + `ls-control scan-services`) re-using `hyperion-webos` elevate pattern |
| `FLATBUFFER_PROTOCOL.md` | Flatbuffer frame layout, CX budget `256x144@30`, quirks `0x1|0x2|0x40|0x100`, and `32×32` hash to `ambient_lux` |
| `../types/ambient-bridge.d.ts` | TypeScript ambient bridge types shared between JS service and future HA sensor |

## Install contract — webosbrew `startup.sh` / `init.d`

Homebrew’s `startup.sh` (copied from `/media/developer/apps/usr/palm/services/org.webosbrew.hbchannel.service/startup.sh` to `/var/lib/webosbrew/startup.sh`) runs as root early in boot, before Luna `SAM`, with `webosbrew_failsafe` telnet at `/var/luna/preferences/webosbrew_failsafe`. It executes `run-parts /var/lib/webosbrew/init.d` after `elevate-service` [[github-webosbrewwebos-homebrew-channel-unofficial-webos-tv-homebrew-store-and-ro]].

The ambient daemon belongs there, not in `SAM`:

```sh
# TV install (HB exec proxy or Dropbear 22):
scp native/init.d/com.ha.tvbridge.ambient root@10.1.1.209:/var/lib/webosbrew/init.d/com.ha.tvbridge.ambient
chmod +x /var/lib/webosbrew/init.d/com.ha.tvbridge.ambient
luna-send -n 1 luna://org.webosbrew.hbchannel.service/exec '{"command":"ls-control scan-services"}'
# verify:
cat /var/lib/webosbrew/init.d/com.ha.tvbridge.ambient
tail -n 50 /tmp/var/log/messages | grep com.ha.tvbridge.ambient
netstat -lnpt | grep 19400
```

Delta OTA may wipe `/var/lib/luna-service2/roles.d` and `/overlay` — see `R-OTA-fragility` in ROADMAP §11. After OTA, `companion_present` becomes `false` and HA surfaces a repair issue; re-probe `uid=0` and re-install via `startup.sh`.

## CX budget — why 256×144@30

- SoC `Alpha 9 Gen 3` quad `0xd05`, 3 GiB (MemAvailable ~832 MiB), `hyperion-webos` `unicapture` blending `libvtcapture` (video, `5.x+`) + `libhalgal` (UI, `5.x+`) — only viable at ≥ `webOS 5.x` on this panel [[github-webosbrewhyperion-webos-hyperionng-video-grabber-for-webos-github]].
- `256×144@30` (NV12 `~55 KiB` per frame) is the CX-balanced ceiling that keeps `hyperhdr` preview at `8090` and leaves headroom for the suspended Enact `120 MiB`. PicCap warns `AI Picture Pro / AI Brightness / AI Genre` must be `off` or `200–500 ms` dropout [[github-tbsnillerpiccap-piccap-hyperion-sender-app-ambilight-for-lg-webos-tvs-git]].
- Quirks probed per CX: `QUIRK_DILE_VT_CREATE_EX 0x1 | QUIRK_DILE_VT_NO_FREEZE_CAPTURE 0x2 | QUIRK_ALTERNATIVE_DUMP_LOCATION_5 0x40 | QUIRK_VTCAPTURE_FORCE_CAPTURE 0x100` → `0x143` (323). Calculator: `quirks = 0x1|0x2|0x40|0x100`. See `FLATBUFFER_PROTOCOL.md`.

## Graceful degrade

| Condition | Behaviour |
|---|---|
| Native daemon present on `127.0.0.1:19400` | JS service reads flatbuffer, hashes `32×32` → `ambient_lux`, broadcasts `ambient` WS `source: flatbuffer` |
| Daemon absent or `connect ECONNREFUSED` / timeout | JS service simulates `ambient_lux` with jitter, `source: simulated`, and still answers `getAmbientLux` — no `throw` |
| Stock TV (no root, no `elevate-service`) | `init.d` absent, `capture` ACL stays `401`; `getAmbientLux` returns `{returnValue:false, errorText:"ambient unavailable — root required"}` and WS `capture` cap is not advertised |
| AI Picture Pro ON | One-shot toast via `system.notifications/createToast` once per boot: “Ambient capture active — turn off AI Picture Pro …” — non-blocking, ignored if ACL not yet elevated |

## References

- `webosbrew/hyperion-webos` — unicapture `libvtcapture` + `libhalgal` flatbuffer `127.0.0.1:19400`, quirks `0x1|0x2|0x40|0x100`, `libyuv`/`flatbuffers` [[github-webosbrewhyperion-webos-hyperionng-video-grabber-for-webos-github]]
- `TBSniller/piccap` — PicCap Hyperion Sender App, `scp` + `luna://com.webos.appInstallService/dev/install` canonical pattern, AI Picture Pro dropout warning [[github-tbsnillerpiccap-piccap-hyperion-sender-app-ambilight-for-lg-webos-tvs-git]]
- `webosbrew/webos-homebrew-channel` — `startup.sh` / `init.d` / `elevate-service.ts` (`allowedNames ['*']`, `client-permissions ['all']`, `ls-control scan-services`) [[github-webosbrewwebos-homebrew-channel-unofficial-webos-tv-homebrew-store-and-ro]] / [[elevate-servicets]]
- `security-guide-webos-open-source-edition` Sec. 5 Luna ACG / TrustLevel `dev|part|oem` [[security-guide-webos-open-source-edition]] / [[luna-service-bus-webos-homebrew-project]]

## Next steps (Iteration 4215abe1)

1. Native binary build via `buildroot-nc4` toolchain (`TOOLCHAIN_FILE` + `cmake` + `make hyperion-webos`) — not scaffolded here.
2. HA sister `sensor ambient_lux` real push when `companion_caps` includes `capture` (see `docs/sister-second-mode-issue.md` § Phase 3 addendum).
3. `ares-package` will include `native/` only when the binary is present; for this scaffold, `ares-package com.ha.tvbridge com.ha.tvbridge.service` remains the verify gate.
