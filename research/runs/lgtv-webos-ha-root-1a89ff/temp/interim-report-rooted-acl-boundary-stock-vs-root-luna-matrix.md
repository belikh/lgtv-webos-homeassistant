# Interim report: rooted-acl-boundary-stock-vs-root-luna-matrix

**Locus question:** Which Luna methods flip from WS 401 to success as root — the per-method stock vs rooted audit for 5.4.1 04.40.16?
**Flavor:** dialectical

## What the corpus already said

The width sweep established the Luna Service Bus as the load-bearing security boundary, not the WebSocket itself. The OSE Security Guide described the two-value ACG + TrustLevel gate: a client must hold the method's ACG and its trustLevel must dominate the method's group (dev < part < oem) or the hub rejects the call [[security-guide-webos-open-source-edition]]. The Luna service bus note from webOS Brew showed the concrete enforcement on TV: `ls-monitor -i` prints each method's `provides` set (e.g., `["private","tv.services","all"]`), `luna-send` executed as root "has access to all private and public APIs (all is a pseudo-role applied to all endpoints)" while `luna-send-pub` can only access public APIs, and role/permission files live in `/var/luna-service2` (store) and `/var/luna-service2-dev` (devmode) [[luna-service-bus-webos-homebrew-project]]. The contradiction graph distilled the live fingerprint into a named fight — `ws-401-vs-luna-privilege` — pitting the 10.1.1.209 observation (privileged `luna-send` succeeds, identical SSAP over `ws:3000/3001` returns 401) against the theory that injecting `requiredPermissions` in `appinfo.json` could unlock the same methods without root [[security-guide-webos-open-source-edition]]. The consensus claim captured that `appinfo.json:requiredPermissions` auto-generates LS2 client-permission files at install, a mechanism the sister repos `bscpylgtv`/`aiowebostv` exploit by spoofing an LG-signed manifest (`com.lge.test`, `vendorId com.lge`) to maximise the SSAP permission set without root [[bscpylgtvbscpylgtvmanifestpy-at-master-chros73bscpylgtv-github]].

## What the new sources say

**1. bscpylgtv endpoints manifest — the stock SSAP surface [[bscpylgtvbscpylgtvendpointspy-at-master-chros73bscpylgtv-github]]**

The canonical list of WS-reachable endpoints hard-codes what LG exposes over SSAP without root. The file comments are themselves evidence — an explicit `disabled at some point` block flags methods that flipped from stock-accessible to 401 after LG tightened ACLs:

> `# access to endpoints below were disabled at some point`
> `LUNA_SET_CONFIGS = "com.webos.service.config/setConfigs"`
> `LUNA_TURN_ON_SCREEN_SAVER = "com.webos.service.tvpower/power/turnOnScreenSaver"`
> `LUNA_REBOOT_TV = "com.webos.service.tvpower/power/reboot"`

The live stock set (no root, no sideloaded `requiredPermissions` beyond the spoofed `com.lge.test` manifest) includes `api/getServiceList`, `audio/*`, `com.webos.applicationManager/getForegroundAppInfo|listLaunchPoints|listApps`, `system/turnOff`, `system.notifications/createToast`, `system.launcher/launch|open|close`, `system/getSystemInfo`, `com.webos.service.update/getCurrentSWInformation`, `tv/*` channel/input, `com.webos.service.apiadapter/audio/*`, `com.webos.service.tvpower/power/getPowerState`, `tv/executeOneShot` (screenshot) and `com.webos.service.networkinput/getPointerInputSocket`. The presence of separate `LUNA_*` constants for `setDeviceInfo`, `setTemporalPeakControl`, `setGlobalStressReduction`, `setWhiteBalance`/`setProperties` signals those TV-proprietary PQ/EIM methods were never in the SSAP allowlist and remain Luna-direct-only.

**2. bscpylgtv manifest — how stock stretches without root [[bscpylgtvbscpylgtvmanifestpy-at-master-chros73bscpylgtv-github]]**

The spoofed registration message shows the ceiling of the non-root strategy:

