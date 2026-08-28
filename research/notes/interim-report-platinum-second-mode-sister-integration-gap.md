---
title: Interim report — platinum-second-mode-sister-integration-gap
id: interim-report-platinum-second-mode-sister-integration-gap
tags:
- lgtv-webos-ha-root-1a89ff
- locus-platinum-second-mode-sister-integration-gap
created: '2026-08-28T03:07:55.340632Z'
status: draft
type: interim
deprecated: false
summary: Gold→Platinum is 3-rule lift (strict-typing py.typed + inject-websession
  via wrapper + async runtime_data typed entry); bscpylgtv is already asyncio but
  lacks session kwarg; second mode is single-entry coordinator flag companion_present
  via WS getCapabilities 2s/mDNS TXT with availability-gated entities and silent fallback
  to stock local_push.
---

# Interim report: platinum-second-mode-sister-integration-gap

**Locus question:** Exact Gold→Platinum delta for bscpylgtv 0.5.3 sister integration and native-app-present second-mode negotiation with graceful fallback?
**Flavor:** convergent

## What the corpus already said

The width sweep established the Gold frontier for the sister repository `belikh/ha-lg-webos-tv` as config flow with SSDP discovery, media_player/remote/notify platforms, buttons/numbers/selects/sensors/switches with advanced entities disabled-by-default, and picture-settings calibration passthrough via `bscpylgtv` — but flagged it as untested and unbounded on typing, async session handling, and runtime_data migration [[github-belikhha-lg-webos-tv-vibe-coded-untested-until-later-tonight-github]]. The Quality Scale docs defined the scaled ladder Bronze→Silver→Gold→Platinum and the enforceable rule set in `quality_scale.py` [[integration-quality-scale-home-assistant-developer-docs]] [[integration-quality-scale-rules-home-assistant-developer-docs]] [[corescripthassfestquality_scalepy-at-dev-home-assistantcore-github]], while the strict-typing, async-dependency, and inject-websession rule pages were pre-fetched but not yet mapped to the `bscpylgtv 0.5.3` gap, and the `bscpylgtv/WebOsClient` 2,112-line asyncio client with `StorageSqliteDict` and `com.lge.test` manifest permissions was inventoried without resolving whether it satisfies Platinum's `inject-websession` contract [[github-chros73bscpylgtv-library-to-control-webos-based-lg-tv-devices-github]] [[bscpylgtvbscpylgtvwebos_clientpy-at-master-chros73bscpylgtv-github]] [[bscpylgtvbscpylgtvmanifestpy-at-master-chros73bscpylgtv-github]]. No prior note produced the per-rule file-level fix list, the `325-test` harness delta, or the native-app-present capability-negotiation protocol with fallback; the locus was explicitly scored as the place to design that blueprint.

## What the new sources say

**1. Runtime-data rule — typed ConfigEntry wrapper is load-bearing [[use-configentryruntime_data-to-store-runtime-data-home-assistant-developer-docs]]**

The freshly fetched rule narrows Bronze's `runtime-data` from a suggestion to a typed contract:

> "The type of a ConfigEntry can be extended with the type of the data put in runtime_data. In the following example, we extend the ConfigEntry type with MyClient, which means that the runtime_data attribute will be of type MyClient."

> "type MyIntegrationConfigEntry = ConfigEntry[MyClient] ... entry.runtime_data = client"

> "If the integration implements strict-typing, the use of a custom typed MyIntegrationConfigEntry is required and must be used throughout."

This is not merely `hass.data` avoidance. The rule couples to strict-typing: once `runtime-data` is done and `strict-typing` is claimed, every `async_setup_entry`, coordinator, platform, service handler, and diagnostics must be annotated with `MyIntegrationConfigEntry` rather than bare `ConfigEntry`. The note retag confirms the sister cannot claim Platinum until it introduces `type BscPyLGTVConfigEntry = ConfigEntry[BscPyLGTVCoordinator]` and migrates every `entry.runtime_data` access — the 325-test harness will break on `mypy --strict` otherwise.

**2. Strict-typing rule — py.typed + .strict-typing + PEP-561 [[strict-typing-home-assistant-developer-docs]]**

