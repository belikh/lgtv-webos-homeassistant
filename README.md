# lgtv-webos-homeassistant — Platinum Native Companion for LG webOS TV

Root-aware native companion for rooted LG webOS TV `OLED48CXPTA` `5.4.1` `04.40.16` AU — see `research/notes/final_report_lgtv-webos-ha-root-1a89ff.md` for the full roadmap (62 sources, 6 loci, 5-phase ladder).

> **One-OTA fragile:** `04.40.16` is pre-`2025-08-24` faultmanager patch — one accepted delta OTA permanently wipes `/var/lib` `roles.d` and `init.d`. `Block System Updates` defaults true.

## Quick links

- **Roadmap:** `research/notes/final_report_lgtv-webos-ha-root-1a89ff.md` — 12 sections, 30-row bidirectional matrix, 3-tier ACL audit on `10.1.1.209` live probe
- **Sister second mode (GitHub issue ready):** `docs/sister-second-mode-issue.md`
- **Plan stub:** `plan.md`

## Repo

Code lives in `com.ha.tvbridge/` (Enact) + `com.ha.tvbridge.service/` (JS service) — scaffold landing next.

