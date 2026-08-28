# lgtv-webos-homeassistant — Platinum Native Companion Plan (condensed)

> This is the executable companion to research/notes/final_report_lgtv-webos-ha-root-1a89ff.md — the roadmap's phase table and file map only.

## File map for empty repo (Phase 2 scaffold landed 2026-08-28)

```
com.ha.tvbridge/           # Enact WebView (handlesRelaunch:true requiredMemory 120)
  appinfo.json             # requiredPermissions as §5 (14 permissions)
  index.html               # Enact placeholder + webOSRelaunch -> PalmSystem.activate()
  icon.png                 # 1×1 placeholder for ares-package
com.ha.tvbridge.service/   # JS service (fork+explicit+persist Activity)
  services.json            # com.ha.tvbridge.service
  package.json             # name com.ha.tvbridge.service main service.js deps webos-service/ws node14
  service.js               # webos-service + ActivityManager create/adopt + ws wss:9923 HMAC + CEC proxy
native/                    # elevated capture daemon (unicapture libvt+libhalgal) init.d — Phase 3
  hyperion-webos           # flatbuffer 127.0.0.1:19400
.github/workflows/ci.yml   # ares-package --check + npm typecheck (skip if absent)
package.json / tsconfig.json / types/webos-service.d.ts  # root typecheck + build
```

## Platinum verify

```
npm ci && npm run lint && npm run typecheck && npm run build
ares-package com.ha.tvbridge com.ha.tvbridge.service -o build
ares-install --device 10.1.1.209 build/com.ha.tvbridge_*.ipk
luna-send -n 1 luna://com.ha.tvbridge.service/getCapabilities '{}' | jq
```

Sister repo second-mode issue lives at /tmp/opencode/openultracode/sister-second-mode-issue.md and §10 of final report.