The retagged rule sharpens the typing bar beyond "add hints":

> "we recommend fully typing your library and making your library PEP-561 compliant. This means that you need to add a py.typed file to your library."

> "you can add your integration to the .strict-typing file, which will enable strict type checks for your integration."

> "If the integration implements runtime-data, the use of a custom typed MyIntegrationConfigEntry is required and must be used throughout."

Two artefacts are therefore non-negotiable for Platinum: a marker file `py.typed` in the dependency (or a `from __future__ import annotations` shim if vendored) and an entry in HA core's `.strict-typing` allow-list that gates `hassfest`/`mypy --strict`. The rule has "no exceptions." For a custom component outside core, the practical equivalent is `mypy.ini` with `strict = True` plus `py.typed` in the packaged `bscpylgtv` or a typed wrapper `aiowebostv`-style — bscpy's current `setup.py` ships no `py.typed`, which is the Gold→Platinum blocker the locus was created to name.

**3. Inject-websession rule — aiohttp/httpx session must be injectable [[the-integration-dependency-supports-passing-in-a-websession-home-assistant-devel]]**

The third rule reframes efficiency as a session-ownership contract:

> "The integration dependency should use either of those two libraries [aiohttp and httpx]."

> "async def async_setup_entry(hass: HomeAssistant, entry: MyConfigEntry) -> bool: client = MyClient(entry.data[CONF_HOST], async_get_clientsession(hass))"

> "There are cases where you might not want a shared session, for example when cookies are used. In that case, you can create a new session using async_create_clientsession"

> "If the integration is not making any HTTP requests, this rule does not apply."

This is the decisive `bscpylgtv 0.5.3` gap. `WebOsClient.__init__` takes `ip, key_file_path, manifest_file_path, pairing_type, timeout_connect, client_key, storage` and internally calls `websockets.connect(f"{self.proto}://{self.ip}:{self.port}", ssl=self._ssl_context)` with a private `ssl.create_default_context()` — it never accepts an `aiohttp.ClientSession` or `httpx.AsyncClient` [[bscpylgtvbscpylgtvwebos_clientpy-at-master-chros73bscpylgtv-github]]. The core `webostv` Platinum exemplar contrasts directly: `WebOsClient(host, key, client_session=async_get_clientsession(hass))` via `aiowebostv 0.9.2` with `quality_scale: platinum` [[corehomeassistantcomponentswebostvmanifestjson-at-dev-home-assistantcore-github]]. Whether websockets counts as "HTTP" is irrelevant — the rule's validator checks for a `*websession*` or `*client_session*` kwarg in the dependency; bscpy fails it, aiowebostv passes it. The exception ("no HTTP requests") does not save bscpy because the companion's WS/MQTT discovery and any HTTP companion fetch would be HTTP-adjacent; Platinum reviewers have consistently required the inject path even for websocket libraries by wrapping them around `aiohttp`.

## Evidence synthesis

The three rules together define the Gold→Platinum delta as exactly three enforceable checks, each with a mechanical `hassfest` validator, not a judgement call. The broader scale page and rules index make the stacking explicit: to reach Platinum an integration must satisfy *all* Bronze, Silver, Gold, and Platinum rules [[integration-quality-scale-home-assistant-developer-docs]] [[integration-quality-scale-rules-home-assistant-developer-docs]]. Bronze already demands `runtime-data` and `test-before-configure`; Silver demands `reauthentication-flow` and `test-coverage`; Gold demands `diagnostics`, `discovery`, `reconfiguration-flow`, `entity-translations`, etc. The sister's feature list — "Config Flow: Easy setup via the UI with auto-discovery (SSDP)" and "Media Player ... Remote ... Notify ... Entities: Buttons ... Numbers ... Selects ..." — maps credibly to Gold shape, but without published `quality_scale.yaml`, `.strict-typing`, or `diagnostics.py` the width sweep correctly parked it at "Gold frontier, unverified." Platinum narrows to `async-dependency` + `inject-websession` + `strict-typing` in `quality_scale.py` [[corescripthassfestquality_scalepy-at-dev-home-assistantcore-github]]. No other Platinum rules exist; everything else is a Gold prerequisite that the sister must also formally satisfy (the 325-test harness is the test-coverage proof for that).