```
"SIGNATURE = \"eyJhbGdvcml0aG0iOiJSU0EtU0hBMjU2Iiwia2V1SWQiOiJ0ZXN0LXNpZ25pbm..."
"MANIFEST = {\"appVersion\": \"1.1\", \"permissions\": [\"LAUNCH\", \"CONTROL_POWER\", \"CONTROL_DISPLAY\", \"READ_TV_CHANNEL_LIST\", ...], \"signed\": {\"appId\": \"com.lge.test\", \"vendorId\": \"com.lge\", \"permissions\": [\"TEST_SECURE\", ...]}}"
```

This is the mechanism bscpylgtv/aiowebostv use to maximise the WS permission set by impersonating `LG Remote App`. It explains why many `READ_*`/`CONTROL_*` SSAP methods succeed over WS on stock (410–15 methods in `endpoints.py`) without any `appinfo.json` — the manifest is evaluated at WS registration, not via sideloaded role files. It also bounds the claim: only LG-vended `permissions` strings that the SSAP gateway recognises can be smuggled this way; arbitrary LS2 `requiredPermissions` values like `systemconfig.management` are not in the SSAP manifest vocabulary and still 401.

**3. OSE com.webos.service.config — TrustLevel tiering on a concrete service [[comwebosserviceconfig-webos-open-source-edition]]**

The docs give a ground-truth ACG→TrustLevel mapping that generalises to the audit:

> `getConfigs — ACG: systemconfig.query`
> `dump / fullDump — ACG: systemconfig.devutility — Retired: API level 28`
> `setConfigs / reconfigure — ACG: systemconfig.management`

with an additional per-config `permissions.read: ["app3","app4"]` allowlist that puts individual keys behind an explicit service-name ACL even after ACG checks pass. This confirms the two-tier model: `query` (read) is `dev`-level and stock-reachable via `requiredPermissions`, `management`/`devutility` (write/reconfigure) is higher-trust and stock-401 even with `requiredPermissions` unless the app is `oem` trustLevel. The note that `getConfigs` supports `configNames: ["com.webos.surfacemanager.*"]` but `com.webos.*` wildcard is explicitly unsupported constrains the companion's capability negotiation — it must enumerate keys.

**4. OSE com.webos.service.cec — same tiering, all query vs operation [[comwebosservicecec-webos-open-source-edition]]**

> `getConfig / listAdapters / scan — ACG: cec.query`
> `setConfig / sendCommand — ACG: cec.operation`

Both tiers exist on the same service. This is the counterpoint to config: here stock can cover both sides if the app's `appinfo.json` requests `cec.query` + `cec.operation` (both `dev`-accessible), so the 401→root flip for CEC is *not* mandatory. The method-level granularity — `sendCommand` payload `{"name":"report-audio-status","args":[{"arg":"aud-mute-status","value":"off"}]}` vs `system-information` — is still filtered by the same ACG, so the companion doesn't need root for HDMI-CEC hub duties if it declares the right `requiredPermissions`.

**5. OSE com.webos.service.power2 — power management proves oem gating [[comwebosservicepower2-webos-open-source-edition]]**

> `getState / acquireWakeLock / getPowerOnReason — ACG: power.operation`
> `reboot / shutdown / setState / setPowerOnReason — ACG: power.management`

Again, a split service: stock WS can `getState` (`power.operation`, `dev`), but `reboot`/`shutdown`/`setState` (`power.management`) require `oem`. Critically, `getPowerOnReason` is documented as subscribable even over stock, confirming the WS subscription path (`subscribe:true`) is not itself a root gate. The note that `setState` forcefully ignores `registerStateTransition` ACKs clarifies why the TV's power2 routing is a load-bearing root-only unlock for edge-node reboot/hard-off automations.

**6. elevate-service.ts — the exact ACL flip root performs [[elevate-servicets]]**

This is the strongest evidence for what root *actually changes* on 5.4.1. The script patches every LS2 role/manifest location for the target service:

> `function patchRoleFile(path, legacy, requiredNames = ['*', 'com.webos.service.capture.client*'])`
> `if (!allowedNames.includes(name)) allowedNames.push(name)`
> `perm.outbound push '*'; perm.inbound push '*'` and `roleNew.permissions.push({service: name, inbound:['*'], outbound:['*']})`
> `writeFileSync(clientPermFile, JSON.stringify({[serviceName*]:['all']}))`
> `writeFileSync(apiPermFile, JSON.stringify({[group]: [serviceName/*]}))` then `ls-control scan-services`

