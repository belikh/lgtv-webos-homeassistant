---
title: core/homeassistant/components/webostv/config_flow.py at dev · home-assistant/core
  · GitHub
id: corehomeassistantcomponentswebostvconfig_flowpy-at-dev-home-assistantcore-github
tags:
- lgtv-webos-ha-root-1a89ff
- locus-transport-discovery-security-pairing-ws-mqtt-hybrid
created: '2026-08-28T02:44:44.337316Z'
source: https://github.com/home-assistant/core/blob/dev/homeassistant/components/webostv/config_flow.py
source_domain: github.com
fetched_at: '2026-08-28T02:44:44.335347Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: code
deprecated: false
---

core/homeassistant/components/webostv/config_flow.py at dev · home-assistant/core · GitHub

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
config_flow.pyCopy path

Blame
More file actions

Blame
More file actions

Latest commit

HistoryHistory

History

248 lines (207 loc) · 8.51 KB

dev

/
config_flow.pyCopy pathTop

File metadata and controls

Code

Blame

248 lines (207 loc) · 8.51 KB

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
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
161
162
163
164
165
166
167
168
169
170
171
172
173
174
175
176
177
178
179
180
181
182
183
184
185
186
187
188
189
190
191
192
193
194
195
196
197
198
199
200
201
202
203
204
205
206
207
208
209
210
211
212
213
214
215
216
217
218
219
220
221
222
223
224
225
226
227
228
229
230
231
232
233
234
235
236
237
238
239
240
241
242
243
244
245
246
247
248

"""Config flow for LG webOS TV integration."""

from collections.abc import Mapping

from typing import Any, Self, override

from urllib.parse import urlparse

from aiowebostv import WebOsClient, WebOsTvPairError

import voluptuous as vol

from homeassistant.config_entries import (

ConfigFlow,

ConfigFlowResult,

OptionsFlowWithReload,

)

from homeassistant.const import CONF_CLIENT_SECRET, CONF_HOST

from homeassistant.core import HomeAssistant, callback

from homeassistant.helpers import config_validation as cv

from homeassistant.helpers.aiohttp_client import async_get_clientsession

from homeassistant.helpers.service_info.ssdp import (

ATTR_UPNP_FRIENDLY_NAME,

ATTR_UPNP_UDN,

SsdpServiceInfo,

)

from . import WebOsTvConfigEntry

from .const import CONF_SOURCES, DEFAULT_NAME, DOMAIN, WEBOSTV_EXCEPTIONS

from .helpers import get_sources

DATA_SCHEMA = vol.Schema(

{

vol.Required(CONF_HOST): cv.string,

},

extra=vol.ALLOW_EXTRA,

)

async def async_control_connect(

hass: HomeAssistant, host: str, key: str | None

) -> WebOsClient:

"""Create LG webOS client and connect to the TV."""

client = WebOsClient(

host,

key,

client_session=async_get_clientsession(hass),

)

await client.connect()

return client

class FlowHandler(ConfigFlow, domain=DOMAIN):

"""LG webOS TV configuration flow."""

VERSION = 1

def __init__(self) -> None:

"""Initialize workflow."""

self._host: str = ""

self._name: str = ""

self._uuid: str | None = None

@staticmethod

@callback

@override

def async_get_options_flow(config_entry: WebOsTvConfigEntry) -> OptionsFlowHandler:

"""Get the options flow for this handler."""

return OptionsFlowHandler(config_entry)

@override

async def async_step_user(

self, user_input: dict[str, Any] | None = None

) -> ConfigFlowResult:

"""Handle a flow initialized by the user."""

if user_input is not None:

self._host = user_input[CONF_HOST]

return await self.async_step_pairing()

return self.async_show_form(step_id="user", data_schema=DATA_SCHEMA)

async def async_step_pairing(

self, user_input: dict[str, Any] | None = None

) -> ConfigFlowResult:

"""Display pairing form."""

self._async_abort_entries_match({CONF_HOST: self._host})

self.context["title_placeholders"] = {"name": self._name}

errors: dict[str, str] = {}

if user_input is not None:

try:

client = await async_control_connect(self.hass, self._host, None)

except WebOsTvPairError:

errors["base"] = "error_pairing"

except WEBOSTV_EXCEPTIONS:

errors["base"] = "cannot_connect"

else:

await self.async_set_unique_id(

client.tv_info.hello["deviceUUID"], raise_on_progress=False

)

self._abort_if_unique_id_configured({CONF_HOST: self._host})

data = {CONF_HOST: self._host, CONF_CLIENT_SECRET: client.client_key}

if not self._name:

if model_name := client.tv_info.system.get("modelName"):

self._name = f"{DEFAULT_NAME} {model_name}"