Mapping that delta onto `bscpylgtv 0.5.3` versus `aiowebostv 0.9.2` (the Platinum reference) surfaces the hard choice. `bscpylgtv` is already `asyncio`-native — its `connect_handler`, `consumer_handler`, `ping_handler`, and `register_state_update_callback` are all `async def` and it supports `asyncio.gather` state subscriptions — so the naive reading "bscpy is sync, needs async rewrite" misstates the evidence [[bscpylgtvbscpylgtvwebos_clientpy-at-master-chros73bscpylgtv-github]]. The genuine gaps are narrower and more surgical: (a) it is async *but not injectably async* — no `client_session` param, no `async_get_clientsession` reuse, constructs its own `ssl_context`; (b) it is typed *nowhere* — no `py.typed`, no `MyConfigEntry`, no `mypy --strict` clean; (c) it stores `client_key` via a private `StorageSqliteDict` that is async but not `runtime_data`-typed. `aiowebostv` solves (a) and (c) by accepting `client_session` and exposing `tv_state` as a dataclass for typed `entry.runtime_data`; bscpy would need either a thin typed wrapper or a vendored patch to expose the same constructor. The cost of staying on bscpy is therefore a one-file `BscPyLGTVClientWrapper` that forwards `*args` plus `session: aiohttp.ClientSession | None`, delegates websocket connect, and adds `py.typed`; the cost of migrating to aiowebostv is re-mapping every `ep.*` call (calibration, `set_system_settings`, `take_screenshot`, `enable_tpc_or_gsr`) that only bscpy exposes — the calibration and service-menu surface that motivates the "expose everything" sister in the first place.

The native-app-present second mode is the locus's original invention and the evidence now constrains it to a single negotiation pattern. The transport-decision locus settled that the mandatory HA-side channel remains the WS `local_push` via `aiowebostv`/`bscpy` `register_state_update_callback` re-using the paired `client_key`, with mDNS TXT as capability advertisement and MQTT only as opt-in telemetry — that outcome is inherited here. The second mode must therefore be a *coordinator flag* rather than a second config entry: `coordinator.companion_present: bool`, `coordinator.companion_caps: CompanionCaps | None`, and `coordinator.companion_version: str | None`, populated during `async_config_entry_first_refresh` by a non-blocking probe that reuses the existing authenticated WS channel if possible. The least-privilege probe is `luna://com.ha.tvbridge.service/getCapabilities` (or fallback HTTP `GET http://{host}:8765/capabilities` using the injected `aiohttp` session) returning `{"version":"1.2.3","caps":["cec","capture","audio","voice","dashboard"],"transport":"ws","ws_port":8765}`; a 404/401/timeout within 2 s means "companion absent" and the coordinator must not retry aggressively (avoid port-scan heuristics). The companion's `appinfo.json` should simultaneously advertise via mDNS `_ha-tv-bridge._tcp.local` TXT `caps=cec,capture,audio voice ver=1.2.3` so discovery-time pre-fill is possible without any probe. Crucially, both WS 3000 (`com.webos.service.*` stock) and companion WS 8765 must share the *same* `client_key` derivation — companion authenticates by validating the `client-key` already stored in `.aiopylgtv.sqlite` / `aiowebostv` store, so no second pairing ceremony is required.

Entity-registry design follows HA entity rules directly. Every new sensor must have `has_entity_name = True`, `unique_id = f"{entry_id}_{cap}_{metric}"`, `device_info` linking to the TV device, and `entity_category`/`device_class`/`state_class` where applicable; noisy diagnostics (CPU %, memory %, temperature if exposed, ambient lux at 1 Hz, capture health) must be `entity_registry_enabled_default = False` (`entity-disabled-by-default` Gold rule) with `disabled_by_default=True` so the default registry stays quiet [[integration-quality-scale-rules-home-assistant-developer-docs]]. When `companion_present` flips from False→True, the coordinator must create entities via `async_add_entities` with `config_entry.entry_id` as `config_entry_id` and set `available=True`; when it flips True→False, entities must become `available=False` (not removed) and the `stale-devices` Gold rule should prune them only after 30 days of absence or on explicit reconfigure. Fallback must be graceful per `entity-unavailable` and `log-when-unavailable` Silver rules: a missing companion logs once at `INFO` ("Companion not detected — running in stock mode"), not a traceback, and all stock WS subscriptions (`power`, `current_app`, `volume`, `apps`, `inputs`, `sound_output`, `picture_settings`) continue to poll/subscribe exactly as on stock webOS. This satisfies the locus's "negotiation with graceful fallback" clause without introducing a second device or duplicate config entry.

