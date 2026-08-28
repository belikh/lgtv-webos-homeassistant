# Interim report: transport-discovery-security-pairing-ws-mqtt-hybrid

**Locus question:** WS re-using ws:3000 client-key vs MQTT discovery with mDNS/SSDP, TLS, and least-privilege permissions — hybrid or single?
**Flavor:** dialectical

## What the corpus already said

The width sweep framed transport as an unresolved fork in the contradiction graph's `ws-vs-mqtt-transport` cluster: WS advocates pointed to bscpylgtv's existing `ws:3000` channel and coordinator `local_push` model [[bscpylgtvbscpylgtvwebos_clientpy-at-master-chros73bscpylgtv-github]], while MQTT advocates invoked HA-native edge-node patterns where the broker handles reconnect/retain and birth/last-will better than a peer-to-peer socket [[mqtt-home-assistant-2]]. The corpus also banked two discovery truths: LG webOS TV is SSDP-native via `urn:lge-com:service:webos-second-screen:1` and HA's webostv integration declares `iot_class: local_push` [[corehomeassistantcomponentswebostvmanifestjson-at-dev-home-assistantcore-github]], and the Luna bus security model gates every method behind `ACG` + `TrustLevel` so transport choice directly constrains which `requiredPermissions` are advertised and whether `inject_websession` is honoured [[security-guide-webos-open-source-edition]] [[luna-service-bus-webos-homebrew-project]]. No corpus note had stitched WS client-key re-use, mDNS capability advertisement, MQTT discovery prefix, and TLS client-cert into a single lifecycle decision for the Platinum sister integration.

## What the new sources say

**1. bscpylgtv webos_client.py — the SSAP WS pairing contract that must be re-used [[bscpylgtvbscpylgtvwebos_clientpy-at-master-chros73bscpylgtv-github]]**

The canonical library hard-codes the security-critical transport knobs the locus must decide on:

> `self.port = (3000 if without_ssl else 3001)`
> `self.proto = ('ws' if without_ssl else 'wss')`

> `self._ssl_context.check_hostname = False`
> `self._ssl_context.verify_mode = ssl.CERT_NONE`

> `def registration_msg(self): return {"type": "register", "id": "register_0", "payload": {"client-key": self.client_key, "forcePairing": False, "manifest": self.manifest, "pairingType": self.pairing_type}}`

> `ws = await asyncio.wait_for(websockets.connect(f"{self.proto}://{self.ip}:{self.port}", ping_interval=None, close_timeout=self.timeout_connect, max_size=None, ssl=self._ssl_context), timeout=self.timeout_connect)`

with retry and liveness baked in: `timeout_connect=2, connect_retry_attempts=9, connect_retry_interval_ms=200, ping_interval=1, ping_timeout=20`. The storage layer — `await self.storage.get_key(self.ip)` / `await self.storage.set_key(self.ip, self.client_key)` and `raise PyLGTVPairException("Unable to pair")` — proves `client_key` is a persistent per-host secret keyed by IP, not a session token, and that forced pairing is off by default (`forcePairing: False`). Any transport that discards this key introduces a second credential store and a second pairing ceremony, violating least-privilege parsimony. The `wss` branch's `CERT_NONE` is load-bearing: it documents that stock SSAP intentionally disables TLS verification on LAN, so confidentiality is not the TV's design goal — authenticity (possession of `client_key`) is.

**2. HA core webostv manifest.json — Platinum local_push with SSDP, not MQTT [[corehomeassistantcomponentswebostvmanifestjson-at-dev-home-assistantcore-github]]**

> `{"domain": "webostv", "iot_class": "local_push", "quality_scale": "platinum", "requirements": ["aiowebostv==0.9.2"], "ssdp": [{"st": "urn:lge-com:service:webos-second-screen:1"}]}`

This single file decides three sub-questions: discovery is SSDP (passive, no broker), push is local (no polling, no cloud), and quality is already Platinum on the core integration. Adding an MQTT broker as a mandatory dependency would regress `iot_class` from `local_push` (direct LAN socket to device) to broker-mediated, requiring a new `mqtt` dependency that the core manifest deliberately avoids. The `aiowebostv==0.9.2` pin also shows the sister repo pattern for the `bscpylgtv==0.5.3` sister integration: one Python library, one persistent WS client, not a split WS+MQTT client.

