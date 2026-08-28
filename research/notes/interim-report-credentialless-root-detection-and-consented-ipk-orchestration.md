---
title: Interim report — credentialless-root-detection-and-consented-ipk-orchestration
id: interim-report-credentialless-root-detection-and-consented-ipk-orchestration
tags:
- lgtv-webos-ha-root-1a89ff
- locus-credentialless-root-detection-and-consented-ipk-orchestration
created: '2026-08-28T02:42:08.984651Z'
status: draft
type: interim
deprecated: false
summary: 'Hybrid probe: SSDP passive + single WS HB exec (uid=0 + /var/lib/webosbrew/startup.sh
  durable) before consented 23/Dropbear 22 probes; prefer hbchannel.service/install
  (on-TV SHA256, subscribe progress, /var/lib init.d respawn) over direct appInstallService/dev/install
  + scp + ares 9922/22 fallback; OTA wipe boundary /media/developer vs /var/lib, Platinum
  test-before-configure + diagnostics redaction.'
---

# Interim report: credentialless-root-detection-and-consented-ipk-orchestration

**Locus question:** Credential-less root probe cascade + user-consented IPK install via Homebrew vs appInstallService vs ares — which survives OTA and versions safely?
**Flavor:** dialectical

## What the corpus already said

The width sweep treated root presence as a binary Homebrew flag rather than a tiered, probe-able state. The Homebrew Channel note documented the four unauthenticated root signals on the live 10.1.1.209 OLED48CXPTA (telnet:23 unauthenticated shell, Dropbear 22 SSH, /media/developer overlay at /media/developer/apps/usr/palm/services/org.webosbrew.hbchannel.service, and Luna service org.webosbrew.hbchannel.service with install/exec/spawn) plus the persistence spine (/var/lib/webosbrew/startup.sh copy plus /var/lib/webosbrew/init.d run-parts hooks) [[github-webosbrewwebos-homebrew-channel-unofficial-webos-tv-homebrew-store-and-ro]] and the Luna bus note placed them on the LS2 bus (luna-send as root = all pseudo-role, luna-send-pub = public only, roles in /var/luna-service2 vs /var/luna-service2-dev, ls-monitor -i prints provides arrays) [[luna-service-bus-webos-homebrew-project]]. The install path was hinted via the PicCap pattern (scp to /tmp then luna://com.webos.appInstallService/dev/install with subscribe:true) and the ares-install / ares-setup-device prisoner@9922 vs root@22 split in the CLI guide [[cli-developer-guide-webos-tv-developer]], but no note ordered the probes by invasiveness, distinguished devmode false positives, defined the OTA-wipe boundary for /media/developer vs /var/lib/webosbrew, or mapped any of it to HA Platinum config-flow rules (test-before-configure, diagnostics redaction, discovery) — that mapping is the locus gap.

## What the new sources say

**1. webosbrew startup.sh — the exact boot-persistence contract [[startupsh]]**

> `# Automatically elevate Homebrew Channel service`
> `elevate_script="${SERVICE_DIR}/elevate-service"`
> `if [[ -z "${SKIP_ELEVATION}" && -x "${elevate_script}" ]]; then "${elevate_script}"`

and the OTA-relevant preamble:

> `if [[ -e /var/luna/preferences/webosbrew_failsafe ]]; then "${SERVICE_DIR}/bin/telnetd" -l /bin/sh`
> `touch /var/luna/preferences/webosbrew_failsafe; sync -f /var/luna/preferences/webosbrew_failsafe; sleep 2`
> `if [[ ! -e /var/luna/preferences/webosbrew_telnet_disabled ]]; then "${SERVICE_DIR}/bin/telnetd" -l /bin/sh 200>&-`
> `if [[ -e /var/luna/preferences/webosbrew_sshd_enabled ]]; then mkdir -p /var/lib/webosbrew/sshd; "${SERVICE_DIR}/bin/dropbear" -R`
> `mkdir -p /var/lib/webosbrew/init.d; run-parts /var/lib/webosbrew/init.d`
> `sleep 10; rm -rf /var/luna/preferences/webosbrew_failsafe`

This defines the credential-less signal taxonomy by code path. Unauthenticated telnet:23 exists iff webosbrew_failsafe missing and webosbrew_telnet_disabled absent (default-on on webOS 5.x, absent on webOS 9 where telnetd binary is stripped). Dropbear 22 exists only if webosbrew_sshd_enabled (opt-in, key-auth only). The durable root fossils are /var/lib/webosbrew/startup.sh (copied from ${SERVICE_DIR}/startup.sh) and executables in /var/lib/webosbrew/init.d (filenames [a-zA-Z0-9-_]). The overlay /media/developer/apps/usr/palm/services/org.webosbrew.hbchannel.service is the volatile source, not the durable sink — a critical OTA distinction.

**2. webosbrew Homebrew Channel Luna service — the install/exec API surface [[github-webosbrewwebos-homebrew-channel-unofficial-webos-tv-homebrew-store-and-ro]]**

> `luna://org.webosbrew.hbchannel.service/install — Arguments: ipkUrl [string] HTTP(s) URL, ipkHash [string] SHA256 checksum, subscribe [boolean] — Returns: finished, statusText, progress`
> `luna://org.webosbrew.hbchannel.service/exec — Arguments: command [string] — Returns: error, stdoutString, stdoutBytes, stderrString`
> `luna://org.webosbrew.hbchannel.service/spawn — long-running process, returns type stdoutData|stderrData|close|exit`

and the official fallback:

> `luna-send-pub -i 'luna://com.webos.appInstallService/dev/install' '{"id":"com.ares.defaultName","ipkUrl":"/tmp/path/to/hbchannel.ipk","subscribe":true}'`

Plus the update-persistence line:

> `cp /media/developer/apps/usr/palm/services/org.webosbrew.hbchannel.service/startup.sh /var/lib/webosbrew/startup.sh`

The Homebrew path is the only one that verifies SHA256 on-TV (ipkHash) and streams progress via subscribe. The exec channel is the credential-less detector: `exec {"command":"id"}` returns `uid=0(root)` if rooted else non-zero user, and `exec {"command":"test -f /var/lib/webosbrew/startup.sh && echo ok"}` probes durability without touching the filesystem from HA.

**3. elevate-service.ts — the exact filesystem patch that makes install stick [[elevate-servicets]]**

> `function patchRoleFile(path, legacy, requiredNames = ['*', 'com.webos.service.capture.client*'])`
> `if (!allowedNames.includes(name)) allowedNames.push(name)`
> `perm.outbound.push('*'); // perm.inbound push`
> `roleNew.permissions.push({service: name, inbound:['*'], outbound:['*']})`
> `writeFileSync(clientPermFile, JSON.stringify({[serviceName*]:['all']}))`
> `writeFileSync(apiPermFile, JSON.stringify({[group]: [serviceName/*]}))` then `ls-control scan-services`

and the dual-root scan:

> `legacyLunaRootDev = '/var/palm/ls2-dev'; legacyLunaRootNonDev = '/var/palm/ls2'`
> `lunaRootDev = '/var/luna-service2-dev'; lunaRootNonDev = '/var/luna-service2'`

Proof that a companion IPK must run elevate-service to escape /usr/bin/jailer and /usr/bin/run-js-service jailing and to claim the all pseudo-role; without it the companion's own JS service is still dev-trustLevel and cannot call private tier. The manifest/clientPermissions/apiPermissions patching writes to both -dev and non-dev trees, so detection must check both.

**4. official webosbrew install.sh — the canonical consented install orchestration [[installsh]]**

> `MANIFEST_URL="https://github.com/webosbrew/webos-homebrew-channel/releases/latest/download/org.webosbrew.hbchannel.manifest.json"`
> `IPK_URL=$(node -e '...manifest.ipkUrl...'); IPK_SHA256=$(...manifest.ipkHash.sha256...)`
> `curl -L -o /tmp/hbchannel.ipk -- "$IPK_URL"; echo "$IPK_SHA256  /tmp/hbchannel.ipk" | sha256sum -c`
> `mkfifo /tmp/luna-install; luna-send-pub -w 15000 -i 'luna://com.webos.appInstallService/dev/install' '{"id":"com.ares.defaultName","ipkUrl":"/tmp/hbchannel.ipk","subscribe":true}' >/tmp/luna-install &`
> `fgrep -m 1 -e 'installed' -e 'failed' /tmp/luna-install; case "$result" in *installed*) ;; *) exit 1;; esac`
> `/media/developer/apps/usr/palm/services/org.webosbrew.hbchannel.service/elevate-service || echo "[!] Elevation failed - is Your TV rooted?"`

This is the reference flow every consented HA installer must mirror: manifest-resolve → curl → sha256sum -c on TV → luna-send-pub dev/install with 15s -w timeout and FIFO wait for installed/failed → elevate-service. It also reveals the failure mode HA must surface: fgrep timed out → "Install timed out", and non-installed string → errorCode -5 (usually clock skew).

**5. CLI Developer Guide — ares-setup-device / ares-install pairing model [[cli-developer-guide-webos-tv-developer]]**

> `ares-setup-device --list` shows `prisoner@10.123.45.67:9922 ssh tv` vs `developer@127.0.0.1:6622` emulator
> `privatekey: tv_webos, passphrase: <6-char Developer Mode app>`
> `ares-package ./sampleApp ./sampleService` requires `service name start with app ID` to bundle into single IPK
> `ares-install --device tv ./com.domain.app_1.0.0_all.ipk`

The ares path is the only one that needs a pre-provisioned SSH identity (prisoner key + passphrase for devmode port 9922, or root authorized_keys for Dropbear 22) and a Node.js toolchain. That makes it unsuitable as the default HA-core Platinum dependency (async-dependency + inject-websession violation), but it is the developer-side path for building/signing the companion IPK, not the runtime install path.

**6. HA test-before-configure rule — the Platinum gate for any probe [[test-a-connection-in-the-config-flow-home-assistant-developer-docs]]**

> `Apart from being very easy to use, config flows are also a great way to let the user know that something is not going to work when the configuration has been completed.`
> `Since this improves the user experience, it's required to test the connection in the config flow.`
> `async def async_step_user(...): client = MyClient(user_input[CONF_HOST]); try: await client.get_data(); except MyException: errors["base"] = "cannot_connect"`

and the exemption:

> `Integrations that rely on auto-discovery on runtime (like Google Cast) are also exempt`

For webostv this means the root probe must live inside async_step_user / async_step_ssdp test call and must surface cannot_connect before async_create_entry, not as a background discovery scan. No separate exemption applies — webostv owns SSDP discovery but still must test WS pairing before entry creation.

**7. HA diagnostics + quality-scale rules — redaction and discovery boundaries [[implements-diagnostics-home-assistant-developer-docs]] [[integration-quality-scale-rules-home-assistant-developer-docs-2]]**

> `TO_REDACT = [CONF_API_KEY, CONF_LATITUDE, CONF_LONGITUDE]`
> `return {"entry_data": async_redact_data(entry.data, TO_REDACT), "data": entry.runtime_data.data}`
> `🥉 Bronze: config-flow, test-before-configure, unique-config-entry, runtime-data`
> `🥇 Gold: diagnostics, discovery, reconfiguration-flow`
> `🏆 Platinum: async-dependency, inject-websession, strict-typing`

This forces the probe cascade to redact host, client_key, ipkHash, dropbear banner, and exec stdout in diagnostics, and to advertise root capability via runtime_data rather than persistent port-scan logs.

**8. HA SSDP/zeroconf discovery — the passive front door [[simple-service-discovery-protocol-ssdp-home-assistant]] [[zero-configuration-networking-zeroconf-home-assistant]]**

> `The SSDP integration will scan the network for supported devices and services. Discovered integrations will show up in the discovered section`
> `LG webOS TV` listed under `Discovered integrations` for SSDP
> `zeroconf integration will scan for ... HomeKit section to manifest.json`

LG webOS TV is SSDP-native (urn:lge:com:service:webos-second-screen:1), so the credential-less cascade can start passive (SSDP location header → IP) without any TCP probe. Zeroconf/mDNS is available for the companion's own capability advertisement once installed (e.g., _ha-companion._tcp.local with txtvers=1 companion_version=1.2.3 capabilities=cec,capture,audio,voice,dashboard).

## Evidence synthesis

The seven new sources plus the corpus converge on a three-signal-class cascade, not a single "is_root" boolean, and on two install paths that differ exactly where Platinum cares: coupling, verification, and OTA wipe resistance.

Signals split into durable-vs-volatile and active-vs-passive: /var/lib/webosbrew/startup.sh + /var/lib/webosbrew/init.d/* + /var/lib/webosbrew/sshd are durable across reboot and survive factory app wipe better than /media/developer/apps/usr/palm/services/org.webosbrew.hbchannel.service which lives on the developer overlay and is listed in RootMyTV README as removable before OTA ("remove /media/cryptofs/apps/usr/palm/services/com.palmdts.devmode.service/start-devmode.sh right before an update"), and telnet:23 unauth and Dropbear 22 banners are active TCP probes while org.webosbrew.hbchannel.service/exec is an LS2 query that can be tunnelled over the existing WS SSAP session without opening new sockets. The SSDP header is entirely passive. This ordering matters for HA's privacy stance: a background discovery sweep that TCP-connects to 23/22 on every /24 is indistinguishable from port scanning and would fail code review and diagnostics redaction, whereas a single on-demand probe during test_before_configure after SSDP discovery, with 800 ms connect timeout and 500 ms banner read, is reviewable as a user-initiated connection test.

Install verification splits on where SHA256 is checked: Homebrew hbchannel.service/install checks ipkHash on-TV (the install.sh manifest flow proves this is the canonical verification), while luna://com.webos.appInstallService/dev/install with ipkUrl=/tmp/*.ipk has no ipkHash field — verification must happen on-TV via explicit sha256sum -c before the luna-send-pub, or off-TV before scp. The official appInstallService path therefore requires HA (or the companion's bootstrapper) to scp the IPK to /tmp first, which itself requires an authenticated channel (telnet is unauth but deprecated, Dropbear needs authorized_keys, prisoner 9922 needs devmode privatekey+passphrase). Homebrew's path needs only an HTTP fetch on-TV (no scp), so it is the only truly credential-less install after the initial root — once Homebrew is present, subsequent companion updates need no SSH credentials, only the Homebrew service being reachable over WS. Version pinning differs too: Homebrew supports reinstall ("press 5 to Reinstall") and update detection via manifest version compare; appInstallService requires HA-side version tracking (compare appinfo.json version strings discrete per LG spec 999999999.999999999.999999999, not semver) and must handle errorCode -5 downgrade rejection by forcing with the optional "reinstall" flag in the JSON if available or by uninstall-then-install fallback.

OTA survival is the third axis: 10.1.1.209 is on 04.40.16 AU (webOS 5.4.1, 2020 CX), which RootMyTV notes mark as patched since 5.4.0 for RootMyTV v1, but faultmanager/dejavuln-autoroot remain viable for webOS 5+ until late 2025 patches, after which future OTA to 10.x would patch faultmanager and wipe /media/cryptofs and elevate-service patches that write to /var/luna-service2 (signed manifests reconstituted). Therefore any companion IPK that writes its own client-permissions/rolegeneration is OTA-fragile unless it also installs a /var/lib/webosbrew/init.d/* respawn script that re-runs elevate-service on boot (exactly as Homebrew does), and the HA integration must re-probe after OTA (test_before_setup) and fall back to stock WS Tier A/B gracefully when root is lost.

### Position A: Homebrew hbchannel.service is the primary installer — direct appInstallService/ares is the fallback

Best case: HA should probe via HB channel first because it is already on 10.1.1.209 (hyperhdr/piccap/jellyfin prove init.d hooks work), it gives on-TV SHA256 verification (ipkHash) without needing to scp secrets across the LAN, it streams progress via subscribe (Platinum can surface statusText/progress% in config flow), and it centralises update/rollback UX via the channel's own repository manifest. Detection is a single WS call luna://org.webosbrew.hbchannel.service/exec {"command":"id && test -f /var/lib/webosbrew/startup.sh && echo hb_ok"} — if returns uid=0 plus hb_ok, root + durable Homebrew is confirmed without any TCP port probe, satisfying Platinum's "no port scan" review. Install is then luna://org.webosbrew.hbchannel.service/install {"ipkUrl":HA_HTTP_URL,"ipkHash":sha256,"subscribe":true} (HA can serve the IPK via its own HTTP component on LAN, no cloud), which the install.sh pattern validates. Direct luna://com.webos.appInstallService/dev/install is retained only for the bootstrap case where Homebrew is present-but-not-rooted (exec returns non-zero) or for first-time Homebrew installation itself, where ares-install/prisoner 9922 is needed once. OTA survival is handled by Homebrew's own /var/lib/webosbrew/startup.sh → elevate-service respawn; companion adds a lightweight init.d script that re-applies its own permission patches after ls-control scan-services, so no HA re-install is needed after reboot.

### Position B: Direct com.webos.appInstallService/dev/install (or ares-install over Dropbear 22) is the portable, channel-decoupled primary

Best case: Coupling to org.webosbrew.hbchannel.service makes the companion uninstallable if a user removes Homebrew Channel, if the channel enters failsafe mode (/var/luna/preferences/webosbrew_failsafe triggers only emergency telnet, hbchannel.service not elevated), or if LG's OTA reconstitutes /var/luna-service2 and strips the hbchannel.service all role before HA can re-elevate. The official dev/install endpoint is present on every webOS TV regardless of root method and works identically in devmode (prisoner:9922) and rooted (root:22 or telnet), so the HA config flow can offer a single code path that works for both audiences: scp IPK to /tmp via whatever authenticated channel the user consented to (Dropbear key or devmode key), sha256sum -c locally, then luna-send-pub dev/install with subscribe and FIFO installed/failed detection as in install.sh. ares-install is the SDK-blessed variant of the same path and handles the 50-hour devmode session renewal that Homebrew bypasses. Version pinning/rollback belongs in HA's config entry (runtime_data.desired_version vs installed_version) rather than in Homebrew's repo manifest, keeping the companion versioned with the integration's release train and redacted in diagnostics. This path also satisfies HA's dependency-is-async + inject-websession rules (no HB channel daemon dependency, no persistent service coupling), and avoids giving a third-party channel (webosbrew) install authority over the user's TV from HA.

## Committed position

The evidence favours a consented hybrid with a strict ordering, not a single winner: passive SSDP discovery → single WS SSAP probe of org.webosbrew.hbchannel.service/exec (credential-less, no TCP scan) → only-with-consent active TCP/telnet probes → Homebrew hbchannel.service/install as the default installer when the HB probe succeeds, direct luna://com.webos.appInstallService/dev/install via authenticated scp as the bootstrapping fallback when it does not — because on 10.1.1.209 the only path that verifies SHA256 on-TV without scp, streams progress% over subscribe, and survives reboot via /var/lib/webosbrew/startup.sh + init.d respawn is the Homebrew channel, while the only path that survives Homebrew removal, failsafe mode, and the 50-hour devmode renewal is the official dev/install endpoint, and neither alone satisfies the Platinum consented-install UX across the rooted-vs-devmode audience and the 5.4.1→future OTA wipe boundary, so HA must implement both, prefer HB, and fall back to direct with HA-side version pinning in runtime_data.

- **Position:** Prefer hbchannel.service/install when HB exec proves root+durable Homebrew (single WS call), otherwise fall back to scp + luna://com.webos.appInstallService/dev/install; never port-scan outside test_before_configure with explicit consent.
- **Confidence:** medium (60–70%) — startup.sh/elevate-service/HB interfaces are ground truth, but OTA reconstitution behaviour for 5.4.1 AU → 10.x delta updates and LG's future appInstallService downgrade policy are not published and must be inferred from 2025-08 faultmanager patch notes; live 10.1.1.209 sweep would raise to high.
- **Boundary conditions:** Holds for webOS TV 4.0–10.x consumer firmware where Luna roles live in /var/luna-service2* and HB channel is distributable; does not hold for webOS OSE/QEmu where hbchannel.service is absent, or for store-distributed builds where requiredPermissions all is rejected at signing and ares prisoner 9922 is the only authenticated channel.
- **What would change this position:** A reproducible on-device trace showing luna://org.webosbrew.hbchannel.service/install is unreachable over WS SSAP without root (requires additional requiredPermissions the companion cannot declare), or LG patch notes proving 10.1.1.209's 04.40.16→next OTA reconstitutes /var/lib/webosbrew/startup.sh and wipes init.d despite the /var/lib bind, or an HA core review ruling that any TCP connect to 23/22 even during test_before_configure with consent is disallowed port scanning — any one would collapse the cascade to pure WS probe + direct dev/install only.
- **Evidence weight:** 3 direct program artefacts support (startup.sh durable vs overlay, elevate-service patch + ls-control, install.sh FIFO manifest→sha256→dev/install), 2 Luna bus semantics support (all vs public, -dev vs non-dev split), 1 official CLI source bounds ares path (prisoner 9922 vs root 22), 2 HA docs constrain UX (test_before_configure + diagnostics redaction + SSDP passive); 1 adversarial signal weakens (faultmanager 2025-08 patch status for 5.4.1 AU exact OTAID unconfirmed).

## Open questions

- Exact OTAID for OLED48CXPTA 04.40.16 AU — is this build in the "essentially all LG models running webOS 5,6,7,9 is patched as of 2025-08-24" faultmanager list, hence next OTA will permanently unroot and wipe HB channel elevation?
- Does luna://org.webosbrew.hbchannel.service/install remain callable over WS SSAP after the TV is rooted but before companion elevation (i.e., does HB's own all role make it WS-reachable without any companion requiredPermissions), and does it enforce HTTP-only ipkUrl or accept file:///tmp/*.ipk for direct path?
- What is the exact errorCode/returnValue for appInstallService downgrade rejection on 5.4.1 (errorCode -5 is clock skew, but downgrade may be -6 or 20) and does the JSON accept a force:true or reinstall:true to atomically rollback?
- Does /var/lib/webosbrew/init.d respawn run before or after LS2 hub starts com.webos.service.config + cec, hence whether companion's own elevate-service patch in init.d races ls-control scan-services and needs a post-hub retry?

## Sources

1. [[startupsh]] — startup.sh (webosbrew/webos-homebrew-channel/services/startup.sh)
2. [[elevate-servicets]] — elevate-service.ts (webosbrew/webos-homebrew-channel/services/elevate-service.ts)
3. [[github-webosbrewwebos-homebrew-channel-unofficial-webos-tv-homebrew-store-and-ro]] — GitHub - webosbrew/webos-homebrew-channel: Unofficial webOS TV homebrew store and root-related tooling
4. [[luna-service-bus-webos-homebrew-project]] — Luna service bus | webOS Homebrew Project
5. [[installsh]] — install.sh (webosbrew/webos-homebrew-channel/tools/install.sh)
6. [[cli-developer-guide-webos-tv-developer]] — CLI Developer Guide | webOS TV Developer (ares-package, ares-install, ares-setup-device)
7. [[test-a-connection-in-the-config-flow-home-assistant-developer-docs]] — Test a connection in the config flow | Home Assistant Developer Docs
8. [[implements-diagnostics-home-assistant-developer-docs]] — Implements diagnostics | Home Assistant Developer Docs
9. [[integration-quality-scale-rules-home-assistant-developer-docs-2]] — Integration quality scale rules | Home Assistant Developer Docs
10. [[simple-service-discovery-protocol-ssdp-home-assistant]] — Simple Service Discovery Protocol (SSDP) | Home Assistant
11. [[zero-configuration-networking-zeroconf-home-assistant]] — Zero-configuration networking (zeroconf) | Home Assistant
12. [[security-guide-webos-open-source-edition]] — Security Guide | webOS Open Source Edition (ACG TrustLevel)
13. [[appinfojson-webos-tv-developer]] — appinfo.json | webOS TV Developer (version, id constraints)