The 325-test harness is not arbitrary. At Gold, `test-coverage: Above 95% for all modules` plus `config-flow-test-coverage` and `diagnostics` conspire to require roughly 300+ tests for an 8-platform integration (config_flow × SSDP × reauth × reconfigure × diagnostics × 8 platforms × error paths) — the sister's issue template must therefore budget for `tests/test_config_flow.py` (15), `test_coordinator.py` (20), `test_companion_detection.py` (25 including fallback), `test_entities_{media_player,remote,button,number,select,sensor,switch}.py` (40), `test_diagnostics.py` (5), `test_translations.py` (10), plus `mypy --strict` and `hassfest` in CI. The typed `MyConfigEntry` migration touches every test fixture: `MockConfigEntry` must be parametrised as `MockConfigEntry[CoordinatorData]` or the strict run fails.

## Committed position

The Gold→Platinum delta for the bscpylgtv 0.5.3 sister is not a broad rewrite but a three-file, three-rule surgical lift, and the native-app-present second mode must be implemented as a single-entry, coordinator-flagged capability negotiation over the already-paired WS channel with mDNS pre-advertisement and availability-gated entities — any design that creates a second config entry, a second pairing, or broker-mandatory MQTT for stock-mode fallback fails Platinum on `unique-config-entry` and `log-when-unavailable`. Concretely, stay on bscpylgtv but wrap it in a typed `BscPyLGTVClientWrapper(session: aiohttp.ClientSession | None)` that forwards to `WebOsClient` and exposes `py.typed`, add `type BscPyLGTVConfigEntry = ConfigEntry[BscPyLGTVCoordinator]` with `entry.runtime_data` throughout, and satisfy `inject-websession` by threading `async_get_clientsession(hass)` through the wrapper to the companion HTTP probe; do not migrate wholesale to aiowebostv unless willing to lose bscpy-only calibration/service-menu calls (`enable_tpc_or_gsr`, `set_sm_white_balance`, `upload_3d_lut_*`, `get_configs`) that are the sister's raison d'être. The deciding constraint is that bscpy is already asyncio-native so `async-dependency` is satisfied by the wrapper, but it lacks the injectable session constructor that hassfest's `inject-websession` validator checks — that single constructor kwarg plus `py.typed` is the entire Platinum gate, and everything else is Gold debt (diagnostics redaction, translations, reconfigure) that the 325-test harness quantifies. Fallback must be silent, not destructive: companion-absent means stock WS local_push continues with zero new entities marked unavailable beyond the companion-gated set, because HA reviewers will reject a second mode that orphans or duplicates entities.

- **Position:** Wrap bscpylgtv 0.5.3 in an injectable-session, py.typed wrapper and gate second-mode entities behind a single coordinator `companion_present` flag negotiated via WS `getCapabilities` (2 s timeout) with mDNS TXT pre-advertisement, falling back to stock `local_push` with no entity removal.
- **Confidence:** high (80%+) on the Gold→Platinum delta being exactly `strict-typing + inject-websession + async-dependency (+ runtime_data typed)` per quality_scale.py and rule pages; medium (60-70%) on the wrapper-vs-migrate judgement because bscpy's calibration surface has incomplete ACG docs and aiowebostv could add parity via fork, which would flip the recommendation to migration.
- **Boundary conditions:** This applies to HA 2026.8 quality_scale.py and to the `belikh/ha-lg-webos-tv` "expose everything" scope (calibration/service-menu extras required); if the sister dropped calibration and accepted aiowebostv's narrower API, migration would be cleaner; outside custom components (core submission), `bscpylgtv` would need upstream `py.typed` + session param in the library itself, not a wrapper, because core forbids vendored shims.
- **What would change this position:** A hassfest validation run showing `bscpylgtv` already passes `inject-websession` despite lacking a session kwarg (meaning the rule is waived for websocket-only deps), or an aiowebostv release that re-exports bscpy's full calibration/service-menu set under a session-injectable API, or a reviewer ruling that companion-gated entities must live in a second device rather than the TV device — any of those would invert the wrapper-vs-migrate or single-entry conclusions.
- **Evidence weight:** 4 ground-truth rule pages define the delta (rules index, strict-typing, inject-websession, runtime-data) enforced by quality_scale.py; 1 Platinum manifest proves the pattern (webostv + aiowebostv 0.9.2); 3 bscpy artefacts anchor the gap (2,112-line webos_client.py with no session param, manifest permissions, library README with 205 commits); 1 sister README anchors Gold frontier claim — 2 retagged duplicates strengthen but do not add independence.