**3. HA core webostv __init__.py — inject_websession and coordinator push in 30 lines [[corehomeassistantcomponentswebostv__init__py-at-dev-home-assistantcore-github]]**

> `client = WebOsClient(host, key, client_session=async_get_clientsession(hass))`
> `entry.runtime_data = coordinator = WebOsTvDataUpdateCoordinator(hass, entry, client)`
> `await coordinator.async_config_entry_first_refresh()`
> `await client.register_state_update_callback(coordinator.async_handle_update)`

This is the Platinum compliance proof the locus must not break. `async_get_clientsession(hass)` is the `inject_websession` rule — the integration must not create its own `aiohttp.ClientSession`. Any new transport (companion WS server or MQTT) must reuse this session for HTTP upgrades or broker discovery. The `register_state_update_callback` → `coordinator.async_handle_update` pattern is the `local_push` implementation: TV-originated state deltas (power, app, mute, volume, apps, inputs, sound_output) fan out to entities without polling. MQTT would duplicate this callback graph with a second `on_message` path, doubling test surface and risking split-brain state if WS and MQTT disagree.

**4. HA core webostv config_flow.py — SSDP→pairing→unique_id chain that gates discovery [[corehomeassistantcomponentswebostvconfig_flowpy-at-dev-home-assistantcore-github]]**

> `async def async_control_connect(hass, host, key): client = WebOsClient(host, key, client_session=async_get_clientsession(hass)); await client.connect(); return client`
> `host = urlparse(discovery_info.ssdp_location).hostname`
> `await self.async_set_unique_id(client.tv_info.hello["deviceUUID"], raise_on_progress=False)`
> `client = await async_control_connect(self.hass, self._host, None)` on `async_step_pairing`

The SSDP `LOCATION` header is the only credential-less discovery signal (no TCP probe to :3000), and `hello["deviceUUID"]` is the stable unique_id (stripped via `uuid.removeprefix("uuid:")`). Pairing is a connect-with-no-key that triggers the TV's on-screen PIN prompt and persists the returned `client_key` into `entry.data[CONF_CLIENT_SECRET]` (internally `CONF_CLIENT_SECRET`, user-visible as `client_key`). Re-auth and reconfigure reuse `async_control_connect` with the stored key. This chain implies the companion must not invent a parallel pairing UX: it should reuse the same `client_key` (second-mode detection: if companion is present, `hello` can carry a `companion: true` flag or a separate companion WS can accept the same `client_key` as bearer).

**5. HA MQTT integration docs — what MQTT buys and what it costs [[mqtt-home-assistant-2]]**

The docs quantify the MQTT alternative:

> `Discovery topic needs to follow a specific format: <discovery_prefix>/<component>/[<node_id>/]<object_id>/config`
> `<discovery_prefix>: The Discovery Prefix defaults to homeassistant and this prefix can be changed.`

> `By default, Home Assistant sends online and offline to homeassistant/status.` and `MQTT Birth and Last Will messages can be customized`

> `You can select websockets as the transport method ... The target WebSockets URI ws://{broker}:{port}{ws_path} is built with the broker, port, and ws_path`

> `A device or service that exposes the MQTT discovery should subscribe to the Birth message and use this as a trigger to send the discovery payload.`

> `Retaining the discovery payload: This will store the discovery payload at the MQTT broker, and offer it to the MQTT integration as soon as it subscribes`

Plus broker config: Mosquitto recommended, MQTT 5 requirement, `Broker certificate validation: Auto`, optional client certificate + private key (PEM/DER, password-protected), keepalive default 60s (min 15s), WebSockets optional. The cost side: broker is a new runtime dependency (user must run Mosquitto), discovery is broker-retained (not TV-retained), and TLS validation is user-configured per broker — the TV would need to ship a CA bundle and rotation logic. The benefit side: last-will handles TV power-off/crash gracefully, retain solves HA restart race, and component-per-entity discovery auto-creates entities without code changes in the integration. Critically, the docs frame MQTT discovery as *device-initiated* (TV publishes `config` to `homeassistant/...`), whereas SSDP/WS is *coordinator-initiated* (HA discovers TV, HA connects to TV).

