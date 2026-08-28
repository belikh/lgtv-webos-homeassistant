---
title: core/homeassistant/components/webostv/media_player.py at dev · home-assistant/core
  · GitHub
id: corehomeassistantcomponentswebostvmedia_playerpy-at-dev-home-assistantcore-githu
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:15:59.041180Z'
source: https://github.com/home-assistant/core/blob/dev/homeassistant/components/webostv/media_player.py
source_domain: github.com
fetched_at: '2026-08-28T02:15:56.179479Z'
fetch_provider: builtin
status: draft
type: note
deprecated: false
summary: core/homeassistant/components/webostv/mediaplayer.py at dev · home-assistant/core
  · GitHub
---

core/homeassistant/components/webostv/media_player.py at dev · home-assistant/core · GitHub

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
media_player.pyCopy path

Blame
More file actions

Blame
More file actions

Latest commit

HistoryHistory

History

437 lines (366 loc) · 14.9 KB

dev

/
media_player.pyCopy pathTop

File metadata and controls

Code

Blame

437 lines (366 loc) · 14.9 KB

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
249
250
251
252
253
254
255
256
257
258
259
260
261
262
263
264
265
266
267
268
269
270
271
272
273
274
275
276
277
278
279
280
281
282
283
284
285
286
287
288
289
290
291
292
293
294
295
296
297
298
299
300
301
302
303
304
305
306
307
308
309
310
311
312
313
314
315
316
317
318
319
320
321
322
323
324
325
326
327
328
329
330
331
332
333
334
335
336
337
338
339
340
341
342
343
344
345
346
347
348
349
350
351
352
353
354
355
356
357
358
359
360
361
362
363
364
365
366
367
368
369
370
371
372
373
374
375
376
377
378
379
380
381
382
383
384
385
386
387
388
389
390
391
392
393
394
395
396
397
398
399
400
401
402
403
404
405
406
407
408
409
410
411
412
413
414
415
416
417
418
419
420
421
422
423
424
425
426
427
428
429
430
431
432
433
434
435
436
437

"""Support for interface with an LG webOS TV."""

import asyncio

from contextlib import suppress

from http import HTTPStatus

from typing import Any, cast, override

from homeassistant.components.media_player import (

MediaPlayerDeviceClass,

MediaPlayerEntity,

MediaPlayerEntityFeature,

MediaPlayerState,

MediaType,

)

from homeassistant.const import EntityStateAttribute

from homeassistant.core import HomeAssistant, ServiceResponse, callback

from homeassistant.exceptions import HomeAssistantError

from homeassistant.helpers.aiohttp_client import async_get_clientsession

from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from homeassistant.helpers.restore_state import RestoreEntity

from .const import (

ATTR_PAYLOAD,

ATTR_SOUND_OUTPUT,

CONF_SOURCES,

DOMAIN,

LIVE_TV_APP_ID,

LOGGER,

)

from .coordinator import WebOsTvConfigEntry

from .entity import WebOsTvEntity, cmd

from .triggers.turn_on import async_get_turn_on_trigger

SUPPORT_WEBOSTV = (

MediaPlayerEntityFeature.TURN_OFF

| MediaPlayerEntityFeature.NEXT_TRACK

| MediaPlayerEntityFeature.PAUSE

| MediaPlayerEntityFeature.PREVIOUS_TRACK

| MediaPlayerEntityFeature.SELECT_SOURCE

| MediaPlayerEntityFeature.PLAY_MEDIA

| MediaPlayerEntityFeature.PLAY

| MediaPlayerEntityFeature.STOP

)

SUPPORT_WEBOSTV_VOLUME = (

MediaPlayerEntityFeature.VOLUME_MUTE | MediaPlayerEntityFeature.VOLUME_STEP

)

PARALLEL_UPDATES = 0

async def async_setup_entry(

hass: HomeAssistant,

entry: WebOsTvConfigEntry,

async_add_entities: AddConfigEntryEntitiesCallback,

) -> None:

"""Set up the LG webOS TV platform."""

async_add_entities([LgWebOSMediaPlayerEntity(entry)])

class LgWebOSMediaPlayerEntity(WebOsTvEntity, RestoreEntity, MediaPlayerEntity):

"""Representation of a LG webOS TV."""

_attr_device_class = MediaPlayerDeviceClass.TV

_attr_name = None

def __init__(self, entry: WebOsTvConfigEntry) -> None:

"""Initialize the webos device."""

super().__init__(entry)

self._attr_assumed_state = True

self._attr_unique_id = entry.unique_id

self._sources = entry.options.get(CONF_SOURCES)

# Assume that the TV is not paused

self._paused = False

self._current_source = None

self._source_list: dict = {}

self._supported_features = MediaPlayerEntityFeature(0)

self._update_states()

@override

async def async_added_to_hass(self) -> None:

"""Connect and subscribe to dispatcher signals and state updates."""

await super().async_added_to_hass()

if (entry := self.registry_entry) and entry.device_id:

self.async_on_remove(

self.coordinator.turn_on.async_register(

self.hass, async_get_turn_on_trigger(entry.device_id)

)

)

if (

self.state == MediaPlayerState.OFF

and (state := await self.async_get_last_state()) is not None

):

self._supported_features = (

state.attributes.get(

EntityStateAttribute.SUPPORTED_FEATURES,

MediaPlayerEntityFeature(0),

)

& ~MediaPlayerEntityFeature.TURN_ON

)

self.async_on_remove(self.coordinator.async_add_listener(self._update_callback))

@callback

def _update_callback(self) -> None:

"""Update state from WebOsClient."""

self._update_states()

self.async_write_ha_state()

def _update_states(self) -> None:

"""Update entity state attributes."""

tv_state = self._client.tv_state

self._attr_extra_state_attributes = {}

if tv_state.is_on or not self._supported_features:

supported = SUPPORT_WEBOSTV

if tv_state.sound_output == "external_speaker":

supported = supported | SUPPORT_WEBOSTV_VOLUME

elif tv_state.sound_output != "lineout":

supported = (

supported

| SUPPORT_WEBOSTV_VOLUME

| MediaPlayerEntityFeature.VOLUME_SET

)

self._supported_features = supported

if not tv_state.is_on:

self._attr_state = MediaPlayerState.OFF

self._attr_assumed_state = False

return

self._attr_state = MediaPlayerState.ON

self._update_sources()

self._attr_is_volume_muted = cast(bool, tv_state.muted)

self._attr_volume_level = None

if tv_state.volume is not None:

self._attr_volume_level = tv_state.volume / 100.0

self._attr_source = self._current_source

self._attr_source_list = sorted(self._source_list)

self._attr_media_content_type = None

if tv_state.current_app_id == LIVE_TV_APP_ID:

self._attr_media_content_type = MediaType.CHANNEL

self._attr_media_title = None

if (tv_state.current_app_id == LIVE_TV_APP_ID) and (

tv_state.current_channel is not None

):

self._attr_media_title = cast(

str, tv_state.current_channel.get("channelName")

)

self._attr_media_image_url = None

if tv_state.current_app_id in tv_state.apps:

icon: str = tv_state.apps[tv_state.current_app_id]["largeIcon"]

if not icon.startswith("http"):

icon = tv_state.apps[tv_state.current_app_id]["icon"]

self._attr_media_image_url = icon

self._attr_assumed_state = True

if tv_state.media_state:

self._attr_assumed_state = False

for entry in tv_state.media_state:

if entry.get("playState") == "playing":

self._attr_state = MediaPlayerState.PLAYING

elif entry.get("playState") == "paused":

self._attr_state = MediaPlayerState.PAUSED

elif entry.get("playState") == "unloaded":

self._attr_state = MediaPlayerState.IDLE

tv_info = self._client.tv_info

maj_v = tv_info.software.get("major_ver")

min_v = tv_info.software.get("minor_ver")

if maj_v and min_v:

self._attr_device_info["sw_version"] = f"{maj_v}.{min_v}"

if model := tv_info.system.get("modelName"):

self._attr_device_info["model"] = model

if serial_number := tv_info.system.get("serialNumber"):

self._attr_device_info["serial_number"] = serial_number

if tv_state.sound_output is not None:

self._attr_extra_state_attributes = {

ATTR_SOUND_OUTPUT: tv_state.sound_output

}

def _update_sources(self) -> None:

"""Update list of sources from current source and apps."""

tv_state = self._client.tv_state

source_list = self._source_list

self._source_list = {}

conf_sources = self._sources

found_live_tv = False

for app in tv_state.apps.values():

if app["id"] == LIVE_TV_APP_ID:

found_live_tv = True

if app["id"] == tv_state.current_app_id:

self._current_source = app["title"]

self._source_list[app["title"]] = app

elif (

not conf_sources

or app["id"] in conf_sources

or any(word in app["title"] for word in conf_sources)

or any(word in app["id"] for word in conf_sources)

):

self._source_list[app["title"]] = app

for source in tv_state.inputs.values():

if source["appId"] == LIVE_TV_APP_ID:

found_live_tv = True

if source["appId"] == tv_state.current_app_id:

self._current_source = source["label"]

self._source_list[source["label"]] = source

elif (

not conf_sources

or source["label"] in conf_sources

or any(source["label"].find(word) != -1 for word in conf_sources)

):

self._source_list[source["label"]] = source

# empty list, TV may be off, keep previous list

if not self._source_list and source_list:

self._source_list = source_list

# special handling of live tv since this might

# not appear in the app or input lists in some cases

elif not found_live_tv:

app = {"id": LIVE_TV_APP_ID, "title": "Live TV"}

if tv_state.current_app_id == LIVE_TV_APP_ID:

self._current_source = app["title"]

self._source_list["Live TV"] = app

elif (

not conf_sources

or app["id"] in conf_sources

or any(word in app["title"] for word in conf_sources)

or any(word in app["id"] for word in conf_sources)

):

