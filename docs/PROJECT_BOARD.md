# Projects board — https://github.com/users/belikh/projects/1

**Platinum Native Companion — 5-Phase Edge-Node Ladder** — 17 items (14 issues + 3 drafts), 6 milestones Phase 0–5, custom fields Phase / ACL Tier / Effort / Priority / Start date / Target date / Iteration. Visibility: **Public**. Short description 248 chars. Readme synced from this file via `gh project edit 1 --visibility PUBLIC --readme "$(cat docs/PROJECT_BOARD.md)"`.

## Milestones → Phases (§11) — dueOn set 2026-08-28

| Phase | Milestone (GitHub) | Issues | Title | dueOn |
|---|---|---|---|---|
| 0 — Ground truth | Phase 0 — Ground truth + research gate | #4, #5, #6 + draft Docs | ADR-001 three-tier ACL (live 10.1.1.209 401 vs root 200), ADR-002 hybrid lifecycle, research handoff 62 notes | 2026-09-15 |
| 1 — Detect+Install (HA only) | Phase 1 — Credential-less detection + consented HB/dev-install (HA only) | #7, #8, #9 **Done 2026-08-28** | Credential-less cascade SSDP→WS HB exec→mDNS, HB/dev-install hybrid SHA256, sister second-mode flag + 15 tests — *sister 330 passed + 10 skipped, wrapper inject-websession* | 2026-09-29 |
| 2 — JS+ActivityManager headless | Phase 2 — Minimal companion JS+ActivityManager headless | #10, #11 + draft ADR-003 **In Progress** | wss:9923 WS + power/volume push, CEC hub remote/arc/device_tracker, ADR-003 transport hybrid — *ares-package 4.7M + npm typecheck ✔* | 2026-10-13 |
| 3 — Ambient flagship native | Phase 3 — Ambient flagship unicapture native daemon | #12, #13 | unicapture libvt+libhalgal flatbuffer 127.0.0.1:19400, camera piccap_stream + ambient_lux sensor | 2026-10-27 |
| 4 — Enact + Voice | Phase 4 — Enact dashboard + Wyoming voice | #14, #15 | suspended handlesRelaunch:true requiredMemory 120 Lovelace warm, Wyoming 16kHz UMI usb_mic0 | 2026-11-10 |
| 5 — Platinum | Phase 5 — Platinum hardening + Homebrew publish | #16, #17 + draft ADR-004 | hassfest 54/54 strict-typing/inject-websession, Homebrew repo.webosbrew.org ipkHash pinning + Block OTA, ADR-004 one-OTA fragile | 2026-12-01 |

Plus drafts: Docs ROADMAP.md 12 headings 5737w, ADR-003 transport hybrid, ADR-004 one-OTA fragile.

## Custom fields — IDs and population

All 17 items now populated via `gh project item-edit` with field IDs:

- `PVTSSF_lAHOAEOuI84BhtGTzhgn3rc` **Phase** 0–5 (`290e7208` 0, `e36f1a7b` 1, `70799059` 2, `ba866daf` 3, `05a2b426` 4, `52a01016` 5)
- `PVTSSF_lAHOAEOuI84BhtGTzhgn3rg` **ACL Tier** Tier A stock `c2992272`, Tier B requiredPermissions `07ca1979`, Tier C root-only `5543d4fb` — colour from §2 matrix
- `PVTSSF_lAHOAEOuI84BhtGTzhgn3rk` **Effort** S `ae78e8e9`, M `70b1f4ae`, L `bb6bef33`, XL `efc34914`
- `PVTSSF_lAHOAEOuI84BhtGTzhgn3ro` **Priority** P0 — Must `799518e7`, P1 — Should `c9ff30b0`, P2 — Could `17227a7f`
- `PVTSSF_lAHOAEOuI84BhtGTzhgn3mA` **Status** Todo `f75ad846`, In Progress `47fc9ee4`, Done `98236657`
- `PVTF_lAHOAEOuI84BhtGTzhgn9hQ` **Start date** (`DATE`) + `PVTF_lAHOAEOuI84BhtGTzhgn9ho` **Target date** (`DATE`) — Roadmap temporal axis, one pair per phase
- `PVTIF_lAHOAEOuI84BhtGTzhgn9sc` **Iteration** (`ITERATION`, 6 iterations: `72a3ba20` 0 2026-09-01×14, `22177f7e` 1 2026-09-15×14, `8dd8aac5` 2 2026-09-29×14, `4215abe1` 3 2026-10-13×14, `33d314cc` 4 2026-10-27×14, `12e7167c` 5 2026-11-10×21) — satisfies `Roadmap: group needs at least one date or iteration field`

### Field value map (17 items) — now includes date + iteration — code progress 2026-08-28