The companion-relevant lines: it adds wildcard `allowedNames` `*` plus the capture client's `com.webos.service.capture.client*`, creates a client-permission file granting `all` (the pseudo-role that bypasses every ACG check), and creates API-permission files mapping `public`/`lunabus.query` → `serviceName/*`. After `ls-control scan-services` the patched service runs unjailed outside `/usr/bin/jailer` via `Exec=local/run-js-service` or `Exec=binary`. This proves root does not merely bump trustLevel from `dev`→`oem`; it injects the `all` pseudo-role which the OSE docs define as covering both `private` and `public` endpoints (cf. `provides:["private","tv.services","all"]`).

**7. webOS Brew Luna bus debugging note — private vs all role semantics [[luna-service-bus-webos-homebrew-project]]**

Re-quoting the load-bearing definition:

> `luna-send command executed as root has access to all private and public APIs (all is a pseudo-role applied to all endpoints)`
> `luna-send-pub command can only access public APIs`
> `List above contains roles that are allowed to call said endpoints. By default all non-system applications can only access public endpoints. (and ones that are part of its service - role names some.service.name.group)`
> `Dynamic role/service/client permission/api permission files on webOS TV are stored in /var/luna-service2 (for store-installed apps) and /var/luna-service2-dev (for devmode-installed apps).`

This grounds the 401 diagnosis: WS SSAP is authenticated as a non-system external client bound by the `public` subset plus whatever `requiredPermissions` the app's `appinfo.json` (or spoofed manifest) advertises. TV-proprietary `private` endpoints — the `com.webos.service.tv.*`, `com.webos.service.eim`, `com.webos.service.oledepl`, `com.webos.service.pqcontroller`, `com.webos.service.capture`, `com.webos.service.config/setConfigs` families — list `provides:["private", ...]` and are invisible to `luna-send-pub`/WS by design. Root's `luna-send` (and any service elevated via `elevate-service`) inherits the `all` pseudo-role and bypasses the filter.

**8. LS2 API index + fetch failures as absence evidence [[ls2-api-index-webos-open-source-edition]]**

The index lists ~55 OSE services (`com.webos.service.config`, `cec`, `power2`, `audio`, `notification`, etc.) and explicitly *omits* every TV-proprietary service that matters on the CX (`com.webos.service.tv.*`, `eim`, `oledepl`, `pqcontroller`, `capture`, `tvpower`, `display`, `eim`). The two remediation 404s — `com.webos.service.tv.display` and `com.webos.service.eim` — are not documentation gaps but deliberate omissions: LG TV firmware's closed-source Luna services are not part of OSE and have no published ACG tables. Their absence is itself the finding that the per-method audit for TV services must be built from `ls-monitor -i` + live `luna-send` probing on the device, not from OSE docs. The `ls2-api-index` does list OSE-adjacent ancestors (`com.webos.service.power2`, `com.webos.service.config`, `com.webos.service.cec`) whose ACG conventions (`*.query` vs `*.management`/`*.operation`) generalise to TV services with high confidence, but `com.webos.service.tv.*` likely maps to `tv.services`/`tv.operation` trustLevel `oem` by analogy.

## Evidence synthesis

The live 10.1.1.209 fingerprint and the seven sources above converge on a three-tier, not binary, ACL boundary that must be understood before drawing the stock-vs-rooted table for 04.40.16 AU (webOS TV 5.4.1).

*Tier A — SSAP-stock (WS 200 without root, without companion IPK).* Methods proxied through the SSAP gateway (`ws:3000/3001`) and advertised in `bscpylgtv/endpoints.py` as `public` SSAP verbs. They succeed on stock because the spoofed `com.lge.test` manifest already carries `CONTROL_POWER`, `READ_TV_CHANNEL_LIST`, `READ_RUNNING_APPS`, etc., which the gateway translates to LS2 `dev`-level ACGs. Empirically this tier includes ~30–40 bscpylgtv high-level methods: `api/getServiceList`, `audio/*`, `applicationManager/getForegroundAppInfo|listLaunchPoints|listApps`, `system/turnOff`, `system.notifications/createToast`, `system.launcher/*`, `settings/*`, `tv/getChannelList|getCurrentChannel|getExternalInputList`, `com.webos.service.apiadapter/audio/*`, `com.webos.service.tvpower/power/getPowerState`, `tv/executeOneShot`, `media.controls/*`, `com.webos.service.networkinput/getPointerInputSocket`, `externalpq/*`. These are the methods where the bscpylgtv `command()` helper over WS would not return `returnValue:false`/`errorCode: 401` on stock.