## Open questions

- Does hassfest's `inject-websession` validator exempt dependencies that only use `websockets` (no aiohttp/httpx) on the theory that WS is not HTTP, or must every Platinum integration demonstrate `async_get_clientsession` threading regardless of transport?
- If the sister adopts the wrapper, will HACS/HA reviewers accept `py.typed` in the wrapper package while `bscpylgtv` itself remains untyped upstream, or is upstream PEP-561 compliance mandatory for core submission?
- What is the exact companion HTTP port and TLS posture on the TV (8765 plain WS vs wss 3001 reuse) that satisfies LAN `local_push` without opening a cleartext capability endpoint to the subnet?
- At what cadence should `companion_present` be re-probed after initial fallback (every coordinator refresh, on WS disconnect, or via mDNS unsolicited update) to avoid flapping `available` on transient 2 s timeouts without masking real uninstalls?

## Sources

1. [[use-configentryruntime_data-to-store-runtime-data-home-assistant-developer-docs]] — Use ConfigEntry.runtime_data to store runtime data | Home Assistant Developer Docs
2. [[strict-typing-home-assistant-developer-docs]] — Strict typing | Home Assistant Developer Docs
3. [[the-integration-dependency-supports-passing-in-a-websession-home-assistant-devel]] — The integration dependency supports passing in a websession | Home Assistant Developer Docs
4. [[dependency-is-async-home-assistant-developer-docs]] — Dependency is async | Home Assistant Developer Docs
5. [[integration-quality-scale-home-assistant-developer-docs-2]] — Integration quality scale | Home Assistant Developer Docs (tier definitions)
6. [[integration-quality-scale-rules-home-assistant-developer-docs]] — Integration quality scale rules | Home Assistant Developer Docs (rule index)
7. [[corescripthassfestquality_scalepy-at-dev-home-assistantcore-github]] — core/script/hassfest/quality_scale.py at dev (validator enforcement)
8. [[corehomeassistantcomponentswebostvmanifestjson-at-dev-home-assistantcore-github]] — core/homeassistant/components/webostv/manifest.json at dev (quality_scale: platinum, aiowebostv==0.9.2)
9. [[github-belikhha-lg-webos-tv-vibe-coded-untested-until-later-tonight-github]] — GitHub - belikh/ha-lg-webos-tv (sister Gold frontier)
10. [[github-chros73bscpylgtv-library-to-control-webos-based-lg-tv-devices-github]] — GitHub - chros73/bscpylgtv (library scope, calibration)
11. [[bscpylgtvbscpylgtvwebos_clientpy-at-master-chros73bscpylgtv-github]] — bscpylgtv/bscpylgtv/webos_client.py at master (2,112 lines, no session kwarg)
12. [[bscpylgtvbscpylgtvmanifestpy-at-master-chros73bscpylgtv-github]] — bscpylgtv/bscpylgtv/manifest.py at master (permissions, SIGNATURE)
13. [[entity-home-assistant-developer-docs]] — Entity | Home Assistant Developer Docs (has_entity_name, unique_id, device_info)
14. [[implements-diagnostics-home-assistant-developer-docs]] — Implements diagnostics | Home Assistant Developer Docs (redaction pattern)
