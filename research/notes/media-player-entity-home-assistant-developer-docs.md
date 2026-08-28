---
title: Media player entity | Home Assistant Developer Docs
id: media-player-entity-home-assistant-developer-docs
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:15:38.316468Z'
source: https://developers.home-assistant.io/docs/core/entity/media-player/
source_domain: developers.home-assistant.io
fetched_at: '2026-08-28T02:15:33.692456Z'
fetch_provider: builtin
status: draft
type: note
deprecated: false
summary: Media player entity | Home Assistant Developer Docs
---

Media player entity | Home Assistant Developer Docs

Skip to main content

On this page

Incomplete

This entry is incomplete. Contribution welcome.

A media player entity controls a media player. Derive a platform entity from homeassistant.components.media_player.MediaPlayerEntity.

Properties​

tip

Properties should always only return information from memory and not do I/O (like network requests). Implement update() or async_update() to fetch data.
NameTypeDefaultDescriptionapp_idstr | NoneNoneID of the current running app.app_namestr | NoneNoneName of the current running app.device_classMediaPlayerDeviceClass | NoneNoneType of media player.group_memberslist[str] | NoneNoneA dynamic list of player entities which are currently grouped together for synchronous playback. If the platform has a concept of defining a group leader, the leader should be the first element in that list.is_volume_mutedbool | NoneNoneTrue if volume is currently muted.media_album_artiststr | NoneNoneAlbum artist of current playing media, music track only.media_album_namestr | NoneNoneAlbum name of current playing media, music track only.media_artiststr | NoneNoneArtist of current playing media, music track only.media_channelstr | NoneNoneChannel currently playing.media_content_idstr | NoneNoneContent ID of current playing media.media_content_typeMediaType | str | NoneNoneContent type of current playing media.media_durationint | NoneNoneDuration of current playing media in seconds.media_episodestr | NoneNoneEpisode of current playing media, TV show only.media_image_hashstr | NoneNoneHash of media image, defaults to SHA256 of media_image_url if media_image_url is not None.media_image_remotely_accessiblebool | NoneFalseTrue if property media_image_url is accessible outside of the home network.media_image_urlstr | NoneNoneImage URL of current playing media.media_playliststr | NoneNoneTitle of Playlist currently playing.media_positionint | NoneNonePosition of current playing media in seconds.media_position_updated_atdatetime | NoneNoneTimestamp of when _attr_media_position was last updated. The timestamp should be set by calling homeassistant.util.dt.utcnow().media_seasonstr | NoneNoneSeason of current playing media, TV show only.media_series_titlestr | NoneNoneTitle of series of current playing media, TV show only.media_titlestr | NoneNoneTitle of current playing media.media_trackint | NoneNoneTrack number of current playing media, music track only.repeatRepeatMode | str | NoneNoneCurrent repeat mode.shufflebool | NoneNoneTrue if shuffle is enabled.sound_modestr | NoneNoneThe current sound mode of the media player.sound_mode_listlist[str] | NoneNoneDynamic list of available sound modes.sourcestr | NoneNoneThe currently selected input source for the media player.source_listlist[str] | NoneNoneThe list of possible input sources for the media player. (This list should contain human readable names, suitable for frontend display).stateMediaPlayerState | NoneNoneState of the media player.volume_levelfloat | NoneNoneVolume level of the media player in the range (0..1).volume_stepfloat | None0.1Volume step to use for the volume_up and volume_down service actions.

Supported features​

Supported features are defined by using values in the MediaPlayerEntityFeature enum
and are combined using the bitwise or (|) operator.
ValueDescriptionBROWSE_MEDIAEntity allows browsing media.CLEAR_PLAYLISTEntity allows clearing the active playlist.GROUPINGEntity can be grouped with other players for synchronous playback.MEDIA_ANNOUNCEEntity supports the play_media action's announce parameter.MEDIA_ENQUEUEEntity supports the play_media action's enqueue parameter.NEXT_TRACKEntity allows skipping to the next media track.PAUSEEntity allows pausing the playback of media.PLAYEntity allows playing/resuming playback of media.PLAY_MEDIAEntity allows playing media sources.PREVIOUS_TRACKEntity allows returning back to a previous media track.REPEAT_SETEntity allows setting repeat.SEARCH_MEDIAEntity allows searching for media.SEEKEntity allows seeking position during playback of media.SELECT_SOUND_MODEEntity allows selecting a sound mode.SELECT_SOURCEEntity allows selecting a source/input.SHUFFLE_SETEntity allows shuffling the active playlist.STOPEntity allows stopping the playback of media.TURN_OFFEntity is able to be turned off.TURN_ONEntity is able to be turned on.VOLUME_MUTEEntity volume can be muted.VOLUME_SETEntity volume can be set to specific levels.VOLUME_STEPEntity volume can be adjusted up and down.