self._source_list["Live TV"] = app

@property

@override

def supported_features(self) -> MediaPlayerEntityFeature:

"""Flag media player features that are supported."""

if self.coordinator.turn_on:

return self._supported_features | MediaPlayerEntityFeature.TURN_ON

return self._supported_features

@cmd

@override

async def async_turn_off(self) -> None:

"""Turn off media player."""

await self._client.power_off()

@override

async def async_turn_on(self) -> None:

"""Turn on media player."""

await self.coordinator.turn_on.async_run(self.hass, self._context)

@cmd

@override

async def async_volume_up(self) -> None:

"""Volume up the media player."""

await self._client.volume_up()

@cmd

@override

async def async_volume_down(self) -> None:

"""Volume down media player."""

await self._client.volume_down()

@cmd

@override

async def async_set_volume_level(self, volume: float) -> None:

"""Set volume level, range 0..1."""

tv_volume = round(volume * 100)

await self._client.set_volume(tv_volume)

@cmd

@override

async def async_mute_volume(self, mute: bool) -> None:

"""Send mute command."""

await self._client.set_mute(mute)

@cmd

async def async_select_sound_output(self, sound_output: str) -> ServiceResponse:

"""Select the sound output."""

return await self._client.change_sound_output(sound_output)

@cmd

@override

async def async_media_play_pause(self) -> None:

"""Simulate play pause media player."""

if self._paused:

await self.async_media_play()

else:

await self.async_media_pause()

@cmd

@override

async def async_select_source(self, source: str) -> None:

"""Select input source."""

if (source_dict := self._source_list.get(source)) is None:

raise HomeAssistantError(

translation_domain=DOMAIN,

translation_key="source_not_found",

translation_placeholders={

"source": source,

"name": self.entity_id,

},

)

if source_dict.get("title"):

await self._client.launch_app(source_dict["id"])

elif source_dict.get("label"):

await self._client.set_input(source_dict["id"])

@cmd

@override

async def async_play_media(

self, media_type: MediaType | str, media_id: str, **kwargs: Any

) -> None:

"""Play a piece of media."""

LOGGER.debug("Call play media type <%s>, Id <%s>", media_type, media_id)

if media_type == MediaType.CHANNEL and self._client.tv_state.channels:

LOGGER.debug("Searching channel")

partial_match_channel_id = None

perfect_match_channel_id = None

for channel in self._client.tv_state.channels:

if media_id.lower() == channel["channelName"].lower():

perfect_match_channel_id = channel["channelId"]

break

if (

media_id == channel["channelNumber"]

and perfect_match_channel_id is None

):

perfect_match_channel_id = channel["channelId"]

continue

if media_id.lower() in channel["channelName"].lower():

partial_match_channel_id = channel["channelId"]

if perfect_match_channel_id is not None:

LOGGER.debug(

"Switching to channel <%s> with perfect match",

perfect_match_channel_id,

)

await self._client.set_channel(perfect_match_channel_id)

elif partial_match_channel_id is not None:

LOGGER.debug(

"Switching to channel <%s> with partial match",

partial_match_channel_id,

)

await self._client.set_channel(partial_match_channel_id)

@cmd

@override

async def async_media_play(self) -> None:

"""Send play command."""

self._paused = False

await self._client.play()

@cmd

@override

async def async_media_pause(self) -> None:

"""Send media pause command to media player."""

self._paused = True

await self._client.pause()

@cmd

@override

async def async_media_stop(self) -> None:

"""Send stop command to media player."""

await self._client.stop()

@cmd

@override

async def async_media_next_track(self) -> None:

"""Send next track command."""

if self._client.tv_state.current_app_id == LIVE_TV_APP_ID:

await self._client.channel_up()

else:

await self._client.fast_forward()

@cmd

@override

async def async_media_previous_track(self) -> None:

"""Send the previous track command."""

if self._client.tv_state.current_app_id == LIVE_TV_APP_ID:

await self._client.channel_down()

else:

await self._client.rewind()

@cmd

async def async_button(self, button: str) -> None:

"""Send a button press."""

await self._client.button(button)

@cmd

async def async_command(self, command: str, **kwargs: Any) -> ServiceResponse:

"""Send a command."""

return await self._client.request(command, payload=kwargs.get(ATTR_PAYLOAD))

@override

async def _async_fetch_image(self, url: str) -> tuple[bytes | None, str | None]:

"""Retrieve an image.

webOS uses self-signed certificates, thus we need to use an empty

SSLContext to bypass validation errors if url starts with https.

"""

content = None

websession = async_get_clientsession(self.hass)

with suppress(TimeoutError):

async with asyncio.timeout(10):

response = await websession.get(url, ssl=False)

if response.status == HTTPStatus.OK:

content = await response.read()

if content is None:

LOGGER.warning("Error retrieving proxied image from %s", url)

return content, None

You can’t perform that action at this time.