# Evidence digest — top claims + verbatim quotes

## 1. Luna Bus ACL three-tier (Security Guide, Luna Bus webosbrew)
- Claim: LS2 ACL = ACG + TrustLevel dev/part/oem; requiredPermissions in appinfo.json generates client-permissions; luna-send as root has pseudo-role all [[security-guide-webos-open-source-edition]] [[luna-service-bus-webos-homebrew-project]]
- Quote: "luna-send command executed as root has access to all private and public APIs. (all is a pseudo-role)" [[luna-service-bus-webos-homebrew-project]]
- Live: 10.1.1.209 WS 3000 returned 401 for getForegroundAppInfo, but luna-send root succeeded — WS 401 tier is real, not theory.

## 2. JS service lifecycle (FAQ, Activity Manager)
- Quote: "There is a 5-second timer built into the webos-service library, which causes services to exit if they're not currently active." [[javascript-service-faq-webos-tv-developer]]
- Quote: ActivityManager foreground vs background, persist, explicit, continuous, power flags [[activity-manager-api-reference-guide-webos-tv-developer]]

## 3. Rooting (webosbrew, RootMyTV, faultmanager)
- Quote: "RootMyTV vulnerabilities have been patched by LG. RootMyTV is unlikely to work on firmware released since mid-2022." [[rooting-webos-homebrew]]
- Quote: "latest firmware for essentially all LG models running webOS 5,6,7,9 is patched As of 2025-08-24" [[github-throwaway96faultmanager-autoroot]]

## 4. Capture pipeline (piccap, hyperion-webos)
- Claim: hyperion-webos unicapture blends libvtcapture + libhalgal with quirks 0x1-0x100; AI Picture Pro conflict causes dropout [[github-tbsnillerpiccap-piccap-hyperion-sender-app-ambilight-for-lg-webos-tvs-git]] [[github-webosbrewhyperion-webos-hyperionng-video-grabber-for-webos-github]]
- Manual: scp + luna://com.webos.appInstallService/dev/install {"id":"...","ipkUrl":"/tmp/....ipk","subscribe":true} [[github-tbsnillerpiccap-piccap-hyperion-sender-app-ambilight-for-lg-webos-tvs-git]]

## 5. HA Quality Scale Platinum
- Quote: "Platinum is the highest tier... fully typed... fully asynchronous... efficient data handling" [[integration-quality-scale-home-assistant-developer-docs]]
- Rules: async-dependency, inject-websession, strict-typing [[integration-quality-scale-rules-home-assistant-developer-docs]]

