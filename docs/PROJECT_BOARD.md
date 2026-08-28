# Projects board — https://github.com/users/belikh/projects/1

**Platinum Native Companion — 5-Phase Edge-Node Ladder** — 17 items (14 issues + 3 drafts), 6 milestones Phase 0–5, custom fields Phase / ACL Tier / Effort / Priority. Visibility: **Public**. Short description 248 chars. Readme synced from this file via `gh project edit 1 --visibility PUBLIC --readme "$(cat docs/PROJECT_BOARD.md)"`.

## Milestones → Phases (§11)

| Phase | Milestone (GitHub) | Issues | Title |
|---|---|---|---|
| 0 — Ground truth | Phase 0 — Ground truth + research gate | #4, #5, #6 + draft Docs | ADR-001 three-tier ACL (live 10.1.1.209 401 vs root 200), ADR-002 hybrid lifecycle, research handoff 62 notes |
| 1 — Detect+Install (HA only) | Phase 1 — Credential-less detection + consented HB/dev-install (HA only) | #7, #8, #9 | Credential-less cascade SSDP→WS HB exec→mDNS, HB/dev-install hybrid SHA256, sister second-mode flag + 15 tests |
| 2 — JS+ActivityManager headless | Phase 2 — Minimal companion JS+ActivityManager headless | #10, #11 + draft ADR-003 | wss:9923 WS + power/volume push, CEC hub remote/arc/device_tracker, ADR-003 transport hybrid |
| 3 — Ambient flagship native | Phase 3 — Ambient flagship unicapture native daemon | #12, #13 | unicapture libvt+libhalgal flatbuffer 127.0.0.1:19400, camera piccap_stream + ambient_lux sensor |
| 4 — Enact + Voice | Phase 4 — Enact dashboard + Wyoming voice | #14, #15 | suspended handlesRelaunch:true requiredMemory 120 Lovelace warm, Wyoming 16kHz UMI usb_mic0 |
| 5 — Platinum | Phase 5 — Platinum hardening + Homebrew publish | #16, #17 + draft ADR-004 | hassfest 54/54 strict-typing/inject-websession, Homebrew repo.webosbrew.org ipkHash pinning + Block OTA, ADR-004 one-OTA fragile |

Plus drafts: Docs ROADMAP.md 12 headings 5737w, ADR-003 transport hybrid, ADR-004 one-OTA fragile.

## Custom fields — IDs and population

All 17 items now populated via `gh project item-edit` with field IDs:

- `PVTSSF_lAHOAEOuI84BhtGTzhgn3rc` **Phase** 0–5 (`290e7208` 0, `e36f1a7b` 1, `70799059` 2, `ba866daf` 3, `05a2b426` 4, `52a01016` 5)
- `PVTSSF_lAHOAEOuI84BhtGTzhgn3rg` **ACL Tier** Tier A stock `c2992272`, Tier B requiredPermissions `07ca1979`, Tier C root-only `5543d4fb` — colour from §2 matrix
- `PVTSSF_lAHOAEOuI84BhtGTzhgn3rk` **Effort** S `ae78e8e9`, M `70b1f4ae`, L `bb6bef33`, XL `efc34914`
- `PVTSSF_lAHOAEOuI84BhtGTzhgn3ro` **Priority** P0 — Must `799518e7`, P1 — Should `c9ff30b0`, P2 — Could `17227a7f`
- `PVTSSF_lAHOAEOuI84BhtGTzhgn3mA` **Status** Todo `f75ad846`, In Progress `47fc9ee4`, Done `98236657`

### Field value map (17 items)