**6. webOS TV Connection Manager + bscpylgtv endpoints.py — subscription primitives are identical across transports [[connection-manager-api-reference-guide-webos-tv-developer]] [[bscpylgtvbscpylgtvendpointspy-at-master-chros73bscpylgtv-github]]**

Connection Manager documents the Luna subscription that underpins both WS `subscribe:true` and any MQTT bridge:

> `getStatus — subscribe: true: Subscribe. false: Do not subscribe. Call the method only once. (Default)`
> `subscriptionHandle = webOS.service.request('luna://com.palm.connectionmanager', {method: 'getStatus', parameters: {subscribe: true}, onSuccess: ...})` and `subscriptionHandle.cancel()`

endpoints.py maps SSAP uris to Luna uris (`"api/getServiceList"`, `"audio/getVolume"`, `"com.webos.applicationManager/getForegroundAppInfo"`, `"com.webos.service.tvpower/power/getPowerState"`) and marks the root-only writers that a companion must host itself:

> `LUNA_SET_CONFIGS = "com.webos.service.config/setConfigs"`
> `LUNA_TURN_ON_SCREEN_SAVER = "com.webos.service.tvpower/power/turnOnScreenSaver"` — `disabled at some point`

This confirms the hybrid temptation: stock WS can `getPowerState` with `subscribe:true`, but only a rooted Luna-direct call can `setConfigs`/`reboot` — exactly the methods the companion's own WS/MQTT bridge would expose, regardless of transport. The transport question is thus separable from the capability question; both transports can carry the same Luna payloads.

## Evidence synthesis

The new sources collapse the apparent WS-vs-MQTT dilemma into a layering problem: discovery, pairing, control, and high-frequency telemetry have different optimal transports, but Platinum cost forces a single primary with an optional secondary behind a feature flag.

Discovery is settled. The TV already does SSDP `urn:lge-com:service:webos-second-screen:1` → `LOCATION` → `hello deviceUUID` → `async_set_unique_id` without any companion. The companion's job is capability advertisement after pairing, not device discovery. The correct advertisement is mDNS `_lg-ha-companion._tcp.local` with TXT `txtvers=1 companion=1 version=1.2.3 caps=cec,capture,audio,voice,dashboard ws_port=9922 luna_all=1` (originated from the JS service, refreshed on IP change via `com.palm.connectionmanager/getStatus` subscription). Zeroconf is HA-native (`zeroconf` integration scans `_hap._tcp`, `_esphomelib._tcp`, `_mqtt._tcp`), so HA can find the companion without polling. MQTT discovery (`homeassistant/status` birth → `homeassistant/<component>/lg_tv_<uuid>/config` retained) is redundant with mDNS for discovery and adds a broker hop; it is the correct fallback only when an MQTT broker is already present (discovered via zeroconf `_mqtt._tcp.local`) and the user opts into MQTT.

Pairing and session security is settled on WS re-use. The `client_key` lifecycle — `get_key(ip)` → `registration_msg` with `forcePairing: False` → `set_key(ip, client_key)` → store in `entry.data[CONF_CLIENT_SECRET]` — is the only credential the user consents to via the TV PIN prompt. Any new transport that demands a separate secret (MQTT username/password, TV-hosted WS bearer, TLS client cert) must either derive from `client_key` (e.g., `HMAC(client_key, "companion-ws")`) or justify a second pairing. The evidence weight favours derivation: the companion's WS server (e.g., `ws://<tv>:9922/companion` or `wss://` if HA validates) should accept `{"type":"auth","client_key": <same>}` and rotate by re-pairing through the existing `async_step_reauth` flow, not by adding MQTT ACLs. The `CERT_NONE` annex on stock `wss:3001` is not a flaw to replicate — the companion's LAN TLS, if offered, should be `Auto` validation with a self-signed cert pinned on first pairing and stored alongside `client_key`, but must default to `ws:` on LAN because Homebrew/piccap services on 10.1.1.209 already operate plaintext on trusted LAN and users accept this risk band.