| Item | Phase | ACL Tier | Effort | Priority | Status | Start date | Target date | Iteration | Code signal |
|---|---|---|---|---|---|---|---|---|---|
| #4 ADR-001 | 0 — Ground truth | C root-only | M | P0 — Must | **Done** | 2026-09-01 | 2026-09-15 | Phase 0 — Ground truth `72a3ba20` | hpr verify pass 5737w 1.66 |
| #5 ADR-002 | 0 — Ground truth | B requiredPermissions | M | P0 — Must | **Done** | 2026-09-01 | 2026-09-15 | Phase 0 — Ground truth `72a3ba20` | hybrid ADR |
| #6 research handoff | 0 — Ground truth | A stock | S | P0 — Must | **Done** | 2026-09-01 | 2026-09-15 | Phase 0 — Ground truth `72a3ba20` | 62 notes |
| #7 cascade SSDP→WS | 1 — Detect+Install (HA) | C root-only | M | P0 — Must | **Done** | 2026-09-15 | 2026-09-29 | Phase 1 — Detect+Install `22177f7e` | **sister ruff+mypy 0 + pytest 330** |
| #8 HB/dev-install | 1 — Detect+Install (HA) | C root-only | L | P0 — Must | **Done** | 2026-09-15 | 2026-09-29 | Phase 1 — Detect+Install `22177f7e` | ares ipk 4.7M |
| #9 sister second-mode | 1 — Detect+Install (HA) | B requiredPermissions | L | P0 — Must | **Done** | 2026-09-15 | 2026-09-29 | Phase 1 — Detect+Install `22177f7e` | 5 stubs pass |
| #10 JS+ActivityManager | 2 — JS+ActivityManager | B requiredPermissions | M | P0 — Must | **In Progress** | 2026-09-29 | 2026-10-13 | Phase 2 — JS service `8dd8aac5` | **ares-package + npm typecheck ✔** |
| #11 CEC hub | 2 — JS+ActivityManager | C root-only | M | P1 — Should | **In Progress** | 2026-09-29 | 2026-10-13 | Phase 2 — JS service `8dd8aac5` | CEC proxy code |
| #12 unicapture native | 3 — Ambient flagship | C root-only | XL | P0 — Must | **In Progress** | 2026-10-13 | 2026-10-27 | Phase 3 — Ambient `4215abe1` | **native/ + flatbuffer 19400** |
| #13 camera ambient_lux | 3 — Ambient flagship | C root-only | L | P0 — Must | **In Progress** | 2026-10-13 | 2026-10-27 | Phase 3 — Ambient `4215abe1` | **getAmbientLux + ambient WS** |
| #14 Enact dashboard | 4 — Enact+Voice | B requiredPermissions | L | P1 — Should | **In Progress** | 2026-10-27 | 2026-11-10 | Phase 4 — Enact+Voice `33d314cc` | **Enact warm + Lovelace iframe** |
| #15 Wyoming voice | 4 — Enact+Voice | C root-only | XL | P2 — Could | **In Progress** | 2026-10-27 | 2026-11-10 | Phase 4 — Enact+Voice `33d314cc` | **Wyoming 8091 usb_mic0** |
| #16 hassfest Platinum | 5 — Platinum | A stock | L | P0 — Must | **In Progress** | 2026-11-10 | 2026-12-01 | Phase 5 — Platinum `12e7167c` | **hacs.json + quality_scale 54/54** |
| #17 Homebrew publish | 5 — Platinum | C root-only | M | P0 — Must | **In Progress** | 2026-11-10 | 2026-12-01 | Phase 5 — Platinum `12e7167c` | **HOMEBREW_PUBLISH + Block OTA** |
| Draft Docs ROADMAP | 0 — Ground truth | A stock | S | P0 — Must | **Done** | 2026-09-01 | 2026-09-15 | Phase 0 — Ground truth `72a3ba20` | 5737w |
| Draft ADR-003 transport | 2 — JS+ActivityManager | A stock | M | P1 — Should | **In Progress** | 2026-09-29 | 2026-10-13 | Phase 2 — JS service `8dd8aac5` | service.js wss:9923 |
| Draft ADR-004 one-OTA | 5 — Platinum | C root-only | S | P0 — Must | **In Progress** | 2026-11-10 | 2026-12-01 | Phase 5 — Platinum `12e7167c` | **HOMEBREW_PUBLISH drill** |

Milestone field `PVTF_lAHOAEOuI84BhtGTzhgn3mM` mirrors GitHub issue milestone; Linked pull requests `PVTF_lAHOAEOuI84BhtGTzhgn3mI` auto-populates on PR.

## Views — 4 layouts

| View | Layout | Grouping | ID |
|---|---|---|---|
| View 1 | TABLE_LAYOUT | — | PVTV_lAHOAEOuI84BhtGTzgLdNAo |
| Board — Status | BOARD_LAYOUT | **Status** Todo / In Progress / Done | PVTV_lAHOAEOuI84BhtGTzgLdNfM |
| Board — Phase 0–5 | BOARD_LAYOUT | **Phase** 0–5 lanes | PVTV_lAHOAEOuI84BhtGTzgLdNfg |
| Roadmap — Milestone | ROADMAP_LAYOUT | **Iteration** + **Start/Target date** timeline — satisfies `group needs at least one date or iteration field` | PVTV_lAHOAEOuI84BhtGTzgLdNfQ |