| Item | Phase | ACL Tier | Effort | Priority | Status |
|---|---|---|---|---|---|
| #4 ADR-001 | 0 — Ground truth | C root-only | M | P0 — Must | Done |
| #5 ADR-002 | 0 — Ground truth | B requiredPermissions | M | P0 — Must | Done |
| #6 research handoff | 0 — Ground truth | A stock | S | P0 — Must | Done |
| #7 cascade SSDP→WS | 1 — Detect+Install (HA) | C root-only | M | P0 — Must | In Progress |
| #8 HB/dev-install | 1 — Detect+Install (HA) | C root-only | L | P0 — Must | In Progress |
| #9 sister second-mode | 1 — Detect+Install (HA) | B requiredPermissions | L | P0 — Must | In Progress |
| #10 JS+ActivityManager | 2 — JS+ActivityManager | B requiredPermissions | M | P0 — Must | Todo |
| #11 CEC hub | 2 — JS+ActivityManager | C root-only | M | P1 — Should | Todo |
| #12 unicapture native | 3 — Ambient flagship | C root-only | XL | P0 — Must | Todo |
| #13 camera ambient_lux | 3 — Ambient flagship | C root-only | L | P0 — Must | Todo |
| #14 Enact dashboard | 4 — Enact+Voice | B requiredPermissions | L | P1 — Should | Todo |
| #15 Wyoming voice | 4 — Enact+Voice | C root-only | XL | P2 — Could | Todo |
| #16 hassfest Platinum | 5 — Platinum | A stock | L | P0 — Must | Todo |
| #17 Homebrew publish | 5 — Platinum | C root-only | M | P0 — Must | Todo |
| Draft Docs ROADMAP | 0 — Ground truth | A stock | S | P0 — Must | Done |
| Draft ADR-003 transport | 2 — JS+ActivityManager | A stock | M | P1 — Should | Todo |
| Draft ADR-004 one-OTA | 5 — Platinum | C root-only | S | P0 — Must | Todo |

Milestone field `PVTF_lAHOAEOuI84BhtGTzhgn3mM` mirrors GitHub issue milestone; Linked pull requests `PVTF_lAHOAEOuI84BhtGTzhgn3mI` auto-populates on PR.

## Views — 4 layouts

| View | Layout | Grouping | ID |
|---|---|---|---|
| View 1 | TABLE_LAYOUT | — | PVTV_lAHOAEOuI84BhtGTzgLdNAo |
| Board — Status | BOARD_LAYOUT | **Status** Todo / In Progress / Done | PVTV_lAHOAEOuI84BhtGTzgLdNfM |
| Board — Phase 0–5 | BOARD_LAYOUT | **Phase** 0–5 lanes | PVTV_lAHOAEOuI84BhtGTzgLdNfg |
| Roadmap — Milestone | ROADMAP_LAYOUT | Milestone timeline | PVTV_lAHOAEOuI84BhtGTzgLdNfQ |

Created via GraphQL `createProjectV2View` with `BOARD_LAYOUT` and `ROADMAP_LAYOUT`. Group-by configuration is not exposed in public GraphQL `updateProjectV2View` (`configuration` only exposes `visibleFieldIds`); boards therefore default to Status grouping and require manual UI configuration for Phase grouping:

**Manual steps if grouping not auto-applied:**
1. Open https://github.com/users/belikh/projects/1 → `Board — Status` → `...` → `Group by` → `Status` (Todo/In Progress/Done).
2. `Board — Phase 0–5` → `Group by` → `Phase` (0–5 lanes).
3. `Roadmap — Milestone` → `Group by` → `Milestone` or set `Date field` to `Milestone` iteration if roadmap dates required.

TABLE_LAYOUT remains augmented as default view.

### Branch protection

`main` protected: `required_conversation_resolution true`, `required_approving_review_count 1`, `allow_force false`, `linear false`, `enforce_admins false`, `workflow default read can_approve false`. Verified via `gh api repos/belikh/lgtv-webos-homeassistant/branches/main/protection`.

### Optional 32-row matrix traceability

§2 matrix rows #1–32 could be added as 32 draft issues coloured by ACL tier for 1:1 traceability, but this would duplicate the 5-phase grouped issues and bloat the board (17 → 49 items) without adding execution value. Decision: **not added**. Trade-off documented; if max traceability is later required, create drafts with labels `matrix:1…32` and set ACL Tier per row colour and Phase per §11 grouping, then link each to its parent phase issue via `Parent issue` field.

## Sister repo

Second-mode issue mirrored to https://github.com/belikh/ha-lg-webos-tv/issues/10 — close that issue when ha_chros73_bscpylgtv PR passes ruff+mypy 340 + hassfest 54/54.

## Verify

```
hpr run verify lgtv-webos-ha-root-1a89ff -j  # passed — 5737w, citation-density 1.66
gh project view 1 --owner belikh | head
gh project field-list 1 --owner belikh
gh project item-list 1 --owner belikh --limit 20
gh api repos/belikh/lgtv-webos-homeassistant/branches/main/protection --jq .
```

Artifacts: `/tmp/opencode/populate.log`, `/tmp/opencode/populate_remaining.log`, `docs/PROJECT_BOARD.md`, vault `research/notes/final_report_lgtv-webos-ha-root-1a89ff.md`.

