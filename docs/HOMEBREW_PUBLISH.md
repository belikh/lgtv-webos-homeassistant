# Homebrew Channel publish — `com.ha.tvbridge` `1.0.1`

> **Root companion for OLED48CXPTA 5.4.1 04.40.16 AU.** This document is the Phase 5 publish contract for Iteration `12e7167c` 2026-11-10×21 — it satisfies Issues #16 #17 and Draft ADR-004 (One-OTA fragile). It complements `docs/ROADMAP.md` §5 Packaging and §11 Phase 5, and `native/README.md` install contract.

## 1. Distribution channel — Homebrew Channel only

The companion requires Tier C `private`/`oem` Luna ACGs (`capture`, `eim`, `oledepl`, `pqcontroller`, `tv.*`, `config/setConfigs`, `cec operation`, `attachedstoragemanager`) that are `TrustLevel oem` with `provides: [private, tv.services]` (see `research/notes/final_report_lgtv-webos-ha-root-1a89ff.md` §1). LG Content Store strips any `all`/`oem` permission and would reject `systemsettings.query` adjacent rights; dev-mode sideload expires after 50 hours. The only viable channel for this permission set is **Homebrew Channel** (`org.webosbrew.hbchannel`) via `repo.webosbrew.org` — the same channel used by `org.webosbrew.piccap` and `hyperion-webos`.

Template: `https://repo.webosbrew.org/apps/org.webosbrew.piccap` — install via Homebrew Channel today, fallback `scp` + `luna://com.webos.appInstallService/dev/install` where Homebrew is absent (`github-webosbrewwebos-homebrew-channel-unofficial-webos-tv-homebrew-store-and-ro`, `github-tbsnillerpiccap-piccap-hyperion-sender-app-ambilight-for-lg-webos-tvs-git`).

## 2. Submitting to `repo.webosbrew.org`

Follow `webosbrew/apps` submission (see `apps-repository-webos-homebrew-project`):

1. Build the signed artefacts locally:

   ```sh
   npm ci && npm run typecheck && npm run build
   ares-package com.ha.tvbridge com.ha.tvbridge.service -o build
    # → build/com.ha.tvbridge_1.0.1_all.ipk  (≈49 KiB — bundles only ws@7.5.10; the TV runs Node 12, so ws@8 MUST NOT be included or service.js fails to parse)
   sha256sum build/com.ha.tvbridge_1.0.1_all.ipk > build/com.ha.tvbridge_1.0.1_all.ipk.sha256
   ```

