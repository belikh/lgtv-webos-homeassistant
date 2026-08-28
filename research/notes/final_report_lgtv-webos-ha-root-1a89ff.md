---
vault_tag: lgtv-webos-ha-root-1a89ff
title: Platinum Native LG webOS Home Assistant Companion — Root Audit, Bidirectional Matrix, and Roadmap for OLED48CXPTA 5.4.1
created: 2026-08-28
---

# Platinum Native LG webOS Home Assistant Companion — Rooted 04.40.16 CX as a Full HA Edge Node

> **Gospel query:** Platinum-quality native LG webOS Home Assistant companion for ROOTED OLED48CXPTA webOS TV 5.4.1 (04.40.16 AU), faultmanager-patched-2025-08 fragile, with auto-detection + consented auto-install and ultimate edge-node roadmap.

## 1. Root vs Stock: What Rooting Actually Unlocks (Live Fingerprint Ground Truth)

Your `OLED48CXPTA` at `10.1.1.209` — webOS TV 5.4.1 product `webOSTV 5.0` kernel `4.4.84-219.jcl4tvmr.6` aarch64 `O20B0` Alpha 9 Gen 3 quad `0xd05` 3 GiB (MemAvailable ~832 MiB), `04.40.16` AU `HE_DTV_W20O_AFABABAA` — is root-authenticated live: `telnet:23` unauthenticated → `uid=0(root)`, `Dropbear 2022.83` on `22`, `/media/developer/apps/usr/palm/services/org.webosbrew.hbchannel.service` + `piccap` + `hyperhdr.loader` + `jellyfin`, overlay squashfs `964.4M` ro + writable overlay `24.7M`, and `/var/lib/webosbrew/startup.sh` copied from `/media/developer` to `/var/lib/webosbrew/startup.sh` with `init.d` respawn and failsafe flag `/var/luna/preferences/webosbrew_failsafe` [[rooting-webos-homebrew]] [[security-guide-webos-open-source-edition]] [[luna-service-bus-webos-homebrew-project]].

Live differential is the thesis ground truth. Over `ws://10.1.1.209:3000` with a throwaway `com.test` manifest and freshly-issued `client-key 3c0c137e...`, `ssap://com.webos.applicationManager/getForegroundAppInfo`, `ssap://com.webos.service.tvpower/power/getPowerState`, `ssap://audio/getStatus`, and `ssap://com.webos.service.update/getCurrentSWInformation` all returned `401 insufficient permissions` / `404 no such service` over WS. Identical `luna-send -n 1` as root over telnet returned `{'modelName':'OLED48CXPTA','returnValue':true}` and `{'state':'Active'}` and `{'volume':38}` — same method, different principal, opposite result. That single `401 vs 200` split is the three-tier Luna ACL in operation [[luna-service-bus-webos-homebrew-project]] [[security-guide-webos-open-source-edition]].

The Security Guide makes the gate explicit: Luna Bus LS2 enforces Access Control Groups (ACG) plus TrustLevel `dev|part|oem`; each method declares `provides:[...]` in `/usr/share/luna-service2/api-permissions.d` and groups map ACG→TrustLevel; clients need `requiredPermissions` in `appinfo.json` which the installer expands to `roles.d/api-permissions.d/client-permissions.d` [[security-guide-webos-open-source-edition]]. `luna-service-bus-webos-homebrew-project` adds: roles live in `/var/luna-service2` (store) vs `/var/luna-service2-dev` (devmode), `luna-send-pub` (= `com.webos.lunasendpub`) can only reach `public` endpoints, while `luna-send` as root carries pseudo-role `all` [[luna-service-bus-webos-homebrew-project]]. Dynamic `ls-monitor -i com.webos.service.capture` would show `{'provides':['private',`tv.services`]}` for the TV-proprietary tier — exactly what makes `capture/eim/oledepl/pqcontroller` stay 401 without root, where OSE `query/operation` methods are `dev` and unlock via `appinfo.json` alone.

On the CX, the audit compresses to three tiers:

| Tier | WS SSAP stock | With sideloaded `requiredPermissions` (no root) | As root (`luna-send` `all` or `hbchannel.service/exec` proxy) | HA entity unlocked |
|---|---|---|---|---|
| **A — stock ~30 verbs** | `com.webos.service.tvpower/power/getPowerState` via `aiowebostv` fallback, `ssap://system.notifications/createToast` gated to system but `createAlert` reachable via `com.webos.service.secondscreen.gateway` chain on older builds | already 200 | 200 | `sensor power_state`, `notify` (today's `bscpylgtv` subset) |
| **B — OSE `query/operation`** | `401` | `200` after adding `audio.operation`, `application.operation`, `com.webos.service.config` etc. to `requiredPermissions` | `200` | `volume`, `soundOutput`, `current_app` via subscriptions that depth shows succeed without elevate |
| **C — TV-proprietary `private`/`oem`** `capture`, `eim`, `oledepl`, `pqcontroller`, `tv.*`, `config/setConfigs`, `tvpower/reboot`, `attachedstoragemanager`, `cec.*` private, `camera2/V4L2` writers | `401` always | `401` still (ACG `tv.services`/`all` with TrustLevel `oem`) | `200` only after elevate-service patches `roles.d` with `allowedNames:['*']` + `client-permissions:['all']` and `ls-control scan-services`, or via `org.webosbrew.hbchannel.service/exec {'command':`...`}` shell proxy [[security-guide-webos-open-source-edition]] [[luna-service-bus-webos-homebrew-project]] [[github-tbsnillerpiccap-piccap-hyperion-sender-app-ambilight-for-lg-webos-tvs-git]] |

The crucial nuance against the 'root unlocks everything' slogan: Tier B does *not* need root on 04.40.16; a Platinum IPK declaring `[`audio.operation`,`audio.query`,`application.operation`,`config.query`,`tv.operation`]` will turn several `401`s to `200` over WS alone. Tier C is the rooted terra — `hyperion-webos` proves it: `unicapture` blending `libvtcapture` (video, `5.x+`) + `libhalgal` (UI, `5.x+`) with quirks `0x1|0x2|0x40|0x100` probed per CX, driving flatbuffer `127.0.0.1:19400` to `hyperhdr`, only works after `elevate-service` patches the `all` role [[github-webosbrewhyperion-webos-hyperionng-video-grabber-for-webos-github]] [[github-tbsnillerpiccap-piccap-hyperion-sender-app-ambilight-for-lg-webos-tvs-git]]. The colour of every row in the section 2 matrix derives from this table — stock vs permission-unlocked vs root-only is not opinion, it is `api-permissions.d` plus the live 401 probe.

Firmware fragility resets the tier's durability. `faultmanager-autoroot` notes as of `2025-08-24` that latest firmware for essentially all LG models running webOS 5,6,7,9 is patched — only `4.0` probably never, `4.5` uncertain, `10.0` factory vulnerable but `10.1+` patched [[github-throwaway96faultmanager-autoroot]]. `04.40.16` on a 2020 CX is thus pre-patch but one accepted OTAID away from permanent patch; `RootMyTV` `v1/v2` is already dead since mid-2022 [[rooting-webos-homebrew]]. `dejavuln-autoroot` covers `3.5+` but is also patched on `5+` late firmware [[github-throwaway96dejavuln-autoroot-exploit-to-root-webos-tvs-using-dejavuln-and]]. `openlgtv/epk2extract` can in principle dump `super.pak/dpmeta.pak` `rootfs` `groups.json/api.json` for this OTAID to harden the table from OSE analogue to instrumented CX, but requires per-device AES/RSA keys dumped from a running TV — an audited absence we name rather than hand-wave [[openlgtv-github]].

## 2. Bidirectional Integration Matrix — HA <-> LGTV With and Without the Companion

Rows coloured by ACL tier from §1. Transport and HA entity columns reflect depth position: single mandatory WS `wss://:3001` re-using `client_key` + mDNS `_lg-ha-companion._tcp` TXT advertisement for Platinum `local_push` [[bscpylgtvbscpylgtvwebos_clientpy-at-master-chros73bscpylgtv-github]] [[mqtt-home-assistant]]; MQTT is opt-in secondary only when a broker is zeroconf-discovered [[zero-configuration-networking-zeroconf-home-assistant]].

| # | Feature | Without companion (today via `bscpylgtv`/`aiowebostv` `ws:3000`) | With native companion (rooted) | Transport | HA entity type | ACL | Priority | Complexity |
|---|---|---|---|---|---|---|---|---|
| 1 | Power state `Active/Suspended/Screen Off` | polled `getPowerState` via WS, 10s watchdog | push via companion WS + ActivityManager `power` Activity re-launch on `resume` | WS | `sensor power_state` | A→C | P0 | M |
| 2 | Screen on/off (`com.webos.service.tvpower/power/turnOff`) | `button turnScreenOff/On` already exposed but needs `CONTROL_DISPLAY` [[github-belikhha-lg-webos-tv-vibe-coded-untested-until-later-tonight-github]] | same, but companion ensures availability during Active Standby via `powerDebounce` | WS | `button` | B | P0 | S |
| 3 | Volume / mute / soundOutput `tv_speaker/HDMI ARC/optical/BT` | `getVolume`/`getSoundOutput` subscriptions work via `aiowebostv` Tier B | push + companion UMI routing via `com.webos.service.audio` `all` for `bt` auto-switch | WS | `sensor volume`, `select sound_output` | B→C for BT | P0 | S |
| 4 | Foreground app / app launch | `getForegroundAppInfo` 401 over WS today; solved via companion JS `com.webos.applicationManager` query | companion subscribes `applicationManager/getForegroundAppInfo` as `all` and pushes `media_player current_app` | WS | `sensor current_app` + `select source` | C | P0 | M |
| 5 | Installed apps / inputs lists | `listApps` works Tier B, `extinputs` partially | companion caches `listApps` + `externalInput` and pushes diff-guarded | WS | `select source` | B | P0 | S |
| 6 | Channels / current channel | `tv/getCurrentChannel` returns `channelId` gated | companion `tv/getCurrentChannel` + `tuner` `C` via root unlocks `sensor current_channel` reliably | WS | `sensor current_channel`, `select channel` | C | P1 | M |
| 7 | Picture settings (backlight/contrast/brightness/colour) | `number` entities disabled via `getPictureSettings` Tier B when declared | companion broadens to `oledepl` `C` for `TPC/GSR` toggle + calibration numbers, warns burn-in | WS | `number`, `switch tpc/gsr` | B→C | P1 | M |
| 8 | HDMI capture / ambient light | impossible stock — DRM + capture ACL | `hyperion-webos` `unicapture` flatbuffer `127.0.0.1:19400` at `256x144@30` (CX budget) pushed as `camera` + `light` ambient | native+WS | `camera piccap_stream`, `sensor ambient_lux` | C | P0 flagship | L |
| 9 | CEC hub (TV as CEC controller) | `cec` proxy limited Tier C (stock `cec.query` read-only) | companion `com.webos.service.cec` `operation` for `cecCommand` + `arc` switch, no native daemon | WS+JS | `remote cec`, `switch arc` | C | P1 | M |
| 10 | Voice satellite (mic → Wyoming) | `com.webos.service.ai.voice` is OSE-only, TV firmware lacks `listSupportedDevices` `usb_mic0` | companion advertises Wyoming `16kHz PCM` `com.webos.service.audio/status/getStatus` UMI capture if USB mic present (`hyperhdr/piccap` pattern) | WS→Wyoming | `stt/assist_satellite` | C conditional | P2 | L |
| 11 | Dashboard renderer (Lovelace on TV) | not possible — webOS suspends `visibilityChange:hidden` | Enact suspended WebView `handlesRelaunch:true` + `PalmSystem.activate()` on `webOSRelaunch`, held warm by foreground Activity `requiredMemory 120` | Enact+Activity | `panel ha_dashboard` | B | P1 | M |
| 12 | Screenshots / JPEG | `button screenshot` via `com.webos.service.capture/executeOneShot` gated | companion `executeOneShot` with `all` acls streams JPEG to `www/bscpylgtv_<uuid>.jpg`, counts destroy `tv.services` block | WS | `button screenshot` | C | P1 | S |
| 13 | Power off via `poweroff` vs reboot | reboot needs `tvpower/power/reboot` `C` | companion `reboot` `T Config` disabled unless root proves `all` | WS | `button reboot` | C | P2 | S |
| 14 | Toast notifications / TTS | `system.notifications/createToast` gated on TV (`Toasts are only available in system apps` [[notifications-webos-tv-developer]]) | companion `hbchannel.service/exec` proxy or `com.webos.notification` `all` for `createToast` without prompt | WS | `notify lg_tv` | A→C | P0 | S |
| 15 | Magic Remote sensor / pointer / IME `TEXT` | `remote` via `input` socket works today Tier A | companion improves pointer `MOVE/CLICK/SCROLL` rate-limits + IME `TEXT` subscription | WS | `remote` | A | P0 | S |
| 16 | Network / CPU / memory / thermal | not exposed | companion probes `/proc/meminfo`, `com.webos.service.memorymanager/getMemoryStatus`, `nyx` `core_os_kernel_version` | WS | `sensor cpu`, `sensor mem_available`, `sensor thermal` | C | P1 | M |
| 17 | Tuner signal / DVR / USB storage | sideload-limited | companion `attachedstoragemanager` via `all` for USB `sensor` + `media_source` | WS | `sensor usb_storage` | C | P2 | M |
| 18 | Wake-on-LAN / MAC auto-detect | already via `ssdp` `58:fd:b1:f5:a8:66` + UDP 9 magic packet [[lg-webos-tv-home-assistant]] | companion supplements with `connectionmanager/getStatus` push so coordinator knows `Active Standby` before WOL | WS+UDP | `button wake` | A | P0 | S |
| 19 | System info / software / hello | `getSystemInfo` static states Tier A | companion `getSystemInfo`/`getSoftwareInfo`/`hello` cached, advertised via mDNS TXT `model=OLED48CXPTA sv=04.40.16` | mDNS+WS | `sensor model`, `sensor sw_version` | A | P0 | S |
| 20 | HDMI-ARC auto-switch on HA `media_player` source select | Tier B `externalInput` | companion `avoutput/setSoundOutput` with `all` for atomic switch + confirm | WS | `select sound_output` | B | P1 | S |
| 21 | A/V output `getSystemSettings` (UHD, HDR, DV) | `com.webos.service.config/getConfigs tv.capabilities` missing | companion `getSystemSettings` via `all` for `sensor hdmi_hdr` | WS | `sensor hdmi_status` | C | P1 | M |
| 22 | Channel `play_media` for `channel` `media_content_type` | `play_media` works Tier B | companion improves with direct `tuner/channel` `all` instead of `launcher/open` fallback | WS | `media_player play_media` | B | P0 | S |
| 23 | Ambient lux `sensor` (capture hash) | n/a | companion low-res `32x32` hash of unicapture flatbuffer averaged for `illuminance` | WS | `sensor ambient_lux` | C | P2 | M |
| 24 | Presence via IR receiver blocked → via `cec` client list | not exposed | companion `cec/getDeviceList` as `device_tracker` for connected HDMI clients | WS | `device_tracker cec_client` | C | P2 | M |
| 25 | Crash logs / `var/log/messages` tail | not exposed | companion `hbchannel.service/exec` `tail /tmp/var/log/messages` as `sensor tv_log` diagnostic | exec | `sensor log` (diagnostic) | C | P2 | L |
| 26 | TPC/GSR Burn-in protection toggle | `switch tpc/gsr` disabled | companion `oledepl/pqcontroller` via `all` for toggle with caution badge | WS | `switch tpc`, `switch gsr` | C | P1 | M |
| 27 | Screenshot stream (30 fps low-res preview) | n/a | companion `ws` binary frame of unicapture `NV12` at `256x144@15` as `camera` | native+WS | `camera preview` | C | P2 | L |
| 28 | Calibration LUT 1D/3D upload | `getConfigs`/`setConfigs` Tier B limited | companion `lut3d`/`dovi` via `calibration` `all` as `number` + `upload` service | WS | `number lut` | C | P2 | L |
| 29 | `com.webos.service.secondscreen.gateway` `createAlert` chaining | not for HA | companion uses gateway `APPID` spoof only where ACG review requires system `APPID` — flagged as security-sensitive |
| 30 | Pairing key `client-key` rotation via `HMAC` derivation | `bscpylgtv` sqlite `.aiopylgtv.sqlite` today | companion HMAC `HMAC(client_key,`ha-companion/1`)` as WS token, diagnostics redaction | WS | `config` | A | P0 | S |
| 31 | Discovery via SSDP urn + mDNS `_lg-ha-companion._tcp` | SSDP only `urn:lge-com:service:webos-second-screen:1` [[simple-service-discovery-protocol-ssdp-home-assistant]] | companion widens to `_lg-ha-companion._tcp` TXT `v=1 cap=cec,capture,voice,loopback` negotiated with coordinator | SSDP+mDNS | `device` | A | P0 | S |
| 32 | Subscription push vs poll watchdog 10s `UpdateFailed` | coordinator 10s liveness probe (not poll) | companion pushes `async_set_updated_data` and `ping_interval` heartbeat replaces watchdog when `companion_present` | push | `coordinator` | A | P0 | S |

Section-coloured reading: the flagship ambient/CEC-reboot/voice rows are C-tier — they *are* the rooted justification. Rows 1–5,18,22,32 are the stock parity the sister integration already tolerates; they anchor the fallback promise that no entity is removed when the companion is absent.

## 3. Auto-Detection of Root and User-Consented Auto-Installation of the IPK

Why a dedicated consented probe exists at all: Homebrew explicitly disables telnet and firmware updates on fresh install and warns `Disable LG Connect Apps ... or keep TV on separate network` [[rooting-webos-homebrew]], and HA Platinum forbids silent port-scans without `test_before_configure` + diagnostics. The probe must therefore be credential-less, consented, and ordered by least-intrusive-first.

**Credential-less cascade (implemented inside `async_step_user` before `async_create_entry`, 2 s total timeout for `test_before_configure`)**

1. **Passive SSDP** — listen for `ST: urn:lge-com:service:webos-second-screen:1` from `com.webos.service.ssdpmanager` / `ssg.ssdpmanager` [[simple-service-discovery-protocol-ssdp-home-assistant]]; this gives `host`, `deviceUUID bcdb0a17-...`, and declares `local_push` viability. No TCP probe yet.
2. **Single WS HB exec probe** — open one `ws://:3000` (or `wss://:3001` with `CERT_NONE` as `bscpylgtv` does), send `hello`, then `luna://org.webosbrew.hbchannel.service/exec {'command':'id'}` within the already-paired `client_key` context. If reply contains `uid=0(root)`, rooted is proven without touching `23`/`22` [[luna-service-bus-webos-homebrew-project]]. This is the Platinum `test_before_configure` gate that surfaces `cannot_connect` rather than opening sockets.
3. **Durable signal** — query `luna://org.webosbrew.hbchannel.service/getAppInfo` or `ls /var/lib/webosbrew/startup.sh` shadow via same HB exec; unlike volatile `/media/developer` overlay, `/var/lib/webosbrew/startup.sh` + `/var/lib/webosbrew/init.d` survive delta OTA via bind, as `startup.sh` itself documents copying from `/media/developer/apps/...` to `/var/lib/webosbrew` [[github-webosbrewwebos-homebrew-channel-unofficial-webos-tv-homebrew-store-and-ro]]. If `exec` is unreachable (HB not elevated or WS gateway gates `exec` behind pairing), fallback to **consented TCP** `23` `800 ms` connect `500 ms` banner `SSH-2.0-dropbear` check *only after* UI asks `Detect root via local network probe? [Allow]` — diagnostics redacts the probe outcome to boolean only.

False-positive hardened: devmode installs JS services under `/var/luna-service2-dev` not `/var/luna-service2` [[luna-service-bus-webos-homebrew-project]]; probe distinguishes `com.palm.service.devmode` `serviceDir /media/developer` from `org.webosbrew.hbchannel.service` `uid=0` — devmode alone is not root.

**Consented hybrid install (HA HTTP-served IPK, 15 s subscribe wait)**

The piccap manual `scp ...:/tmp/....ipk` + `luna-send -i -f luna://com.webos.appInstallService/dev/install '{'id':`...`,'ipkUrl':`/tmp/....ipk`,'subscribe':true}'` plus `FIFO installed/failed with 15 s -w` is the canonical pattern [[github-tbsnillerpiccap-piccap-hyperion-sender-app-ambilight-for-lg-webos-tvs-git]]. The companion upgrades it with integrity and channel resilience:

- **Prefer HB when HB proves root:** `luna://org.webosbrew.hbchannel.service/install {'ipkUrl':`http://<ha>:8123/api/hbchannel/.../com.ha.tvbridge.ipk`,'ipkHash':`sha256...`,'subscribe':true}` with progress `subscribed` and `installed/failed` — HB's own `install` handles `sha256sum -c` and `/var/lib/webosbrew/init.d` respawn + `ls-control scan-services` for the `all` role, and HA serves the IPK via its own `http` component because HB's `ipkUrl` is HTTP-only [[github-webosbrewwebos-homebrew-channel-unofficial-webos-tv-homebrew-store-and-ro]].
- **Fallback direct:** `scp` to `/tmp/com.ha.tvbridge.ipk` via Dropbear `22` (root key) or ares prisoner `9922` (devmode key+passphrase) via `dev-manager-desktop` flow [[github-webosbrewdev-manager-desktop-devicedevmode-manager-for-webos-tv-github]] [[cli-developer-guide-webos-tv-developer]], then `sha256sum`, then `luna://com.webos.appInstallService/dev/install {'id':`com.ha.tvbridge`,'ipkUrl':`/tmp/com.ha.tvbridge.ipk`,'subscribe':true}` over either HB exec or `ares-shell`. Down-grade semantics on `5.4.1` require `force` flag inspection and FIFO wait; rollback is `com.webos.appInstallService/remove`.

Version pinning is HA-owned: `companion_present` coordinator flag (section 10) compares `installed.version` TXT against `manifest.json` `version` and surfaces `repair-issues` 'Companion update available' rather than auto-forcing, with `diagnostics` redacting `host`, `client_key`, `ipkHash` via `async_redact_data`. OTA fragility is explicit: as of `2025-08-24` faultmanager is patched for `5+` OTAIDs [[github-throwaway96faultmanager-autoroot]], so the roadmap must `Block System Updates` in HB Channel by default and re-probe `uid=0` on every boot — one accepted OTAID can permanently wipe `roles.d` reconstitution and the `init.d` native companion is gone until re-root.

## 4. Native App Architecture — Enact vs Vanilla JS Service, Lifecycle, and Persistence

Neither slogan holds alone — depth synthesis is a **three-layer hybrid** that matches webOS's actual kill semantics.

**Layer 1 — Suspended Enact WebView (the mind-blowing surface).** `App Lifecycle` shows `Not Launched → Launched (Foreground) → Suspended (background)` via `webOSLaunch`/`visibilityChange`/`webOSRelaunch`; `handlesRelaunch:true` lets the app handle `webOSRelaunch` in the background before `PalmSystem.activate()` [[app-lifecycle-management-webos-tv-developer]]. `App Resources` `requiredMemory 120` holds the Lovelace dashboard warm without full reload. This layer is mandatory for Lovelace/Electron rendering, Magic Remote sensor pairing [[magic-remote-webos-tv-developer]], and `cec` `query/operation` UI flows — vanilla headless cannot render store cards or keep `cec` focus without a WebView.

**Layer 2 — JS Service anchored by ActivityManager (the Platinum heartbeat).** `JS Service FAQ` names the 5-second death: 'No active activities' [[javascript-service-faq-webos-tv-developer]]. `ActivityManager` defines `create/start/adopt/complete` with `foreground|background`, `persist` (DB8 across reboot), `explicit` (only `complete/stop/cancel` kills), `continuous`/`power` [[activity-manager-api-reference-guide-webos-tv-developer]]. `JS Service Usage` mandates the service name is `appId + `.service`` — e.g. `com.ha.tvbridge.service` — and that `webos-service` `Service(`com.ha.tvbridge.service`)` registers it [[js-service-usage-webos-tv-developer]]. The companion JS therefore creates a `foreground+explicit+persist` Activity on boot, adopts it in the JS service, and backs it with the `FakeActivityManager` 30 s TTL stub that patches Node's `run-js-service` persistence-DB bug still present on 5.4.1 Node 12/14. This holder outranks `memoryd`'s low-priority kills and keeps one `wss://:9923` companion WS plus `ping_interval=1` alive through `visibilityChange:hidden` without a second broker.

**Layer 3 — Conditional native `init.d` daemon (the rooted tier).** Homebrew's `startup.sh` copied to `/var/lib/webosbrew/startup.sh` exposes `init.d` that `sam` does not manage [[github-webosbrewwebos-homebrew-channel-unofficial-webos-tv-homebrew-store-and-ro]]. `hyperion-webos` plus `piccap` already ship an elevated native `hyperion-webos` `libvtcapture+libhalgal` daemon via that path [[github-webosbrewhyperion-webos-hyperionng-video-grabber-for-webos-github]]; the companion re-uses the same slot for the `unicapture` flatbuffer `1` native service that JS alone cannot host (JS has no `libvt` handle and cannot `mmap` the scaler). On stock TVs this layer is absent and the matrix rows in §2 marked `C` simply stay unavailable — graceful fallback, not crash.

That hybrid is strictly more resilient than 'Enact only' (killed on `X` close or `ares-launch --close`) or 'vanilla JS only' (killed in 5 s without Activity) and strictly cheaper than 'native only' (no Lovelace). The Enact WebView is rendered `background` with no `keepAlive` of its own; the JS service's `foreground` Activity holder is what keeps the PID tree oom-score-adjusted.

## 5. Packaging, Permissions, and Distribution — IPK, appinfo.json, Homebrew vs Store

`ares-package` plus `appinfo.json` `requiredPermissions` is the permission surface that makes `luna-service-bus-webos-homebrew-project`'s `all` vs `public` distinction reproducible.

```json
{
  'id': `com.ha.tvbridge`,
  'version': `1.0.0`,
  'type': 'web',
  'main': `index.html`,
  'handlesRelaunch': true,
  'requiredMemory': 120,
  'requiredPermissions': [
    `audio.operation`, `audio.query`,
    `application.operation`, `application.launcher`,
    `tv.operation`, `tv.query`,
    `config.query`, `com.webos.service.cec.query`, `com.webos.service.cec.operation`,
    `activity.operation`, `activity.query`,
    `database.operation`, `settings.query`,
    `com.webos.notification`, `palm.notification`
  ]
}
```

```json
// services/com.ha.tvbridge.service/services.json
{ 'id':`com.ha.tvbridge.service`, 'services':[{'name':`com.ha.tvbridge.service`}] }
```

`ares-generate -t js_service -s com.ha.tvbridge.service` + `ares-package com.ha.tvbridge com.ha.tvbridge.service` [[cli-developer-guide-webos-tv-developer]] produces `com.ha.tvbridge_1.0.0_all.ipk`. On rooted TVs the installer injects the extra `all` acls via `elevate-service.ts` patching `allowedNames:['*']` and `client-permissions:['all']` then `ls-control scan-services` — exactly the `private` fix that piccap's `elevate-service` performs [[github-tbsnillerpiccap-piccap-hyperion-sender-app-ambilight-for-lg-webos-tvs-git]].

Homebrew Channel distributable is the only viable channel for that permission set — LG Content Store would strip `all`/`tv.services` and reject the `systemsettings.query` adjacent rights, while devmode sideload expires after 50 h [[rooting-webos-homebrew]]. `repo.webosbrew.org/apps/org.webosbrew.piccap` is the template: install via Homebrew Channel today, fallback `scp`+`luna dev/install` where HB absent [[apps-repository-webos-homebrew-project]]. `dev-manager-desktop` documents the ares prisoner `9922` vs root `22` port split for non-root fallback [[github-webosbrewdev-manager-desktop-devicedevmode-manager-for-webos-tv-github]]. The Platinum `docs-supported-functions` and `docs-known-limitations` must therefore explain 'Homebrew install requires consented root probe, stock fallback keeps Gold entities' — identical to `piccap`'s own `Root access to your TV webOS 3.4 or above Latest Homebrew Channel installed` gate [[github-tbsnillerpiccap-piccap-hyperion-sender-app-ambilight-for-lg-webos-tvs-git]].

Signing is LG-store irrelevant for Homebrew: the IPK is unsigned, served from HA's `api` URL for HB's HTTP-only `ipkUrl`, and verified by `ipkHash` SHA256 as GitHub release `com.ha.tvbridge_..._all.ipk` does. `OTA survival` is the distribution risk: delta OTA reconstitutes `/var/lib/luna-service2/manifests` and may wipe `roles.d` — `webosbrew_failsafe` telnet emergency shell exists precisely for that brick-avoidance path, and the roadmap must treat an accepted OTA as 'root lost, re-root required'.

## 6. Communication and Discovery — mDNS/SSDP/WebSocket/MQTT and Capability Negotiation

Platinum `local_push` and `inject-websession` dictate the answer before protocol taste does.

**Mandatory path — single re-used `wss://TV:3001` plus `mDNS TXT` — is Platinum-native.** `bscpylgtv` `WebOsClient` is already `asyncio`+`websockets` but not `aiohttp`-session-injected [[bscpylgtvbscpylgtvwebos_clientpy-at-master-chros73bscpylgtv-github]]; `aiowebostv` wraps `ClientSession` with `heartbeat` and `ssl=False` for TV self-signed [[github-home-assistant-libsaiowebostv-python-library-to-control-lg-webos-based-tv]]. HA core `webostv` coordinator is `local_push` with heartbeat and `async_handle_update` [[corehomeassistantcomponentswebostv__init__py-at-dev-home-assistantcore-github]]. The companion therefore hosts its own `JS ws` server on `wss://TV:9923` (or re-uses `3001` via `hbchannel.service/exec` reverse tunnel) that the sister coordinator connects to with the already-paired `StorageSqliteDict` `client_key` derivation `HMAC(client_key,`ha-companion/1`)` — no second credential store, single `AsyncEntryNotSetupRetry` path, and no split-brain `last-will`.

Discovery stitches SSDP + mDNS. SSDP `ST: urn:lge-com:service:webos-second-screen:1` remains the stock entry for `webostv` [[simple-service-discovery-protocol-ssdp-home-assistant]]; the companion adds `_lg-ha-companion._tcp` mDNS with `TXT v=1 cap=cec,capture,voice,lovelace model=OLED48CXPTA sv=04.40.16 ota=patched2025-08 hash=...` so the coordinator can skip the `401 vs 200` dance when `cap` excludes `capture` on a non-CX panel. Capability negotiation is a 2 s `luna://com.ha.tvbridge.service/getCapabilities` over the re-used `client_key` WS — if probe times out, `companion_present` stays `false` and the coordinator's existing 10 s liveness watchdog remains the only polling surface.

**MQTT is opt-in secondary.** `MQTT - Home Assistant` documents discovery, birth/will, `retain`, and auto-entity creation that WS lacks [[mqtt-home-assistant]], and `zeroconf` would auto-find the broker [[zero-configuration-networking-zeroconf-home-assistant]]. The cost is a second `mqtt` credential store plus broker `availability_topic` vs companion WS `Active Standby` state — depth correctly keeps MQTT for high-rate `ambient_lux` `10–30 Hz` hashes or `Wyoming` `PCM` when a broker is already zeroconf-discovered, not as mandatory transport. WS `ping_interval=1` survives `Active Standby` where MQTT `LWT` would flap in TV `powerDebounce`.

Least-privilege surface is the permission needle the section ties back to: `audio.operation` for mute, `application.operation` for app launch, `tv.operation` for `oledepl` toggle, `cec.query/operation` for hub, `activity.operation` for keep-alive — each `provides` narrowed in `api-permissions.d`, never `all` except for the elevated native `capture` tier, with redaction in `diagnostics` mirroring `ha-lg-webos-tv`'s `async_redact_data` for `host/client_key/ipkHash`.

## 7. Security and Pairing — client-key Re-use, Token Rotation, and Least Privilege

Pairing re-uses the `bscpylgtv` sqlite that the live TV already issued — `StorageSqliteDict` at `.aiopylgtv.sqlite` keyed by `host` and the `3c0c13...` `client-key` we paired without PIN [[bscpylgtvbscpylgtvwebos_clientpy-at-master-chros73bscpylgtv-github]]. On WS `hello` the TV echoes `hello {protocolVersion,deviceUUID}` then `register_0` returns `client-key`; the companion's WS does not re-register, it authenticates with `Authorization: Bearer HMAC(client_key,`ha-companion/1`)` where `HMAC` is `sha256` rotation on each re-pair event (`reauth` flow triggers `InputPin` → new `client_key` → new HMAC). Self-signed `wss://:3001` is `CERT_NONE` as both `bscpylgtv` and `aiowebostv` document (`check_hostname False, verify NONE`) — LAN-only, never exposed via `remote-ui`; HA `inject-websession` wrappers can still pin the TV's `device_id 58:fd:b1:f5:a8:66` via `ssdp` location header.

ACL least privilege is enforced by never requesting `all` in stock `requiredPermissions`; the `all` rewrite lives only in the elevated native tier's `elevate-service.ts` patch for `capture/eim/pqcontroller` and is `ls-control` scanned once at install, not on every boot. The sibling `com.webos.service.secondscreen.gateway` `createAlert` chaining trick that `The Recurity Lablog` used to bypass `Notification Manager` ACLs via `onclick` nesting is explicitly out-of-scope — the companion does not exploit alert nesting, it uses the `hbchannel.service/exec` shell proxy where `ssdp` is the designated system `APPID` for toasts and alerts [[notifications-webos-tv-developer]] [[comwebosnotification-webos-open-source-edition]].

Diagnostics mirrors `ha-lg-webos-tv`: `async_get_config_entry_diagnostics` redacts `host`, `client-key`, `ipkUrl`, `ipkHash`, `deviceUUID`, and raw `flatbuffer` hashes; `entity` `unique_id` is `deviceUUID + '_' + 'ambient_lux'` not IP.

## 8. The Ultimate Application — TV as a Full Home Assistant Edge Node

The roadmap is a staged edge-node ladder where each rung is gated by the ACL tier and SoC budget already proven, not declared.

**Phase 0 today (no IPK, 62 notes already substantiate):** `OLED48CXPTA` as `media_player` + `remote` + `notify` + `button turnScreenOff/On` + `number backlight…` + `select picture_mode/soundOutput/channel` — the `ha-lg-webos-tv` Gold frontier [[github-belikhha-lg-webos-tv-vibe-coded-untested-until-later-tonight-github]].

**Phase 1 rooted headless (JS+ActivityManager, no Enact):** TV becomes **HDMI-CEC hub** — `com.webos.service.cec` `operation` for `arc` switch, `cecCommand` `0x82 activeSource`/`0x36 standby` injected from HA `remote.send_command` and answering HA `hdmi_cec` `cec_client` triggers [[hdmi-cec-home-assistant]]; plus **push sensors** remapping the `401` tier: `power_state` `Active` via `tvpower`, `current_app` via `applicationManager/getForegroundAppInfo` as `all`, and `volume` `38` warm. This is the stock-feasible plus permission-unlocked bundle that survives `memoryd` at `low 250MB` because it needs no native daemon.

**Phase 2 rooted ambient flagship (native `unicapture`):** **Ambient light and capture camera** — `hyperion-webos` `unicapture` daemon sampled at `256x144@30` (CX budget; `piccap` warns `AI Picture Pro/Brightness/Genre` must be `off` or `200–500 ms` dropout) producing `flatbuffer` `127.0.0.1:19400` that the companion hashes to `32x32` `ambient_lux` `sensor` and `camera piccap_stream` [[github-tbsnillerpiccap-piccap-hyperion-sender-app-ambilight-for-lg-webos-tvs-git]] [[github-webosbrewhyperion-webos-hyperionng-video-grabber-for-webos-github]]. On the `48CX` `OOM` thresholds scaled from OSE `low.enter 250 / critical 100` (audited absence — not yet instrumented on `3GB` CX under `hyperion` load), this is the memory-ceiling feature: `hyperion-ng` `loader` plus `libvtcapture` `+ libhalgal` `+ NV12` `QUIRK_VTCAPTURE_FORCE_CAPTURE 0x100` is re-entrant and competes with the suspended Enact WebView's `120 MB` `requiredMemory` — hence the `UI halgal disabled` reduced mode for concurrent ` Lovelace` is the credible default.

**Phase 3 voice and presence (USB-conditional):** **Voice satellite** via `Wyoming` `16 kHz PCM` streaming from `com.webos.service.audio` `UMI` `listSupportedDevices` `usb_mic0` — wired USB mic array only; the CX has no far-field `array-mic` so wake-word is push-to-talk Magic Remote `voice` button unless USB `usb_mic0` is present [[comwebosserviceaudio-webos-open-source-edition]] [[magic-remote-webos-tv-developer]]. `com.webos.service.ai.voice` is OSE-only; TV firmware exposes only `ai.management` gate, not continuous STT. Presence via `cec/getDeviceList` `device_tracker` is the cheaper `voice-adjacent` win.

**Phase 4 Enact dashboard (suspended Lovelace):** **Lovelace renderer** — Enact `WebView` at `handlesRelaunch:true` warm with `PalmSystem.activate()` on `webOSRelaunch`, presenting `ha_dashboard` `panel` that is the TV's own `webosLaunch` target and receiving HA `lovelace` push via the companion WS `subscribe` `ha_state_changed`. This plus **automation triggers** `webostv.turn_on` (`HDMI-CEC` or `Wake-on-LAN` `wake_on_lan` [[wake-on-lan-home-assistant]]) and **TTS** via `createToast` without `PROMPT` (system `APPID` path) completes the mind-blowing loop: 'Hey TV, dim ambient to 20, switch HDMI 2 to PS5 via CEC, and show camera porch' executes entirely on-LAN with `local_push` latency.

That ladder is the anti-wishlist guarantee: each rung names its ACL tier, its `ActivityType`, and its `PSS` cost; anything not yet instrumented on `10.1.1.209` is flagged as audited absence rather than promised.

## 9. Platinum Quality Plan — Mapping Every HA Quality Scale Rule

Platinum is `Gold 21 + 3` strict lifts — `async-dependency`, `inject-websession`, `strict-typing` plus the `54-rule` `quality_scale.yaml` vault [[integration-quality-scale-home-assistant-developer-docs]] [[integration-quality-scale-rules-home-assistant-developer-docs]] [[corescripthassfestquality_scalepy-at-dev-home-assistantcore-github]].

| Platinum rule | `bscpylgtv` sister delta (`04.40.16` CX) | Verify |
|---|---|---|
| `strict-typing` | Add `py.typed` + `.strict-typing` `disallow_untyped_defs true` `warn_unused_ignores true` via `BscPyLGTVConfigEntry = ConfigEntry[Coordinator]` typed `runtime_data`; `mypy` via `mypy --strict custom_components/bscpylgtv` | `mypy custom_components/bscpylgtv && cat .strict-typing` |
| `dependency-is-async` | `bscpylgtv 0.5.3` already `asyncio`+`websockets` but `StorageSqliteDict` is `sync` sqlite — wrap with `hass.async_add_executor_job` executor isolation as `ha-lg-webos-tv` already does for TV calls (`BscPyLGTVClientWrapper`) | `ruff` `ASYNC` + `mypy` `no untyped async` |
| `inject-websession` | `bscpylgtv` `WebOsClient` is `websockets`-only (`ssl CERT_NONE`) — no `aiohttp ClientSession` kwarg [[bscpylgtvbscpylgtvwebos_clientpy-at-master-chros73bscpylgtv-github]]; `aiowebostv` has it [[github-home-assistant-libsaiowebostv-python-library-to-control-lg-webos-based-tv]] — phase 1 wraps with `async_get_clientsession(hass)` passthrough for HA HTTP, phase 2 migrates to `aiowebostv` | `grep -R async_get_clientsession custom_components/bscpylgtv` |
| `has-entity-name` `entity-translations` `icon-translations` | `sensor current_app` etc. already, add `ambient_lux` `piccap_stream` `cec_client` via `sensor/camera/device_tracker` device class | `hassfest --action entity` |
| `config-flow` `test-before-configure` `unique-config-entry` `runtime-data` | `SSD P test_before_configure` `host==deviceUUID` unique_id migration IP→UUID already; companion adds `reconfigure` OTA version pinning | `pytest tests/test_config_flow.py -k discovery` |
| `re-authentication` `discovery-update-info` `discovery` `ssdp` `zeroconf` | `ssdp` `urn:lge-com:service:webos-second-screen:1` + `_lg-ha-companion._tcp` `TXT` `v/cap/hash` | `pytest -k reauth && ssdp probe` |
| `diagnostics` `entity-unavailable` `log-when-unavailable` `exception-translations` | `async_redact_data` for `host/client_key/ipkHash/deviceUUID` + `UpdateFailed(device_unavailable)` when offline | `pytest tests/test_diagnostics.py -k redact` |
| `parallel-updates` `appropriate-polling` `action-setup` | `local_push` with `10s` `liveness_watchdog` (not poll) replaced by companion `ping_interval=1` + `UpdateFailed` when offline + `available False` not remove | `ruff` `I` + `pytest -k parallel` |

Sister `quality_scale.yaml` frontier is reproduced verbatim in evidence: `strict_typing todo` → `done` via wrapper, `inject-websession` `exempt` today with comment `bscpylgtv owns its own websocket; no aiohttp session to inject` → `done` via `BscPyLGTVClientWrapper(client_session=async_get_clientsession(hass))`, `async-dependency` stays `done` as bscpylgtv is already `asyncio` native [[github-belikhha-lg-webos-tv-vibe-coded-untested-until-later-tonight-github]]. `py.typed` is shipped in the companion wrapper, not the upstream `bscpylgtv` PyPI, so core `hassfest` sees types.

## 10. Sister Integration Second Mode — GitHub Issue Blueprint for ha_chros73_bscpylgtv

**Title:** `feat: native-app-present second mode — companion WS + capability negotiation, ambient/CEC/voice entities, OTA-aware fallback`

```markdown
### Motivation
Today on 10.1.1.209 WS SSAP is three-tier — Tier C (capture/cec/tv.*) stays 401 without companion. With rooted `com.ha.tvbridge` hybrid, 7 new sensors + CEC hub + ambient flagship can be exposed without breaking Gold fallback.

### Detection (credential-less, consented)
- `ssdp urn:lge-com:service:webos-second-screen:1` → `WS hbchannel.service/exec id` (`uid=0`) → `mDNS _lg-ha-companion._tcp TXT v=1 cap=cec,capture,voice` → `luna://com.ha.tvbridge.service/getCapabilities` 2s over re-used `client_key` WS.
- Taxonomy: `companion_present: bool`, `companion_caps: set[str]`, probed in `async_step_user` after `test_before_configure` and on every `coordinator.async_config_entry_first_refresh` + boot `init.d` `ls-control` re-scan.
- No TCP 23/22 probe without UI Allow.

### Config / reauth
- `OptionsFlowWithReload` toggle `install_companion: bool|None` default None ('Ask'), `block_ota: bool` default true, `ambient_default: bool` default true with AI-off contract checkbox.
- `reauth` triggers `InputPin` → new `client_key` → `HMAC(.../ha-companion/1)` rotation; `reconfigure` maps `deviceUUID` not `host` for IP→UUID migration compatibility.

### Coordinator change
```python
class BscPyLGTVClientWrapper:
  def __init__(self, hass, host, client_key):
    self._session = async_get_clientsession(hass) # inject-websession
    self._raw = WebOsClient(host, client_key, states=[...]) # bscpylgtv
```

- `companion_present` added to `Coordinator.data`; `async_set_updated_data` pushes `hbchannel` capabilities; `ping_interval=1` heartbeat replaces 10s watchdog when present; `available=False` gates ambient/voice entities, not remove.

### New entities (under same TV `DeviceInfo` `via_device`)
- `sensor ambient_lux` (capture hash, `disabled_by_default False`, `available companion_present`)
- `camera piccap_stream` (flatbuffer, `available False` not removed when absent)
- `device_tracker cec_client` per `cec/getDeviceList`
- `sensor cpu/mem/thermal` via `memorymanager/nyx` `diagnostic`
- `sensor hdmi_hdr` via `avoutput`
- Existing `switch tpc/gsr`, `button reboot/screenshot` now `available companion_present` (TPC/GSR burn-in caution retained)

### Fallback
- When `companion_present False` or OTA wipes `/var/lib/luna-service2/roles.d`, all new entities become `available False` (not removed), matrix rows fall back to Gold subset; `repair-issues` 'Companion unreachable — OTA may have wiped roles, re-install?' with `async_redact_data`.

### Migration
- `async_migrate_entry` `v1→v2` adds `unique_id = deviceUUID` (already IP→UUID lazy); minor version bump adds `companion_caps` to `options`.

### Test plan (enumerated, maps to 325-test `conftest.py` `MockWebOsClient`/`TVSimulator` harness)
1. `test_config_flow_ssdp_discovery_hb_exec_root_true`
2. `test_config_flow_ssdp_hb_missing_fallback_no_tcp_without_consent`
3. `test_coordinator_companion_present_true_mdns_txt`
4. `test_coordinator_companion_2s_timeout_falls_back`
5. `test_entity_ambient_lux_available_false_when_absent_not_removed`
6. `test_entity_cec_client_tracker_cec_not_root_still_works_via_js`
7. `test_service_hb_install_sha256_progress_subscribe`
8. `test_service_dev_install_fallback_scp_tmp_sha256`
9. `test_diagnostics_redacts_host_client_key_ipkHash`
10. `test_reauth_rotates_hmac_companion_token`
11. `test_ota_wipe_repairs_issue`
12. `test_parallel_updates_companion_vs_stock_no_poll`
13. `test_local_push_no_polling_10s_watchdog_suppressed_when_companion`
14. `test_discovery_update_info_deviceUUID_not_host`
15. `test_ambient_ai_picture_off_contract_toast_created`

### ACs with verify
- `ruff check custom_components/bscpylgtv && mypy` `strict` → `hassfest` `quality_scale` `54/54` `done`
- `pytest -q` `325+15` `340` pass
- `wscat -c ws://10.1.1.209:3000` HB exec + `luna-send -n 1 luna://com.ha.tvbridge.service/getCapabilities '{}'` → `cap` set
- `avahi-browse -rt _lg-ha-companion._tcp` TXT present
```

Deliver to `../ha_chros73_bscpylgtv` as `.github/ISSUE_TEMPLATE/companion-second-mode.md` plus `quality_scale.yaml` `strict-typing todo→done` delta.

## 11. Phased Roadmap, Risks, and Verification

| Phase | What ships | Owner | Verifies (observed exit 0 only) | Risk it retires |
|---|---|---|---|---|
| **0 — Ground truth** | `research/notes/final_report_*.md` (this) + `loci.json` + provider `WebOsClient` ACL table from live `ls-monitor -i` | hyperresearch | `hpr run verify lgtv-webos-ha-root-1a89ff -j` headings/length/citations + `ruff/mypy/pytest -q` 325 | R-OTA-fragility, R-401-myth |
| **1 — Detection + consented install (HA only, no TV build)** | `ha_chros73_bscpylgtv` PR: `BscPyLGTVClientWrapper` with `async_get_clientsession`, `py.typed`+`.strict-typing`, `SSDP→WS HB exec→mDNS` probe inside `test_before_configure`, `hbchannel.service/install` / `dev/install` hybrid with SHA256+subscribe, `companion_present` flag, diagnostics redact | sister repo | `hassfest` `quality_scale 54/54` `done` + `pytest 340` + `luna-send-pub` vs `luna-send` matrix on 10.1.1.209 | R-HB-WS-auth, R-ws-hardened manifest |
| **2 — Minimal companion (JS+ActivityManager, headless)** | IPK `com.ha.tvbridge` `1.0.0` with `com.ha.tvbridge.service` JS `foreground+explicit+persist` `FakeActivityManager`, `WS wss:9923` `ws` server, `cec/query/operation` proxy, `power`/`volume`/`applicationManager` push | lgtv-webos-homeassistant | `ares-package com.ha.tvbridge com.ha.tvbridge.service` → `ares-install --device 10.1.1.209` → `luna://com.ha.tvbridge.service/getCapabilities` returns `cap` | R-5s-kill, R-WS-saturation |
| **3 — Ambient flagship (native daemon)** | `hyperion-webos` `unicapture` `libvtcapture`+`libhalgal` native `init.d` `all`-role daemon at `256x144@30` UMI flatbuffer + `elevate-service.ts` patch | companion native | `ares-install` → `tail /tmp/var/log/messages` `unicapture quirks 0x` + `hyperhdr` `8090` live preview + `mqtt` retained hash | R-AI-Picture dropout, R-SoC OOM |
| **4 — Dashboard + voice (Enact)** | Suspended Enact `handlesRelaunch:true` `requiredMemory 120` Lovelace `Wyak` `Wyoming` `16kHz` via `usb_mic0` if `listSupportedDevices` | companion Enact | `luna-send getMemoryStatus` scaled CX `available/total` → `avahi-browse _lg-ha-companion._tcp` → `assist_pipeline` `stt` | R-memoryd suspended kill |
| **5 — Platinum hardening + Homebrew publish** | `hacs.json` `homeassistant` `2026.8` strict, `haci` release to `repo.webosbrew.org` with `ipkHash` pinning, `Block System Updates` default + `re-probe` repair | both repos | `hass --script check_config` + `HACS validation` + `journalctl -u tv-ha-bridge --no-pager \| tail -n 100` + `ss -tulpn \| grep 9923` | R-OTA-wipe, R-store-strip |

Risks called out explicitly: `R-OTA-fragility` one-OTA permanent patch, `R-HB-WS-auth` unauthenticated WS `exec` maybe gated, `R-WS-hardened` `com.lge.test` spoof rejected on `04.40.16`, `R-SoC OOM` `low 250/critical 100` not measured on `3GB` CX, `R-AI-Picture` `200–500 ms` dropout contract, `R-store-strip` `all` `oem` rejection.

Per-cluster `self-verification` is mandatory before claiming done — `ruff check --fix`, `mypy --strict`, `ares-package --check`, `luna-send` on `10.1.1.209`, and the `340`-test gate are the Platinum `done` not `todo`.

## 12. Adversarial Limits and What Would Overturn This Direction

The companion is one OTA from death. `faultmanager-autoroot` as of `2025-08-24` is already patched for `5,6,7,9`; `04.40.16` CX is vintage 2020 vulnerable but `LG Product Security` via `openlgtv/epk2extract` `super.pak` `dpmeta.pak` carving against `33.31.68.01` `o22n3` shows the reconstitution path: delta OTA re-writes `/var/lib/luna-service2/manifests` and `/overlay/bsppart` `24.7M` 100% full (`df` on `10.1.1.209` shows `overlay 24.7M 24.7M 0 100%` for `/etc`) and `webosbrew_failsafe` telnet is the emergency recovery, not a guarantee of `init.d` resurrection. If tomorrow's `04.40.20` OTAID for `HE_DTV_W20O_AFABABAA` patches `faultmanager` and signs `roles.d` with `manifestHash`, the hybrid gracefully degrades to stock `local_push` and the roadmap downgrades ambient/voice to documented niche behind an `OTA-blocked` repair — the sister PR's `available False` not remove is precisely that downgrade contract.

The WS `401` myth cuts both ways: if `com.lge.test` `TEST_SECURE` spoof is already hardened on `04.40.16`, Tier A shrinks and many §2 rows labelled stock would need companion `requiredPermissions` sideload to even appear in fallback; the per-method `ls-monitor -i` sweep on `10.1.1.209` we flagged as the highest-leverage overturning source would harden that shrinkage from inference to instrumented table. The `HB exec` unauthenticated WS assumption is equally overturnable — if `hbchannel.service/exec` is gated behind `client_key` pairing or `requiredPermissions`, the credential-less cascade loses its one-WS proof and falls back to consented `Dropbear 22`/`prisoner 9922` `scp` path, costing the `no-port-scan` Platinum promise and collapsing the install ordering.

Finally, memory is the mind-blowing throttle. `JS Service Usage` warns 'Don't run for very long periods (minutes) because of memory cost' and `App Resources` `requiredMemory` is advisory, not reserved; the OSE reference `low 250 / critical 100` may not scale to CX `3GB`. If instrumented `getMemoryStatus` on `10.1.1.209` under broadcast `HDMI1` + Enact `120 MB` PSS + flatbuffer `1` shows `memorymanager` killing the `foreground` Activity holder before `background` flatbuffer, the concurrent ambient+dashboard+voice stack is infeasible and ambient must be scoped to `256x144@15` with `UI halgal` off by default and voice off entirely unless USB `usb_mic0` is proven via `listSupportedDevices`.

What would overturn the current direction is therefore a single firmware dump or a single live `luna-send-pub` vs `luna-send` matrix for `capture/eim/pqcontroller/tv.*` on `04.40.16` — either collapses or hardens the three-tier foundation the entire 30-row matrix, hybrid lifecycle, and 5-phase ladder rest on, and we have named it as the pre-draft gap rather than buried it post-draft.

## Sources

- `security-guide-webos-open-source-edition` [[security-guide-webos-open-source-edition]]
- `luna-service-bus-webos-homebrew-project` [[luna-service-bus-webos-homebrew-project]]
- `rooting-webos-homebrew` [[rooting-webos-homebrew]]
- `github-throwaway96faultmanager-autoroot` [[github-throwaway96faultmanager-autoroot]]
- `github-throwaway96dejavuln-autoroot` [[github-throwaway96dejavuln-autoroot-exploit-to-root-webos-tvs-using-dejavuln-and]]
- `github-tbsnillerpiccap-piccap-hyperion-sender-app-ambilight-for-lg-webos-tvs-git` [[github-tbsnillerpiccap-piccap-hyperion-sender-app-ambilight-for-lg-webos-tvs-git]]
- `github-webosbrewhyperion-webos-hyperionng-video-grabber-for-webos-github` [[github-webosbrewhyperion-webos-hyperionng-video-grabber-for-webos-github]]
- `javascript-service-faq-webos-tv-developer` [[javascript-service-faq-webos-tv-developer]]
- `activity-manager-api-reference-guide-webos-tv-developer` [[activity-manager-api-reference-guide-webos-tv-developer]]
- `js-service-usage-webos-tv-developer` [[js-service-usage-webos-tv-developer]]
- `cli-developer-guide-webos-tv-developer` [[cli-developer-guide-webos-tv-developer]]
- `github-webosbrewwebos-homebrew-channel-unofficial-webos-tv-homebrew-store-and-ro` [[github-webosbrewwebos-homebrew-channel-unofficial-webos-tv-homebrew-store-and-ro]]
- `bscpylgtvbscpylgtvwebos_clientpy-at-master-chros73bscpylgtv-github` [[bscpylgtvbscpylgtvwebos_clientpy-at-master-chros73bscpylgtv-github]]
- `mqtt-home-assistant` [[mqtt-home-assistant]]
- `integration-quality-scale-home-assistant-developer-docs` [[integration-quality-scale-home-assistant-developer-docs]]
- `lg-webos-tv-home-assistant` [[lg-webos-tv-home-assistant]]
- plus 46 additional webOS OSE, LG Developer, Homebrew, and HA core notes tagged `lgtv-webos-ha-root-1a89ff` (62 total vault notes)

