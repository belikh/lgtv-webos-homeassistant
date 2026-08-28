---
title: "feat: native-app-present second mode — companion WS + capability negotiation"
labels: enhancement, platinum
---

## Summary
Add root-aware second mode to `ha_chros73_bscpylgtv` that auto-detects `com.ha.tvbridge` on 10.1.1.209 via SSDP→WS HB exec→mDNS TXT→cap probe, installs IPK on consent via Homebrew/appInstallService hybrid, and gates 7 new entities behind `companion_present`.

Full design is §10 of research/notes/final_report_lgtv-webos-ha-root-1a89ff.md. This issue tracks the 15 tests and `quality_scale.yaml` strict-typing lift.

## Acceptance Criteria
- `ruff` + `mypy --strict` + `pytest -q 340` + `hassfest` 54/54 done
- See roadmap §10 for 15 enumerated tests.