2. Fork `webosbrew/apps` and add `com.ha.tvbridge` manifest under `apps/com.ha.tvbridge/` with `appinfo.json` `id`, `version`, `title`, `icon`, `category`, `tileIcon`, `screenshots`, and `ipkUrl` pointing at the GitHub Release asset (Homebrew Channel requires an HTTP `ipkUrl`; it is HTTP-only, not `https` via HB's `install` — HA serves it via its own `http` component if needed).
3. Run the Homebrew linter locally (`hbchannel` linter / `webosbrew` CI) — it validates `appinfo.json` and `services.json` via the same `ares-package --check` gate that `ci.yml` runs.
4. Open a PR against `webosbrew/apps`; the Channel team reviews `requiredPermissions` (14 entries in `com.ha.tvbridge/appinfo.json` — `audio.operation`, `audio.query`, `application.operation`, `application.launcher`, `tv.operation`, `tv.query`, `config.query`, `com.webos.service.cec.query`, `com.webos.service.cec.operation`, `activity.operation`, `activity.query`, `database.operation`, `settings.query`, `com.webos.notification`) — only `all` acls are injected at install-time via `elevate-service` (`allowedNames:['*']` + `client-permissions:['all']` + `ls-control scan-services`), never requested stock.
5. On merge, the app appears in Homebrew Channel on-device within one catalogue refresh; users on 04.40.16 install with one click.

Fallback when Homebrew Channel is not yet installed on the TV:

```sh
# via Dropbear 22 (root, Homebrew default) or ares prisoner 9922 (dev-mode)
scp build/com.ha.tvbridge_1.0.1_all.ipk root@10.1.1.209:/tmp/com.ha.tvbridge.ipk
ssh root@10.1.1.209 "sha256sum /tmp/com.ha.tvbridge.ipk"
luna-send -n 1 -f luna://com.webos.appInstallService/dev/install \
  '{"id":"com.ha.tvbridge","ipkUrl":"/tmp/com.ha.tvbridge.ipk","subscribe":true}'
# wait FIFO installed/failed with 15 s -w; rollback is luna://com.webos.appInstallService/remove
```

Device management reference: `dev-manager-desktop` documents the ares prisoner `9922` vs root `22` port split (`github-webosbrewdev-manager-desktop-devicedevmode-manager-for-webos-tv-github`).

## 3. `ipkHash` pinning — integrity and downgrade contract

Homebrew Channel's `hbchannel.service/install` supports an `ipkHash` field for SHA256 pinning; the companion **requires** it:

```js
// Preferred: via Homebrew Channel when HB proves root (uid=0 via luna://org.webosbrew.hbchannel.service/exec)
luna-send -n 1 luna://org.webosbrew.hbchannel.service/install \
  '{"ipkUrl":"http://<ha>:8123/api/hbchannel/com.ha.tvbridge.ipk","ipkHash":"sha256:<64-hex>","subscribe":true}'
```

`ipkHash` is the `sha256sum` of the `build/com.ha.tvbridge_1.0.1_all.ipk` asset attached to the GitHub Release (`softprops/action-gh-release` in `.github/workflows/release.yaml` analogue). The HA side (`ha_chros73_bscpylgtv`) stores the expected hash in `diagnostics` redaction and verifies it via `sha256sum -c` before `ls-control scan-services`. Downgrade semantics on 5.4.1 require `force` flag inspection and FIFO wait; rollback is `com.webos.appInstallService/remove`.

Version pinning is HA-owned: the `companion_present` coordinator flag (§10 of final report) compares `installed.version` TXT (`_lg-ha-companion._tcp` mDNS ` TXT v=1 sv=... hash=...`) against this repo's `com.ha.tvbridge/appinfo.json` `version` and surfaces a Repair issue *Companion update available* rather than auto-forcing, with `diagnostics` redacting `host`, `client_key`, `ipkHash`.

```sh
# verify pinning locally
sha256sum build/com.ha.tvbridge_1.0.1_all.ipk
# compare against GitHub Release SHA256 and docs/HOMEBREW_PUBLISH.md release notes
```

## 4. Block System Updates — default `true`

`04.40.16` on the CX is pre-patch but one accepted delta OTAID away from permanent patch — `faultmanager-autoroot` notes as of `2025-08-24` that latest firmware for all webOS 5,6,7,9 is patched, only `4.0` probably never (`github-throwaway96faultmanager-autoroot`, `rooting-webos-homebrew`). An accepted OTA reconstitutes `/var/lib/luna-service2/manifests` and the `overlay` `24.7M` 100% full `/etc`, and permanently wipes `roles.d` reconstitution and the `init.d` native companion is gone until re-root (`webosbrew_failsafe` telnet at `/var/luna/preferences/webosbrew_failsafe` is the emergency shell, not a guarantee).

Therefore:

- **Default `true`**: the sister HA integration's OptionsFlow `block_ota` (`CONF_BLOCK_OTA`) defaults to `true` (see `custom_components/bscpylgtv/config_flow.py` and `const.py`) and the Homebrew Channel's own *Block System Updates* toggle must remain enabled. `docs/ROADMAP.md` §3 and `README.md` one-OTA fragile banner document the same.
- The companion's `getCapabilities` advertises `ota: patched2025-08` so the coordinator can surface a Repair issue *OTA may have wiped roles — reinstall?* when `companion_present` flips `false`.
- Users who explicitly disable the block accept that ambient/voice/CEC Tier C rows will become `available: false` (not removed) until re-root.

## 5. OTA wipe re-probe drill — recovery after delta OTA

When `companion_present` becomes `false` after an OTA (or after manual `rm -rf /var/lib/luna-service2/roles.d` simulation), run the elevate-service re-probe drill documented in `native/elevate-service.md`:

```sh
# 1. Confirm root still present without touching 23/22 — single WS HB exec probe
# From HA or laptop with paired client-key:
wscat -c ws://10.1.1.209:3000 -x '{"type":"request","payload":{"uri":"luna://org.webosbrew.hbchannel.service/exec","payload":{"command":"id"}}}'
# → expect {"payload":{"returnValue":true,"stdout":"uid=0(root) ..."}}  otherwise root lost — re-root via faultmanager required

# 2. Reconstitute Luna roles if HB still has root — the actual OTA wipe drill
ssh root@10.1.1.209 "rm -rf /var/lib/luna-service2/roles.d && ls-control scan-services && echo scan-services ok && ls /var/lib/luna-service2/roles.d | head"

# If the previous line was a simulation (wipe without OTA), re-run elevate-service:
ssh root@10.1.1.209 "cat /var/lib/webosbrew/init.d/com.ha.tvbridge.ambient 2>/dev/null | head"
ssh root@10.1.1.209 "ls-control scan-services && luna-send -n 1 luna://com.ha.tvbridge.service/getCapabilities '{}'"

# 3. Reinstall the companion IPK (Homebrew path preferred)
luna-send -n 1 luna://org.webosbrew.hbchannel.service/install \
  '{"ipkUrl":"http://<ha>:8123/api/hbchannel/com.ha.tvbridge.ipk","ipkHash":"sha256:<from-release>","subscribe":true}'
# fallback direct:
# luna-send -n 1 -f luna://com.webos.appInstallService/dev/install '{"id":"com.ha.tvbridge","ipkUrl":"/tmp/com.ha.tvbridge.ipk","subscribe":true}'

# 4. Verify capabilities and mDNS advertisement
luna-send -n 1 luna://com.ha.tvbridge.service/getCapabilities '{}' | jq
# → {"returnValue":true,"caps":["cec","capture","voice","lovelace"],"v":1,"model":"OLED48CXPTA","sv":"04.40.16","wsPort":9923}
avahi-browse -rt _lg-ha-companion._tcp 2>&1 | grep -E "cap|model|sv|hash|v="

# 5. Verify HA coordinator re-discovers companion (credential-less cascade)
# In HA Developer Tools → Events, listen for companion_present; or check diagnostics:
# → diagnostics redacts host/client_key/ipkHash/deviceUUID, shows companion_present:true caps:[...]
```

`rm -rf /var/lib/luna-service2/roles.d && ls-control scan-services then reinstall` is the canonical OTA survival reconstitution — it mirrors `hyperion-webos`/`piccap` `elevate-service.ts` (`allowedNames:['*']`, `client-permissions:['all']`) and `webosbrew` `startup.sh` copying `/media/developer/apps/usr/palm/services/org.webosbrew.hbchannel.service` to `/var/lib/webosbrew/startup.sh` with `init.d` respawn (see `native/README.md` and `native/elevate-service.md`).

## 6. Quality scale verification — 54/54 Platinum readiness

The sister HA integration (`ha_chros73_bscpylgtv`) tracks Platinum via `custom_components/bscpylgtv/quality_scale.yaml` (54 rules: 20 Bronze + 10 Silver + 21 Gold + 3 Platinum). This companion repo declares `manifest.json` `quality_scale: platinum` and `hacs.json` `homeassistant: 2026.8.0` to align with `ci.yml`.

Verification (observe `exit 0` — do not claim from intention or stale output):

```sh
# Main repo — native companion
npm run typecheck
# → tsc --noEmit  exit 0  (tsconfig strict, allowJs+checkJs, includes com.ha.tvbridge.service/*.js)
ares-package --check
# → no problems detected  exit 0
ares-package com.ha.tvbridge com.ha.tvbridge.service -o build
    # → build/com.ha.tvbridge_1.0.1_all.ipk  ≈49 KiB  exit 0
node -e "JSON.parse(require('fs').readFileSync('hacs.json','utf8')); JSON.parse(require('fs').readFileSync('manifest.json','utf8')); console.log('hacs+manifest ok')"

# Sister repo — HA integration (if available)
ruff check custom_components/bscpylgtv
# → All checks passed!  exit 0
mypy custom_components/bscpylgtv
# → Success: no issues found  (pragmatic; mypy --strict has pre-existing HA stub noise — see quality_scale.yaml strict_typing comment for minimal fixes: explicit_package_bases + ignore_missing_imports + per-file ignores for bscpylgtv shadow)
pytest -q
# → 330 passed, 10 skipped  exit 0  (hassfest quality_scale 54/54 done when 3 Platinum rules are green)

# Docs intact
test -f docs/HOMEBREW_PUBLISH.md && grep -q "Block System Updates" docs/HOMEBREW_PUBLISH.md && echo "docs intact"
```

`hassfest --action quality_scale 54/54` is the Platinum gate — it reads `quality_scale.yaml` and `manifest.json`, not this repo's `hacs.json`. `Block System Updates true` + `ipkHash` pinning + `ls-control scan-services` together satisfy ADR-004's one-OTA fragile mitigation.

## 7. References

- `research/notes/final_report_lgtv-webos-ha-root-1a89ff.md` §1 three-tier ACL, §5 packaging, §11 Phase 5, §12 adversarial limits
- `native/README.md` webosbrew `startup.sh` / `init.d` contract, `native/elevate-service.md` `roles.d`/`ls-control scan-services`, `native/FLATBUFFER_PROTOCOL.md` CX budget
- `docs/ROADMAP.md` §5 `appinfo.json` `requiredPermissions`, `docs/PROJECT_BOARD.md` Phase 5 Iteration `12e7167c` Issues #16 #17
- `webosbrew/webos-homebrew-channel` `startup.sh` + `init.d` + `elevate-service.ts` (`github-webosbrewwebos-homebrew-channel-unofficial-webos-tv-homebrew-store-and-ro`)
- `TBSniller/piccap` `scp` + `luna://com.webos.appInstallService/dev/install` canonical pattern (`github-tbsnillerpiccap-piccap-hyperion-sender-app-ambilight-for-lg-webos-tvs-git`)
- `webosbrew/hyperion-webos` `unicapture` `libvtcapture`+`libhalgal` flatbuffer `127.0.0.1:19400` (`github-webosbrewhyperion-webos-hyperionng-video-grabber-for-webos-github`)
- `throwaway96/faultmanager-autoroot` patched `2025-08-24` (`github-throwaway96faultmanager-autoroot`)
- `integration-quality-scale-home-assistant-developer-docs` / `corescripthassfestquality_scalepy-at-dev-home-assistantcore-github`