States​

Setting the state should return an enum from MediaPlayerState in the state property. The resulting state value is the lowercase version of the enum member name (for example, MediaPlayerState.PLAYING results in the state playing).
ValueDescriptionOFFEntity is turned off and is not accepting commands until turned on.ONEntity is turned on, but no details on its state is currently known.IDLEEntity is turned on and accepting commands, but currently not playing any media. Possibly at some idle home screen.PLAYINGEntity is currently playing media.PAUSEDEntity has an active media and is currently pausedBUFFERINGEntity is preparing to start playback of some media

note

It is common that media players can't be controlled when in a standby state. If Home Assistant can turn on the device using another protocol or method, it should be shown as off even if the main channel used to control the device is currently unavailable. If Home Assistant has no way to turn on the device, it should be shown as unavailable. See entity-unavailable Exceptions for more details.

Methods​

Play media​

Tells the media player to play media. Implement it using the following:

class MyMediaPlayer(MediaPlayerEntity):

def play_media(

self,

media_type: str,

media_id: str,

enqueue: MediaPlayerEnqueue | None = None,

announce: bool | None = None, **kwargs: Any

) -> None:

"""Play a piece of media."""

async def async_play_media(

self,

media_type: str,

media_id: str,

enqueue: MediaPlayerEnqueue | None = None,

announce: bool | None = None, **kwargs: Any

) -> None:

"""Play a piece of media."""

The enqueue attribute is a string enum MediaPlayerEnqueue:

add: add given media item to end of the queue

next: play the given media item next, keep queue

play: play the given media item now, keep queue

replace: play the given media item now, clear queue

When the announce boolean attribute is set to true, the media player should try to pause the current music, announce the media to the user and then resume the music.

Browse media​

If the media player supports browsing media, it should implement the following method:

class MyMediaPlayer(MediaPlayerEntity):

async def async_browse_media(

self, media_content_type: str | None = None, media_content_id: str | None = None

) -> BrowseMedia:

"""Implement the websocket media browsing helper."""

return await media_source.async_browse_media(

self.hass,

media_content_id,

content_filter=lambda item: item.media_content_type.startswith("audio/"),

)

If the media player also allows playing media from URLs, you can also add support for browsing
Home Assistant media sources. These sources can be provided by any integration. Examples provide
text-to-speech and local media.

from homeassistant.components import media_source

from homeassistant.components.media_player.browse_media import (

async_process_play_media_url,

)

class MyMediaPlayer(MediaPlayerEntity):

async def async_browse_media(

self, media_content_type: str | None = None, media_content_id: str | None = None

) -> BrowseMedia:

"""Implement the websocket media browsing helper."""

# If your media player has no own media sources to browse, route all browse commands

# to the media source integration.

return await media_source.async_browse_media(

self.hass,

media_content_id,

# This allows filtering content. In this case it will only show audio sources.

content_filter=lambda item: item.media_content_type.startswith("audio/"),

)

async def async_play_media(

self,

media_type: str,

media_id: str,

enqueue: MediaPlayerEnqueue | None = None,

announce: bool | None = None, **kwargs: Any

) -> None:

"""Play a piece of media."""

if media_source.is_media_source_id(media_id):

media_type = MediaType.MUSIC

play_item = await media_source.async_resolve_media(self.hass, media_id, self.entity_id)

# play_item returns a relative URL if it has to be resolved on the Home Assistant host

# This call will turn it into a full URL

media_id = async_process_play_media_url(self.hass, play_item.url)

# Replace this with calling your media player play media function.

await self._media_player.play_url(media_id)

Search media​

If the media player supports searching media, it should implement the following method:

class MyMediaPlayer(MediaPlayerEntity):

async def async_search_media(

self,

query: SearchMediaQuery,

) -> SearchMedia:

"""Search the media player."""

# search for the requested media on your library client.

result = await my_client.search(query=query.search_query)

return SearchMedia(result=result)

The SearchMediaQuery is a dataclass with the following properties:
AttributeTypeDefaultDescriptionsearch_querystrrequiredThe search string or query.media_content_typeMediaType | str | NoneNoneThe content type to search inside.media_content_idstr | NoneNoneThe content ID to search inside.media_filter_classeslist[MediaClass] | NoneNoneList of media classes to filter.

Select sound mode​

Optional. Switch the sound mode of the media player.

class MyMediaPlayer(MediaPlayerEntity):

# Implement one of these methods.

def select_sound_mode(self, sound_mode: str) -> None:

"""Switch the sound mode of the entity."""

async def async_select_sound_mode(self, sound_mode: str) -> None:

"""Switch the sound mode of the entity."""

Select source​

Optional. Switch the selected input source for the media player.

class MyMediaPlayer(MediaPlayerEntity):

# Implement one of these methods.

def select_source(self, source: str) -> None:

"""Select input source."""

async def async_select_source(self, source: str) -> None:

"""Select input source."""

Mediatype​

Required. Returns one of the values from the MediaType enum that matches the mediatype
CONSTMediaType.MUSICMediaType.TVSHOWMediaType.MOVIEMediaType.VIDEOMediaType.EPISODEMediaType.CHANNELMediaType.PLAYLISTMediaType.IMAGEMediaType.URLMediaType.GAMEMediaType.APP

class MyMediaPlayer(MediaPlayerEntity):

# Implement the following method.

@property

def media_content_type(self) -> MediaType | str | None:

"""Content type of current playing media."""

info

Using the integration name as the media_content_type is also acceptable within the play_media service action if the integration provides handling which does not map to the defined constants.

Available device classes​

Optional. What type of media device is this. It will possibly map to google device types.
ValueDescriptionprojectorDevice is a projector type device.receiverDevice is audio video receiver type device taking audio and outputting to speakers and video to some display.speakerDevice is speakers or stereo type device.tvDevice is a television type device.

Proxy album art for media browser​

Optional. If your media player is only accessible from the internal network, it will need to proxy the album art via Home Assistant to be able to work while away from home or through a mobile app.

To proxy an image via Home Assistant, set the thumbnail property of a BrowseMedia item to a url generated by the self.get_browse_image_url(media_content_type, media_content_id, media_image_id=None) method. The browser will then fetch this url, which will result in a call to async_get_browse_image(media_content_type, media_content_id, media_image_id=None).

info

Only use a proxy for the thumbnail if the web request originated from outside the network. You can test this with is_local_request(hass) imported from homeassistant.helpers.network.

In async_get_browse_image, use self._async_fetch_image(url) to fetch the image from the local network. Do not use self._async_fetch_image_from_cache(url) which should only be used to for the currently playing artwork.

info

Do not pass a URL as media_image_id. This can allow an attacker to fetch any data from the local network.

class MyMediaPlayer(MediaPlayerEntity):

# Implement the following method.

async def async_get_browse_image(

self,

media_content_type: str,

media_content_id: str,

media_image_id: str | None = None,

) -> tuple[bytes | None, str | None]:

"""Serve album art. Returns (content, content_type)."""

image_url = ...

return await self._async_fetch_image(image_url)

Grouping player entities together​

Optional. If your player has support for grouping player entities together for synchronous playback (indicated by MediaPlayerEntityFeature.GROUPING) one join and one unjoin method needs to be defined.

class MyMediaPlayer(MediaPlayerEntity):

# Implement one of these join methods:

def join_players(self, group_members: list[str]) -> None:

"""Join `group_members` as a player group with the current player."""

async def async_join_players(self, group_members: list[str]) -> None:

"""Join `group_members` as a player group with the current player."""

# Implement one of these unjoin methods:

def unjoin_player(self) -> None:

"""Remove this player from any group."""

async def async_unjoin_player(self) -> None:

"""Remove this player from any group."""

Properties
Supported features
States
Methods
Play media
Browse media
Search media
Select sound mode
Select source
Mediatype
Available device classes
Proxy album art for media browser
Grouping player entities together

## Related

- [[entity-home-assistant-developer-docs]]
