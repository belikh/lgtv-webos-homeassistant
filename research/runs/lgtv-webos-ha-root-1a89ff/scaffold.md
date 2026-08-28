## User Prompt (VERBATIM — gospel)

Platinum-quality native LG webOS Home Assistant companion application for a ROOTED LG webOS TV: exhaustive audit of what rooting enables that is NOT possible on stock webOS, and complete bidirectional integration possibilities between Home Assistant and the LG TV, to design (a) a native webOS app at Home Assistant Quality Scale Platinum level and (b) a second 'native-app-present' mode for the sister Home Assistant integration that currently uses the bscpylgtv library. Live TV fingerprint 10.1.1.209 OLED48CXPTA webOS TV 5.4.1 (webOS 5.0) 04.40.16 AU, rooted via webosbrew/Homebrew (telnet:23 root, Dropbear 22, hyperhdr/piccap/jellyfin services, /media/developer overlay, webosbrew startup.sh), Luna privileged calls succeed as root but return 401 over WS SSAP. Research must also determine: auto-detection of root (telnet/luna/overlay/webosbrew signals) and user-consented auto-installation of the companion IPK via Homebrew/appInstallService/ares-install during HA config flow. The research must determine the ultimate, mind-blowingly useful application — roadmap to a TV as full HA edge node (dashboard, HDMI-CEC hub, camera/ambient, voice satellite, persistent service). Bidirectional matrix HA<->LGTV, root capability audit stock vs rooted, native app architecture (Enact/React vs vanilla JS service, foreground + JS service + systemd companion, IPK/ares-cli, mDNS/SSDP/WebSocket, appinfo.json permissions, security/pairing re-using client-key), platinum quality plan, sister repo second-mode GitHub issue markdown, phased roadmap.

## Run Config

- vault_tag: lgtv-webos-ha-root-1a89ff
- query_file_path: research/runs/lgtv-webos-ha-root-1a89ff/query.md
- modality: synthesize
- wrapper requirements: save path research/notes/final_report_lgtv-webos-ha-root-1a89ff.md, citation format note IDs, terminal sections for roadmap + GitHub issue body
- profile: full (55-80 sources)

## Modality Rationale

Synthesize — defended thesis on what root unlocks and exhaustive bidirectional design, with committed recommendation for stack and install flow.

## Tier Rationale (to be updated by step 1)

Expected full — argumentative deep-research with adversarial review.

## Wrapper Requirements

- Research Base CLI: /home/io/projects/hyperresearch-opencode/.venv/bin/hyperresearch
- No WebFetch — use hyperresearch fetch
- Academic APIs before web search
- Save final report to research/notes/final_report_lgtv-webos-ha-root-1a89ff.md

## Tier Rationale

Full tier — 14 sub-questions with contested loci (Enact vs vanilla, Homebrew vs appInstallService, WS vs MQTT, security model), exhaustive bidirectional matrix, live root fingerprint ground truth, and defended thesis for ultimate application requires adversarial review and triple-draft synthesis. Light would truncate root ACL analysis and phased verification.