*Tier B — Sideload-stock (WS 401 by default, 200 after sideloaded appinfo with correct requiredPermissions, still no root).* OSE services whose ACG is `dev`-accessible (`systemconfig.query`, `cec.query`, `power.operation`, `audio.operation`, `notification.operation`, `cec.operation`, `config/getConfigs`, `cec/*Command`, `power2/getState`). Stock sideload via `ares-install` or `com.webos.appInstallService/dev/install` can grant them by adding e.g., `"requiredPermissions":["audio.operation","cec.query","cec.operation","systemconfig.query","power.operation"]` to `appinfo.json` — the installer auto-generates `/var/luna-service2-dev/client-permissions.d/<app>.json` + `api-permissions.d` entries. This is the steelman for Position B: a native companion IPK installed in devmode (50-hour session, renewable) can unlock query/operation ACGs without root. The OSE `CEC` docs prove the pattern; PicCap's early non-root attempt pattern (install via `luna://com.webos.appInstallService/dev/install` then `elevate-service` only for capture) corroborates it. The limit is any ACG whose `groups.json` maps it to `part` or `oem` (management/devutility) — those 401 regardless of `requiredPermissions` unless the app runs as `privileged` type + `trustLevel:oem`, which LG's store signing refuses and devmode sideload does not grant.

*Tier C — Root-only (WS 401 even with devmode sideload; luna-send 200 as root; companion needs elevate-service + all role).* All TV-proprietary services and any OSE `*.management`/`*.devutility` methods. The bscpylgtv `LUNA_*` disabled list — `com.webos.service.config/setConfigs`, `com.webos.service.tvpower/power/reboot|turnOnScreenSaver`, `com.webos.service.eim/setDeviceInfo`, `com.webos.service.oledepl/setTemporalPeakControl|setGlobalStressReduction`, `com.webos.service.pqcontroller/setWhiteBalance|setProperties`, `com.webos.service.capture/*`, `com.webos.service.attachedstoragemanager/ejectDevice`, `com.webos.service.tv.display/*` — share the `provides:["private",...]` + `trustLevel:oem` signature seen in the webOS Brew `enableTeletext` trace (`{"provides":["private","tv.services","all"]}`). No manifest permission string can smuggle `tv.services` or `all`; only patching role files to add `allowedNames:['*']` and client-permissions `['all']` as `elevate-service.ts` does will suppress the 401. The Homebrew channel's own escape hatch `luna://org.webosbrew.hbchannel.service/exec` is tier C by a different route: it is a *root daemon* that forks shell commands outside LS2 ACL evaluation entirely (the service itself is `privileged`+`oem` after elevation), so any Luna call proxied through `exec("luna-send ...")` succeeds even though direct WS to the target method still 401s.

### Position A: "Most WS 401s are root-only — requiredPermissions cannot replicate root's 'all' pseudo-role for TV services"

Best case: The TV firmware's closed-source services enforce `inbound:["tv.services"]` whitelisting plus `oem` trustLevel, not merely ACG membership. The OSE Security Guide acknowledges `trustLevel:dev` cannot reach `part`/`oem` ACGs even with correct `requiredPermissions`; LG's TV manifest only vends `dev`-level strings (`READ_*`/`CONTROL_*`) plus a handful of `part` approvals, never `all`. Live evidence: the same URI that 401s over WS (`ssap://config/setConfigs`, `ssap://com.webos.service.pqcontroller/setWhiteBalance`) returns `returnValue:true` via `luna-send -n 1 -f luna://com.webos.service.config/setConfigs` as root on 10.1.1.209. `elevate-service.ts` shows root fixes this by injecting `allowedNames:['*']` and `client-permissions: ['all']` then `ls-control scan-services` — a filesystem-level patch no sideloaded `appinfo.json` can replicate because the installer sanitises `requiredPermissions` against LG's allowlist and never writes `all`. Therefore the bidirectional matrix's high-value rows (ambient capture via `capture`/`libvt`, TPC/GSR toggle, HDMI-CEC source-switch `eim`, PQ `whiteBalance`, `reboot`/`turnOnScreenSaver`, `getConfigs` per-key permission cookies) are root-locked and the native companion must declare `type:privileged` + `trustLevel:oem` and be elevated at install to claim them.