Control and push is settled on WS primary. `aiowebostv` with `websockets.connect` + `ping_interval=1` + `ping_timeout=20` + `connect_retry_attempts=9` + `register_state_update_callback` already implements Platinum `local_push` without polling. The coordinator's `async_config_entry_first_refresh` plus subscription `subscribe_power|apps|inputs|current_app|sound_output` is the exact entity update path; MQTT would duplicate it and force the integration to arbitrate two truth sources for the same entity. The points where MQTT wins — graceful power-off detection via `homeassistant/status` LWT, retained discovery surviving HA restart, QoS-1 for fire-and-forget commands — are real but narrow: they matter only for edge-node telemetry that stock WS never carried (ambient frame hashes at 10–30 Hz, voice satellite audio chunks, CEC bus snooping). For those, a companion-internal MQTT client that publishes to an *existing* user broker (not a new embedded broker) is a defensible secondary bus, with `retain=False` for telemetry, `retain=True` for `config`, and `availability_topic` pointing at the WS LWT.

### Position A: WS re-using ws:3000 client-key is the single Platinum transport — MQTT is unnecessary coupling

Best case: The entire bidirectional matrix (HA→TV: launch, power, volume, toast, input; TV→HA: power state, foreground app, channel, external input, sound output) already flows over `aiowebostv` WS `3000/3001` with a single `client_key` persisted by `StorageProto` and injected via `async_get_clientsession`. The integration is `local_push`, `platinum`, `ssdp` today; adding MQTT introduces a mandatory external broker (Mosquitto), a second credential store, a second discovery path (`homeassistant/<component>/.../config` vs `hello deviceUUID`), and a second availability source competing with `client.register_state_update_callback`. The companion's JS service can simply expose additional Luna methods over the *same* WS channel by handling `ssap://com.ha.companion/*` URIs inside the existing `WebOsClient.command`/`subscribe` dispatch, gated by the same `client_key`, with mDNS TXT advertising `companion=1`. TLS is intentionally `CERT_NONE` on LAN — matching bscpylgtv — so no cert rotation is needed. MQTT's retain/LWT advantage is moot because HA's coordinator already handles disconnect via `websockets.exceptions.ConnectionClosed` → `DataUpdateCoordinator` unavailable, and HA persists entity registry across restart. The simplest Platinum design is therefore one transport, one pairing, one discovery signal (SSDP for TV, mDNS for companion caps), and the companion's Luna `all`-role methods are just new WS verbs, not a new protocol.

### Position B: MQTT-native discovery with broker-mediated retain/birth-Will is the robust edge-node transport — WS alone cannot handle TV power domain and HA restart races

Best case: As soon as the TV becomes an edge node (ambient `piccap` frames, `hyperhdr` LED stream, voice satellite `wakeword`, CEC hub `listAdapters/scan/sendCommand`), the control-plane vs data-plane split matters. WS `3000/3001` is a single authenticated session to an ephemeral TV process: when the TV suspends (`Active Standby`/`Suspend`) or HA restarts, the subscription set (`subscribe_power` etc.) is lost and must be re-walked sequentially, with no retained last value — entities flick to `unavailable` until re-subscribe completes (9 retries × 200 ms plus power-state polling). MQTT's `retain=True` config plus `retain=False` telemetry with `LWT offline` and `birth online` solves this atomically: the TV publishes discovery once with `retain=True` to `homeassistant/sensor/lg_tv_<uuid>_ambient/config` (with `device.identifiers: [deviceUUID]`), publishes state with `retain=False` at high rate, and HA on restart replays retained `config` without waiting for the TV to wake. TLS with broker `Auto` validation plus client cert is stronger than WS `CERT_NONE`, satisfying least-privilege on LAN. Discovery also becomes broker-queryable (no mDNS daemon needed on the TV's constrained JS runtime). Vendor precedent (ESPHome, Zigbee2MQTT, Shelly) is MQTT-primary for exactly these HA edge reasons; the webostv `local_push` label is a legacy of TV-as-sink, not TV-as-sensor-hub.