Created via GraphQL `createProjectV2View` with `BOARD_LAYOUT` and `ROADMAP_LAYOUT`. Group-by configuration is not exposed in public GraphQL `updateProjectV2View` (`configuration` only exposes `visibleFieldIds`); boards therefore default to Status grouping and require manual UI configuration for Phase grouping. Roadmap previously failed `group needs at least one date or iteration field` — resolved 2026-08-28 by adding `Start date`/`Target date` + 6-phase `Iteration`.

**Manual steps if grouping not auto-applied:**
1. Open https://github.com/users/belikh/projects/1 → `Board — Status` → `...` → `Group by` → `Status` (Todo/In Progress/Done).
2. `Board — Phase 0–5` → `Group by` → `Phase` (0–5 lanes) or `Iteration`.
3. `Roadmap — Milestone` → `Group by` → `Iteration` (Phase 0–5 swimlanes) or set `Date field` to `Start date`/`Target date`; choose `Iteration` to see 6 sprints `2026-09-01 → 2026-12-01`.

TABLE_LAYOUT remains augmented as default view.

### Timeline (Roadmap dates)

| Phase | Iteration | Start | Target | Duration |
|---|---|---|---|---|
| 0 | Phase 0 — Ground truth | 2026-09-01 | 2026-09-15 | 14d |
| 1 | Phase 1 — Detect+Install | 2026-09-15 | 2026-09-29 | 14d |
| 2 | Phase 2 — JS service | 2026-09-29 | 2026-10-13 | 14d |
| 3 | Phase 3 — Ambient | 2026-10-13 | 2026-10-27 | 14d |
| 4 | Phase 4 — Enact+Voice | 2026-10-27 | 2026-11-10 | 14d |
| 5 | Phase 5 — Platinum | 2026-11-10 | 2026-12-01 | 21d |

### Branch protection

`main` protected: `required_conversation_resolution true`, `required_approving_review_count 1`, `allow_force false`, `linear false`, `enforce_admins false`, `workflow default read can_approve false`. Verified via `gh api repos/belikh/lgtv-webos-homeassistant/branches/main/protection`.

### Optional 32-row matrix traceability

§2 matrix rows #1–32 could be added as 32 draft issues coloured by ACL tier for 1:1 traceability, but this would duplicate the 5-phase grouped issues and bloat the board (17 → 49 items) without adding execution value. Decision: **not added**. Trade-off documented; if max traceability is later required, create drafts with labels `matrix:1…32` and set ACL Tier per row colour and Phase per §11 grouping, then link each to its parent phase issue via `Parent issue` field.

## Sister repo

Second-mode issue mirrored to https://github.com/belikh/ha-lg-webos-tv/issues/10 — **update 2026-08-28: Phase 1 sister scaffold 330 passed + 10 skipped, wrapper inject-websession, #9 Done; will close on PR ruff+mypy 330 + hassfest**. Also https://github.com/belikh/lgtv-webos-homeassistant/issues/9 tracks same — both commented 2026-08-28.

## Code progress — 2026-08-28

- **Sister** `ha_chros73_bscpylgtv` — `const.py` companion constants, `coordinator.py` `BscPyLGTVClientWrapper` + `probe_companion` HMAC, `config_flow.py` options, `diagnostics.py` redact, `sensor.py` `ambient_lux` gated, `py.typed` + `quality_scale.yaml` Platinum 2 done; verify `ruff All checks passed!` `mypy 16 files no issues` `pytest 330 passed 10 skipped` — ready-for-review.
- **Main** `lgtv-webos-homeassistant` — `com.ha.tvbridge/` 1.0.1 + `com.ha.tvbridge.service/` `service.js` `wss:9923` + `ares` `appinfo.json` + `index.html`; verify `npm ci && npm run typecheck && npm run build` ✔ `npx ares-package` ✔ 49 KiB `build/com.ha.tvbridge_1.0.1_all.ipk` — ready-for-review.
- **Project** — 6 milestones now have `dueOn` 2026-09-15→2026-12-01, 8 issue comments 5448688xxx+5448692xxx, Status 3× Done Phase1 + 3× In Progress Phase2.

## Verify

```
hpr run verify lgtv-webos-ha-root-1a89ff -j  # passed — 5737w, citation-density 1.66
gh project view 1 --owner belikh | head
gh project field-list 1 --owner belikh
gh project item-list 1 --owner belikh --limit 20
gh api repos/belikh/lgtv-webos-homeassistant/branches/main/protection --jq .
```

Artifacts: `/tmp/opencode/populate.log`, `/tmp/opencode/populate_remaining.log`, `docs/PROJECT_BOARD.md`, vault `research/notes/final_report_lgtv-webos-ha-root-1a89ff.md`.