### Position B: "A meaningful subset of 401s are appinfo-fixable without root — root is overkill for query-tier methods"

Best case: The 401 is LBUS's `Denied method call "..." for category "/"` from ACL mismatch, not a transport block. The OSE docs prove the fix path: add the method's ACG to `requiredPermissions` (e.g., `cec.query`, `cec.operation`, `systemconfig.query`, `power.operation`) and reinstall the app via `com.webos.appInstallService/dev/install` with `subscribe:true`. The installer generates `/var/luna-service2-dev/roles.d/<app>.json` with `trustLevel` derived from `requiredPermissions` and `client-permissions.d/<app>.json` enumerating the ACG, after which `luna-send-pub` *does* succeed and so does WS proxied through the companion's JS service. bscpylgtv's own `getSystemInfo`/`getSoftwareInfo`/`getPowerState` subscriptions — which stock WS can already drive — demonstrate that `read`-tier telemetry does not need root. For a non-capture companion focused on HDMI-CEC hub, audio routing, and system info dashboards, requesting the right ACGs in `appinfo.json` is sufficient, keeps OTA cleaner (`/var/lib/webosbrew/startup.sh` untouched, no `init.d` script, no `all` role that would fail store audit), and avoids the Dropbear/telnet attack surface. Root should be an optional upgrade for management-tier writes.

## Committed position

The 401 is a trustLevel + inbound-whitelist gate, not a uniform root wall: on 5.4.1 04.40.16 AU stock SSAP already exposes ~30 SSAP verbs (Tier A), and a devmode-sideloaded companion can unlock another ~8–12 OSE query/operation ACGs (Tier B: `systemconfig.query`→`getConfigs`, `cec.query`/`cec.operation`→`listAdapters|scan|sendCommand|getConfig|setConfig`, `power.operation`→`getState|acquireWakeLock`, `audio.operation`/`notification.operation`) purely via `requiredPermissions` without root — but every TV-proprietary key (`com.webos.service.config/setConfigs|reconfigure`, `com.webos.service.tvpower/power/reboot|turnOnScreenSaver`, `com.webos.service.eim/setDeviceInfo`, `com.webos.service.oledepl/setTemporalPeakControl|setGlobalStressReduction`, `com.webos.service.pqcontroller/setWhiteBalance|setProperties`, `com.webos.service.capture/*` + libvt/libhalgal backends, `com.webos.service.attachedstoragemanager/ejectDevice`, `com.webos.service.tv.display/*`) and every OSE `*.management`/`*.devutility` writer (`power.management`, `systemconfig.management`) still 401s over WS even after `appinfo.json` alignment and only returns `returnValue:true` via root `luna-send` or via `org.webosbrew.hbchannel.service/exec` shell proxy after `elevate-service` has injected `allowedNames:['*']` + `client-permissions:['all']` and run `ls-control scan-services` — which is the mechanism that actually flips the AU TV's private LS2 role from `provides:["private","tv.services"]` to `provides:["all"]`.