## Committed position

The evidence converges on a single mandatory WS transport that re-uses the `3000/3001` `client_key` and a companion capability advertisement over mDNS, with MQTT demoted to an opt-in secondary telemetry bus that the integration auto-detects via zeroconf `_mqtt._tcp.local` but never requires — because the core webostv integration is already `platinum`/`local_push`/`ssdp` over `aiowebostv` with `async_get_clientsession` and `register_state_update_callback`, so a mandatory broker would add a user-hosted Mosquitto dependency, a second credential store, and a split-brain availability source for no entity the TV-as-sink needs, while the edge-node data-plane that genuinely benefits from MQTT `retain`/`birth`/`will` (ambient 10–30 Hz hashes, voice chunks, CEC snooping) is correctly implemented as a companion-internal MQTT publisher that only activates when a broker is already present and the user has toggled the companion's `mqtt_telemetry: true`. In concrete terms, ship (a) HA→TV control and TV→HA state on the existing `aiowebostv` WS `wss://<tv>:3001` (with `ssl.CERT_NONE` documented as LAN-trusted) re-using `entry.data[CONF_CLIENT_SECRET]` for both directions — the companion's WS server on `<tv>:<ephemeral>` (default `9923`, firewall-closed unless `txtvers` advertises) accepts `{"auth":{"client_key":"<same>"}}` derived via `HMAC(client_key, "ha-companion/1")` and exposes `ssap://com.ha.companion/*` as plain Luna proxies guarded by `requiredPermissions: ["all"]` only after `elevate-service` has injected the `all` pseudo-role — (b) discovery in two layers: passive SSDP `urn:lge-com:service:webos-second-screen:1` for the TV (unchanged) and companion mDNS `_lg-ha-companion._tcp.local` TXT `vers=1 companion=1 version=X caps=cec,capture,audio,voice,dashboard ws_port=9923 luna_all=1` for capability negotiation, polled by HA via `zeroconf` (no new MQTT discovery topic unless MQTT mode is on) — and (c) MQTT, if enabled, as `homeassistant/<component>/lg_tv_<uuid>_<object>/config` with `retain=True` exactly once per `birth online` and state topics `lg_tv/<uuid>/ambient|voice|cec/state` with `retain=False, QoS 0, keepalive 60s (min 15s)`, using the broker's `Auto` TLS validation and optional client cert stored alongside `client_key`, not replacing WS availability.

- **Position:** Single mandatory WS re-using the SSAP `client_key` plus mDNS TXT capability advertisement; MQTT is opt-in secondary telemetry only when a broker already exists.
- **Confidence:** medium (65–75%) — WS primary and mDNS secondary are high-confidence from `aiowebostv`/`webostv` Platinum ground truth, but the threshold at which ambient/voice/CEC volume forces MQTT over WS for the `bscpylgtv==0.5.3` sister integration is not quantified in corpus and rests on inference from the 10–30 Hz `piccap` analogy rather than a measured WS saturation test on OLED48CX.
- **Boundary conditions:** Applies to rooted consumer TV firmware 5.0–6.x (`04.40.16` AU) on trusted LAN with `ssdp` + `zeroconf` enabled in HA and where `inject_websession` via `async_get_clientsession` is available; does not hold where user runs no MQTT broker and expects edge-node telemetry without WS saturation testing, nor where LAN is untrusted and `CERT_NONE` on `wss:3001` violates local policy — there, MQTT `ws(s)://{broker}:{port}{ws_path}` with `Auto` TLS plus client cert is the required primary until companion ships pinned self-signed `wss:` with rotation.
- **What would change this position:** A reproducible 10.1.1.209 measurement showing companion WS on `ws://:9923` saturates or drops subscriptions at <5 Hz telemetry or that `ping_interval=1`/`ping_timeout=20` cannot keep `local_push` alive through `Active Standby` without LWT, or an HA architecture review requiring every new sensor domain (`capture`, `cec`, `voice`) to use MQTT `retain`/`availability_topic` rather than WS `subscribe` to satisfy Platinum `local_push` semantics, or a security audit mandating `CERT_NONE` be removed from `wss:3001` in favour of broker TLS — any would promote MQTT to mandatory hybrid.
- **Evidence weight:** 4 direct integrations support WS primary (webos_client.py pairing/ports/retain-retry, webostv manifest `local_push`+`ssdp`+`platinum`, __init__.py `inject_websession`+coordinator push, config_flow.py `hello deviceUUID` unique_id), 2 docs support MQTT as optional enhancement (MQTT birth/will/retain/WebSockets+TLS), 1 protocol doc shows subscription parity (Connection Manager `subscribe:true`), 1 endpoint list scopes capability bridging (Luna SetConfigs disabled over WS); no source shows an MQTT broker running on stock 5.4.1 TV or an existing TV-hosted WS server accepting `client_key` — that server is a design inference, not a fetched artefact.

