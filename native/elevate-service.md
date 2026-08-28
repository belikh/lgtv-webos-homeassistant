# elevate-service — `roles.d` `all` patch for `com.ha.tvbridge.service` (+ ambient)

> Re-uses `webosbrew/webos-homebrew-channel` `services/elevate-service.ts` pattern that `piccap` relies on for Tier C capture.

## Why this exists

Stock `roles.json` for `com.ha.tvbridge.service` carries only the 14 `requiredPermissions` declared in `appinfo.json` (`audio.operation`, `cec.query`, `tv.operation`, …). Tier C methods — `com.webos.service.capture` (`executeOneShot` / unicapture), `eim`, `oledepl`, `pqcontroller`, `tv.*`, `cec.operation` private — are `provides: ["private","tv.services"]` with `TrustLevel oem` and remain `401` even with those permissions [[security-guide-webos-open-source-edition]].

Root elevates the JS service to the pseudo-role `all` so `luna-send` as root and `hbchannel.service/exec` both succeed `200`. `hyperion-webos` proves it: `unicapture` blending `libvtcapture` + `libhalgal` only works after the `all` patch [[github-webosbrewhyperion-webos-hyperionng-video-grabber-for-webos-github]].

## What the patch does (mirrors `elevate-service.ts`)

For `serviceName = "com.ha.tvbridge.service"` (and ambient daemon if present):

**Per Luna root** `/var/luna-service2` (store) **and** `/var/luna-service2-dev` (devmode):

1. **Service file** — patch `Exec=/usr/bin/run-js-service` → `Exec=<repo>/run-js-service` if present (JS) or unwrap `Exec=/usr/bin/jailer … <binary>` → `Exec=<binary>` (native) at
   - `/var/luna-service2/services.d/com.ha.tvbridge.service.service`
   - `/var/palm/ls2*/services/{pub,prv}/com.ha.tvbridge.service.service` (legacy `<4.x`)

2. **Role file** — append `allowedNames: ["*","com.webos.service.capture.client*"]` and ensure each `permission` has `outbound ["*"]`; add missing `service: "*"` permission with `inbound/outbound ["*"]` at
   - `/var/luna-service2/roles.d/com.ha.tvbridge.service.service.json`
   - `/var/palm/ls2*/roles/{pub,prv}/com.ha.tvbridge.service.json`

3. **Client permissions** — create `client-permissions.d/com.ha.tvbridge.service.root.json`:
   ```json
   { "com.ha.tvbridge.service*": ["all"] }
   ```

4. **API permissions** — create
   - `api-permissions.d/com.ha.tvbridge.service.api.public.json`: `{"public":["com.ha.tvbridge.service/*"]}`
   - `api-permissions.d/com.ha.tvbridge.service.api.lunabus.query.json`: `{"lunabus.query":["com.ha.tvbridge.service/*"]}`

5. **Manifest** — append `clientPermissionFiles` and `apiPermissionFiles` to `/var/luna-service2/manifests.d/com.ha.tvbridge.json` if present.

6. **Rescan** — once, if any file changed:
   ```sh
   ls-control scan-services
   # legacy:
   luna-send -n 1 luna://com.webos.service.config/setConfigs '{"configs":{"tv.hotkeyMethod":"..."}}' # no-op, forces bus reload on some firmware
   ```

Full reference implementation: `research/notes/elevate-servicets.md` (verbatim `elevate-service.ts`) and `node src/elevate-service.ts` from `webos-homebrew-channel`.

## When it runs

- **At install** — HB `luna://org.webosbrew.hbchannel.service/install` or `luna://com.webos.appInstallService/dev/install` triggers `run-js-service` persistence-DB write; `elevate-service` runs immediately after unpack so the first `getCapabilities` can succeed without reboot.
- **At boot** — `/var/lib/webosbrew/startup.sh` runs `run-parts /var/lib/webosbrew/init.d` after `elevate-service` for Homebrew itself; ambient daemon’s `start()` also idempotently runs `ls-control scan-services` if needed.
- **Not on every Luna call** — the patch is file-system state, not per-request. Do not patch in the JS hot path.

## Verify

```sh
# On TV 10.1.1.209 as root (telnet:23 or hbchannel.service/exec):
luna-send -n 1 'luna://com.webos.service.capture/executeOneShot' '{"path":"/tmp/test.jpg","method":"DISPLAY","width":64,"height":64}'
# 200 with elevate, 401 without

cat /var/luna-service2/roles.d/com.ha.tvbridge.service.service.json | jq .allowedNames
cat /var/luna-service2/client-permissions.d/com.ha.tvbridge.service.root.json
ls-control scan-services; echo $?

luna-send -n 1 luna://com.ha.tvbridge.service/getCapabilities '{}'
luna-send -n 1 luna://com.ha.tvbridge.service/getAmbientLux '{}'
# ambient returns simulated on scaffold, flatbuffer when native live on :19400
```

## Security note — least privilege

Stock `requiredPermissions` never requests `all`; the `all` rewrite lives only in this elevated tier and is `ls-control` scanned once at install. Stock TVs without root keep Tier C `401` and the ambient `sensor ambient_lux` stays `available: false` — no silent privilege escalation, no store submission with `all` (store would strip it).

## Source

- `research/notes/elevate-servicets.md` — verbatim `elevate-service.ts` (Apache-2.0, webosbrew)
- `github-webosbrewhyperion-webos-hyperionng-video-grabber-for-webos-github` — why capture needs `all`
- `luna-service-bus-webos-homebrew-project` — `/var/luna-service2` vs `/var/luna-service2-dev` split