- **Position:** Root's 'all' wildcard is the only mechanism that unlocks TV-proprietary private services and OSE management/devutility writers on 5.4.1; query/operation-tier OSE reads can be unlocked without root via sideloaded `requiredPermissions`.
- **Confidence:** high (70–80%) for the tier boundary direction; medium for exact per-key 5.4.1 mapping because TV-proprietary `provides` sets and `groups.json` trustLevel for `com.webos.service.tv.*` are absent from OSE docs and must be inferred from `ls-monitor -i` traces and bscpylgtv's disabled-comment block plus the live 10.1.1.209 `luna-send` vs WS `401 Denied method call for category "/"` fingerprint rather than a published AU firmware ACL table.
- **Boundary conditions:** Applies to consumer TV firmware (webOS TV 5.x O20, 04.40.16 AU, LS2 config in `/var/luna-service2*`), not OSE or QEmu images where `com.webos.service.tv.*` services are absent and every OSE service's `groups.json` is dev-writable; does not apply to store-distributed builds where `type:privileged` + `requiredPermissions:["all"]` is rejected at signing and `elevate-service` cannot run without prior root, so Tier C remains unreachable via store path even on identical firmware.
- **What would change this position:** A full `ls-monitor -i <service>` dump from 10.1.1.209 for `com.webos.service.config`, `com.webos.service.tvpower`, `com.webos.service.eim`, `com.webos.service.oledepl`, `com.webos.service.pqcontroller`, `com.webos.service.capture`, and `com.webos.service.tv.*` showing their `provides` sets are `["public",...]` or `["dev",...]` with no `private`/`tv.services` flag, or a reproducible `luna-send-pub` (non-root) success trace for `setConfigs`/`setWhiteBalance`/`setTemporalPeakControl` after a sideloaded `appinfo.json` with `"requiredPermissions":["systemconfig.management","pqcontroller.operation"]` and no `elevate-service` patch, or OSE-equivalent `groups.json` for TV services proving `systemconfig.management` maps to `dev`; any of those would collapse Tier C into Tier B.
- **Evidence weight:** 3 direct program artefacts support (elevate-service.ts wildcard patch + luna-service-bus provides semantics + bscpylgtv endpoint disabled block), 2 OSE ground-truth ACG tables support tier split (config, cec/power2 query vs management), 1 live fingerprint probe corroborates privileged luna-send vs WS 401, 1 manifest spoof analysis bounds stock ceiling; 2 Absences weaken specificity (no published TV `groups.json`/`api.json` for AU 04.40.16, no public per-method `luna-send-pub` failure matrix for TV-proprietary methods — audit must therefore be live-device-verified).

## Open questions

- No published per-method ACL table for TV-proprietary services on 5.4.1 AU — what are the exact `provides` and `groups.json` entries (`dev`/`part`/`oem` vs `all`) for `com.webos.service.tv.*`, `com.webos.service.eim`, `com.webos.service.oledepl`, `com.webos.service.pqcontroller`, `com.webos.service.capture`, `com.webos.service.attachedstoragemanager` on 10.1.1.209? Source budget did not include an on-device `ls-monitor -i <service>` + `luna-send-pub` vs `luna-send` 401 sweep; that sweep is the single highest-value follow-up.
- Does 04.40.16 patch WebSocket SSAP manifest validation to reject the spoofed `com.lge.test` signature used by bscpylgtv/aiowebostv, shrinking Tier A? A non-root WS `register` trace with `manifest` echo is needed.
- Do 5.4.1 AU's private role files live at `/var/palm/ls2` + `/var/palm/ls2-dev` (legacy) or `/var/luna-service2*` (current)? `elevate-service.ts` covers both roots but the live path determines which `ls-control scan-services` directory must be monitored for companion persistence.
- After OTA block (`/var/lib/webosbrew/startup.sh` → `/media/cryptofs` overlay), does a companion that owns `all` survive `04.40.16 → next` delta-update without re-`elevate-service`, or does LG's delta reconstitute `/var/luna-service2/roles.d` from signed manifests?

## Sources

1. [[luna-service-bus-webos-homebrew-project]] — Luna service bus | webOS Homebrew Project
2. [[security-guide-webos-open-source-edition]] — Security Guide | webOS Open Source Edition
3. [[bscpylgtvbscpylgtvendpointspy-at-master-chros73bscpylgtv-github]] — bscpylgtv/bscpylgtv/endpoints.py at master · chros73/bscpylgtv
4. [[bscpylgtvbscpylgtvmanifestpy-at-master-chros73bscpylgtv-github]] — bscpylgtv/bscpylgtv/manifest.py at master · chros73/bscpylgtv
5. [[comwebosserviceconfig-webos-open-source-edition]] — com.webos.service.config | webOS Open Source Edition
6. [[comwebosservicecec-webos-open-source-edition]] — com.webos.service.cec | webOS Open Source Edition
7. [[comwebosservicepower2-webos-open-source-edition]] — com.webos.service.power2 | webOS Open Source Edition
8. [[elevate-servicets]] — elevate-service.ts (webosbrew/webos-homebrew-channel)
9. [[ls2-api-index-webos-open-source-edition]] — LS2 API Index | webOS Open Source Edition
10. [[luna-service-api-introduction-webos-tv-developer]] — Luna Service API Introduction | webOS TV Developer

