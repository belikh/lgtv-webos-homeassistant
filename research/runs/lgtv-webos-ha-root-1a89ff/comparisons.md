# Cross-locus comparisons

## Tension 1: ACL matrix vs lifecycle — root tier dictates keep-alive architecture

- **Locus A** `rooted-acl-boundary-stock-vs-root-luna-matrix` commits: On 5.4.1 04.40.16, WS SSAP is three-tier — ~30 verbs succeed stock, ~8–12 OSE query/operation unlock via requiredPermissions, but all TV-proprietary private capture/pqcontroller/tv.* remain 401 until root injects `allowedNames:['*']` + `client-permissions:['all']` and `ls-control scan-services`, or via hbchannel.service/exec shell proxy.
- **Locus B** `companion-lifecycle-enact-vs-js-service-vs-systemd-persistence` commits: Neither Enact nor vanilla wins alone — need hybrid suspended Enact WebView + ActivityManager-anchored foreground+explicit+persist JS service + conditional init.d native daemon, because 5s No active activities kills otherwise and memoryd/sam prioritises foreground.
- **The cross-locus dynamic:** ACL decides *whether* a native companion is required at all; lifecycle decides *how* it survives. If ACL shows most HA-relevant methods need root anyway, the cost of the native+init.d layer is justified; if many unlock via requiredPermissions, a lighter JS-only service might suffice. Depth shows the former is true for capture/cec/config — reinforcing hybrid.
- **How the draft should engage this:** Section 1's audit table must directly reference section 4's hybrid decision — each row that says "root only" becomes a requirement for the native daemon in section 4, with the 5s timer vs ActivityManager evidence.

## Tension 2: Credentialless detection vs consented install — probe determines channel

- **Locus A** `credentialless-root-detection-and-consented-ipk-orchestration` commits: Credential-less cascade passive SSDP → WS hbchannel.service/exec id for uid=0 + durable /var/lib/webosbrew/startup.sh before any TCP 23/22 probe (800ms connect, 500ms banner); install prefers Homebrew hbchannel.service/install with SHA256 when HB proves root, fallback scp + luna dev/install over Dropbear 22/ares 9922.
- **Locus B** `transport-discovery-security-pairing-ws-mqtt-hybrid` commits: Single mandatory WS wss://:3001 re-using client_key + mDNS _lg-ha-companion._tcp TXT capability advertisement satisfies Platinum local_push/inject-websession; MQTT secondary only if broker zeroconf-discovered.
- **The cross-locus dynamic:** Detection result selects transport advertisement — rooted TVs advertise companion WS capabilities via mDNS TXT, stock TVs only SSDP urn:lge-com...:1. The probe's hbchannel.service/exec reachability is itself the pre-condition for trusting the mDNS advertisement; if detection fails, coordinator must not attempt WS upgrade.
- **How the draft should engage this:** Section 3's probe sequence must flow into section 6's discovery design — show the decision tree: SSDP → WS HB exec → mDNS TXT → capability negotiation → WS upgrade, with fallback to stock bscpylgtv WS path.

## Tension 3: Lifecycle keep-alive vs SoC memory limits for edge node

- **Locus A** `companion-lifecycle-enact-vs-js-service-vs-systemd-persistence` commits: Foreground+explicit+persist Activity with FakeActivityManager 30s TTL stub defeats 5s death; Enact suspended with handlesRelaunch:true holds Lovelace at requiredMemory 120MB.
- **Locus B** `ultimate-edge-node-cec-ambient-voice-dashboard-soc-limits` commits: CX 3GB SoC kills background WebViews first at low.enter 250MB/critical 100MB; ambient capture is rooted flagship via hyperion-webos unicapture flatbuffer 127.0.0.1:19400 but needs AI Picture Pro off due 200–500ms dropout; CEC hub works stock via JS proxy.
- **The cross-locus dynamic:** Keep-alive competes for scarce memory against the very edge feats it enables. Holding an Activity foreground to keep WS alive raises priority but consumes memory budget that suspended Enact dashboard and flatbuffer capture both need; the draft must budget memoryd thresholds alongside Activity priority.
- **How the draft should engage this:** Section 8's ultimate application must budget section 4's Activity/persist costs against measured PSS — recommend CEC+ambient at reduced 256x144@30fps with UI capture disabled on CX, and note voice/camera as USB-conditional not default.

## Tension 4: Transport choice vs Platinum second-mode negotiation

- **Locus A** `transport-discovery-security-pairing-ws-mqtt-hybrid` commits: Single WS plus mDNS TXT satisfies Platinum; MQTT opt-in only.
- **Locus B** `platinum-second-mode-sister-integration-gap` commits: Second mode is single coordinator companion_present flag probed via luna://com.ha.tvbridge.service/getCapabilities over re-used client_key WS (2s) with mDNS pre-advertisement, spawning availability-gated entities under TV device, silent fallback to stock local_push.
- **The cross-locus dynamic:** Transport decides how capability negotiation is implemented — WS means coordinator re-uses existing bscpylgtv client_key WebSocket and subscribes to getCapabilities; MQTT would mean separate broker discovery and birth/will availability. The 2s probe timeout and disabled_by_default noisy diagnostics depend on transport reliability.
- **How the draft should engage this:** Section 10's GitHub issue must reference section 6's transport decision — show the coordinator code change to wrap async_get_clientsession and handle companion_present flapping, with diagnostics redaction of ipkHash/client_key.

## Tension 5: ACL private vs edge-node feasibility — what truly needs root

- **Locus A** `rooted-acl-boundary-stock-vs-root-luna-matrix` commits: TV-proprietary private services never unlock via requiredPermissions alone — they need root all-role.
- **Locus B** `ultimate-edge-node-cec-ambient-voice-dashboard-soc-limits` commits: CEC hub is stock-feasible via JS cec.query/operation proxy; ambient capture/voice/HDMI flatbuffer demand hyperion-webos native daemon + elevate-service.
- **The cross-locus dynamic:** Convergent — ACL matrix directly partitions the ultimate roadmap into stock tier (CEC, volume, app launch, toast) vs rooted tier (capture, ai.voice, capture pipeline, power reboot). The mind-blowing tier is thus root-gated, not merely permission-gated.
- **How the draft should engage this:** Section 2's bidirectional matrix must colour rows by ACL tier from section 1, and section 8 must explicitly state which edge feats are stock vs root — preventing wishful overclaim.