else:

self._name = DEFAULT_NAME

return self.async_create_entry(title=self._name, data=data)

return self.async_show_form(step_id="pairing", errors=errors)

@override

async def async_step_ssdp(

self, discovery_info: SsdpServiceInfo

) -> ConfigFlowResult:

"""Handle a flow initialized by discovery."""

assert discovery_info.ssdp_location

host = urlparse(discovery_info.ssdp_location).hostname

assert host

self._host = host

self._name = discovery_info.upnp.get(

ATTR_UPNP_FRIENDLY_NAME, DEFAULT_NAME

).replace("[LG]", "LG")

uuid = discovery_info.upnp[ATTR_UPNP_UDN]

assert uuid

uuid = uuid.removeprefix("uuid:")

await self.async_set_unique_id(uuid)

self._abort_if_unique_id_configured({CONF_HOST: self._host})

if self.hass.config_entries.flow.async_has_matching_flow(self):

return self.async_abort(reason="already_in_progress")

self._uuid = uuid

return await self.async_step_pairing()

@override

def is_matching(self, other_flow: Self) -> bool:

"""Return True if other_flow is matching this flow."""

return other_flow._host == self._host

async def async_step_reauth(

self, entry_data: Mapping[str, Any]

) -> ConfigFlowResult:

"""Perform reauth upon an WebOsTvPairError."""

self._host = entry_data[CONF_HOST]

return await self.async_step_reauth_confirm()

async def async_step_reauth_confirm(

self, user_input: dict[str, Any] | None = None

) -> ConfigFlowResult:

"""Dialog that informs the user that reauth is required."""

errors: dict[str, str] = {}

if user_input is not None:

try:

client = await async_control_connect(self.hass, self._host, None)

except WebOsTvPairError:

errors["base"] = "error_pairing"

except WEBOSTV_EXCEPTIONS:

errors["base"] = "cannot_connect"

else:

reauth_entry = self._get_reauth_entry()

data = {CONF_HOST: self._host, CONF_CLIENT_SECRET: client.client_key}

return self.async_update_reload_and_abort(reauth_entry, data=data)

return self.async_show_form(step_id="reauth_confirm", errors=errors)

async def async_step_reconfigure(

self, user_input: dict[str, Any] | None = None

) -> ConfigFlowResult:

"""Handle reconfiguration of the integration."""

errors: dict[str, str] = {}

reconfigure_entry = self._get_reconfigure_entry()

if user_input is not None:

host = user_input[CONF_HOST]

client_key = reconfigure_entry.data.get(CONF_CLIENT_SECRET)

try:

client = await async_control_connect(self.hass, host, client_key)

except WebOsTvPairError:

errors["base"] = "error_pairing"

except WEBOSTV_EXCEPTIONS:

errors["base"] = "cannot_connect"

else:

await self.async_set_unique_id(client.tv_info.hello["deviceUUID"])

self._abort_if_unique_id_mismatch(reason="wrong_device")

data = {CONF_HOST: host, CONF_CLIENT_SECRET: client.client_key}

return self.async_update_reload_and_abort(reconfigure_entry, data=data)

return self.async_show_form(

step_id="reconfigure",

data_schema=vol.Schema(

{

vol.Required(

CONF_HOST, default=reconfigure_entry.data.get(CONF_HOST)

): cv.string

}

),

errors=errors,

)

class OptionsFlowHandler(OptionsFlowWithReload):

"""Handle options."""

def __init__(self, config_entry: WebOsTvConfigEntry) -> None:

"""Initialize options flow."""

self.host = config_entry.data[CONF_HOST]

self.key = config_entry.data[CONF_CLIENT_SECRET]

async def async_step_init(

self, user_input: dict[str, Any] | None = None

) -> ConfigFlowResult:

"""Manage the options."""

errors = {}

if user_input is not None:

options_input = {CONF_SOURCES: user_input[CONF_SOURCES]}

return self.async_create_entry(title="", data=options_input)

# Get sources

sources_list = []

try:

client = await async_control_connect(self.hass, self.host, self.key)

sources_list = get_sources(client.tv_state)

except WebOsTvPairError:

errors["base"] = "error_pairing"

except WEBOSTV_EXCEPTIONS:

errors["base"] = "cannot_connect"

option_sources = self.config_entry.options.get(CONF_SOURCES, [])

sources = [s for s in option_sources if s in sources_list]

if not sources:

sources = sources_list

options_schema = vol.Schema(

{

vol.Optional(

CONF_SOURCES,

description={"suggested_value": sources},

): cv.multi_select({source: source for source in sources_list}),

}

)

return self.async_show_form(

step_id="init", data_schema=options_schema, errors=errors

)

You can’t perform that action at this time.