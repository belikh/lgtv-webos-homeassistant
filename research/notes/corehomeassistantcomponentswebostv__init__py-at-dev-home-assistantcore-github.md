---
title: core/homeassistant/components/webostv/__init__.py at dev · home-assistant/core
  · GitHub
id: corehomeassistantcomponentswebostv__init__py-at-dev-home-assistantcore-github
tags:
- lgtv-webos-ha-root-1a89ff
- locus-transport-discovery-security-pairing-ws-mqtt-hybrid
created: '2026-08-28T02:15:59.045821Z'
updated: '2026-08-28T02:45:29.944434Z'
source: https://github.com/home-assistant/core/blob/dev/homeassistant/components/webostv/__init__.py
source_domain: github.com
fetched_at: '2026-08-28T02:15:56.929283Z'
fetch_provider: builtin
status: draft
type: note
deprecated: false
summary: core/homeassistant/components/webostv/init.py at dev · home-assistant/core
  · GitHub
---

core/homeassistant/components/webostv/__init__.py at dev · home-assistant/core · GitHub

Skip to content

Search/

Sign inSign up
Appearance settings

You signed in with another tab or window. Reload to refresh your session.
You signed out in another tab or window. Reload to refresh your session.
You switched accounts on another tab or window. Reload to refresh your session.

Dismiss alert

{{ message }}

Uh oh!

There was an error while loading. Please reload this page.

home-assistant

/

core

Public

Uh oh!

There was an error while loading. Please reload this page.

Notifications
You must be signed in to change notification settings

Fork
38.4k

Star
90.2k

FilesExpand file tree

dev

/
__init__.pyCopy path

Blame
More file actions

Blame
More file actions

Latest commit

HistoryHistory

History

79 lines (62 loc) · 2.56 KB

dev

/
__init__.pyCopy pathTop

File metadata and controls

Code

Blame

79 lines (62 loc) · 2.56 KB

Raw
Copy raw file
Download raw file
Open symbols panel
Edit and raw actions

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79

"""The LG webOS TV integration."""

from aiowebostv import WebOsClient

from homeassistant.components import notify as hass_notify

from homeassistant.const import (

ATTR_CONFIG_ENTRY_ID,

CONF_CLIENT_SECRET,

CONF_HOST,

CONF_NAME,

EVENT_HOMEASSISTANT_STOP,

Platform,

)

from homeassistant.core import Event, HomeAssistant

from homeassistant.helpers import config_validation as cv, discovery

from homeassistant.helpers.aiohttp_client import async_get_clientsession

from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN, PLATFORMS

from .coordinator import WebOsTvConfigEntry, WebOsTvDataUpdateCoordinator

from .services import async_setup_services

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:

"""Set up the LG webOS TV platform."""

async_setup_services(hass)

return True

async def async_setup_entry(hass: HomeAssistant, entry: WebOsTvConfigEntry) -> bool:

"""Set the config entry up."""

host = entry.data[CONF_HOST]

key = entry.data[CONF_CLIENT_SECRET]

client = WebOsClient(host, key, client_session=async_get_clientsession(hass))

entry.runtime_data = coordinator = WebOsTvDataUpdateCoordinator(hass, entry, client)

await coordinator.async_config_entry_first_refresh()

await client.register_state_update_callback(coordinator.async_handle_update)

await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

# set up notify platform, no entry support for notify component yet,

# have to use discovery to load platform.

hass.async_create_task(

discovery.async_load_platform(

hass,

Platform.NOTIFY,

DOMAIN,

{

CONF_NAME: entry.title,

ATTR_CONFIG_ENTRY_ID: entry.entry_id,

},

{},

)

)

async def async_on_stop(_event: Event) -> None:

"""Unregister callbacks and disconnect."""

client.clear_state_update_callbacks()

await client.disconnect()

entry.async_on_unload(

hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, async_on_stop)

)

return True

async def async_unload_entry(hass: HomeAssistant, entry: WebOsTvConfigEntry) -> bool:

"""Unload a config entry."""

if unload_ok := await hass.config_entries.async_unload_platforms(entry, PLATFORMS):

client = entry.runtime_data.client

await hass_notify.async_reload(hass, DOMAIN)

client.clear_state_update_callbacks()

await client.disconnect()

return unload_ok

You can’t perform that action at this time.