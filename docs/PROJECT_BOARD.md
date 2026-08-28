# Projects board — https://github.com/users/belikh/projects/1

**Platinum Native Companion — 5-Phase Edge-Node Ladder** — 17 items (14 issues + 3 drafts), 6 milestones Phase 0–5, custom fields Phase / ACL Tier / Effort / Priority.

## Milestones → Phases (§11)

- **Phase 0 — Ground truth** #4 ADR-001 three-tier ACL (live 10.1.1.209 401 vs root 200), #5 ADR-002 hybrid lifecycle, #6 research handoff
- **Phase 1 — Detect+Install (HA only)** #7 credential-less cascade SSDP→WS HB exec→mDNS, #8 HB/dev-install hybrid SHA256, #9 sister second-mode flag + 15 tests
- **Phase 2 — JS+ActivityManager headless** #10 wss:9923 WS + power/volume push, #11 CEC hub remote/arc/device_tracker
- **Phase 3 — Ambient flagship native** #12 unicapture libvt+libhalgal flatbuffer 127.0.0.1:19400, #13 camera piccap_stream + ambient_lux sensor
- **Phase 4 — Enact + Voice** #14 suspended handlesRelaunch:true requiredMemory 120 Lovelace warm, #15 Wyoming 16kHz UMI usb_mic0
- **Phase 5 — Platinum** #16 hassfest 54/54 strict-typing/inject-websession, #17 Homebrew repo.webosbrew.org ipkHash pinning + Block OTA

Plus drafts: Docs ROADMAP.md 12 headings 5737w, ADR-003 transport hybrid, ADR-004 one-OTA fragile.

## Custom fields

- **Phase** 0…5, **ACL Tier** A stock / B requiredPermissions / C root-only (colours §2 matrix), **Effort** S/M/L/XL, **Priority** P0/P1/P2
- **Status** default Todo / In Progress / Done — linked to milestone progress

## Sister repo

Second-mode issue mirrored to https://github.com/belikh/ha-lg-webos-tv/issues/10 — close that issue when ha_chros73_bscpylgtv PR passes ruff+mypy 340 + hassfest 54/54.

## Verify

```
hpr run verify lgtv-webos-ha-root-1a89ff -j  # passed — 5737w, citation-density 1.66
gh project view 1 --owner belikh | head
gh issue list --repo belikh/lgtv-webos-homeassistant --limit 20
```