## Open questions

- What ephemeral port and protocol should the companion's own WS server use on webOS TV 5.4.1 (`Node ws` on JS service vs native `libwebsockets` via systemd companion) and does the CX SoC sustain `ping_interval=1` for two concurrent WS servers (SSAP `:3001` plus companion `:9923`) without starving the foreground?
- Does the companion's WS auth re-using `client_key` survive `async_step_reauth` rotation atomically (old key rejected, new `HMAC(client_key, "ha-companion/1")` re-derived) or is a separate companion token with its own expiry needed, and how is that token stored in `entry.data` alongside `CONF_CLIENT_SECRET` under diagnostics redaction?
- At what ambient telemetry rate (Hz, bytes/s) does WS `subscribe` with `consumer_handler` queues back-pressure versus MQTT `QoS 0` publish, and does `hyperhdr`/`piccap` on OLED48CX sustain 30 Hz capture without frame drops over JS-service WS versus native libvt publisher?
- When HA discovers both SSDP `urn:lge-com:service:webos-second-screen:1` and mDNS `_lg-ha-companion._tcp.local` for the same `deviceUUID`, which config-flow branch wins and how is `txtvers` upgrade (`caps` bitmask change) surfaced as a re-discovery vs `runtime_data` refresh without creating a duplicate config entry?

## Sources

1. [[bscpylgtvbscpylgtvwebos_clientpy-at-master-chros73bscpylgtv-github]] — bscpylgtv/bscpylgtv/webos_client.py at master · chros73/bscpylgtv
2. [[bscpylgtvbscpylgtvendpointspy-at-master-chros73bscpylgtv-github]] — bscpylgtv/bscpylgtv/endpoints.py at master · chros73/bscpylgtv
3. [[corehomeassistantcomponentswebostvmanifestjson-at-dev-home-assistantcore-github]] — core/homeassistant/components/webostv/manifest.json at dev · home-assistant/core
4. [[corehomeassistantcomponentswebostv__init__py-at-dev-home-assistantcore-github]] — core/homeassistant/components/webostv/__init__.py at dev · home-assistant/core
5. [[corehomeassistantcomponentswebostvconfig_flowpy-at-dev-home-assistantcore-github]] — core/homeassistant/components/webostv/config_flow.py at dev · home-assistant/core
6. [[mqtt-home-assistant-2]] — MQTT - Home Assistant (broker, birth/will, discovery prefix, retain, TLS, WebSockets)
7. [[connection-manager-api-reference-guide-webos-tv-developer]] — Connection Manager API Reference Guide | webOS TV Developer
8. [[security-guide-webos-open-source-edition]] — Security Guide | webOS Open Source Edition
9. [[luna-service-bus-webos-homebrew-project]] — Luna service bus | webOS Homebrew Project
10. [[simple-service-discovery-protocol-ssdp-home-assistant]] — Simple Service Discovery Protocol (SSDP) - Home Assistant
11. [[zero-configuration-networking-zeroconf-home-assistant]] — Zero-configuration networking (zeroconf) - Home Assistant
