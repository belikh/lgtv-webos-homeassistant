---
title: com.webos.service.audio | webOS Open Source Edition
id: comwebosserviceaudio-webos-open-source-edition
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:16:54.657951Z'
source: https://www.webosose.org/docs/reference/ls2-api/com-webos-service-audio/
source_domain: www.webosose.org
fetched_at: '2026-08-28T02:16:53.683908Z'
fetch_provider: builtin
status: draft
type: note
deprecated: false
summary: com.webos.service.audio | webOS Open Source Edition
---

com.webos.service.audio | webOS Open Source Edition

Overview
Guides
Tutorials
Reference
Tools
IoT

Menu

Reference
LS2 API Reference
LS2 API Index
com.palm.service.tellurium
com.webos.appInstallService
com.webos.bootManager
com.webos.media
com.webos.notification
com.webos.pipeline.camera
com.webos.pipeline.record
com.webos.service.activitymanager
com.webos.service.ai.voice
com.webos.service.alarm
com.webos.service.applicationmanager
com.webos.service.audio
com.webos.service.audiofocusmanager
com.webos.service.audiooutput
com.webos.service.avoutput
com.webos.service.bluetooth2
com.webos.service.bugreport
com.webos.service.bus
com.webos.service.camera2
com.webos.service.cec
com.webos.service.config
com.webos.service.configurator
com.webos.service.connectionmanager
com.webos.service.contextintentmgr
com.webos.service.db
com.webos.service.devmode
com.webos.service.downloadmanager
com.webos.service.filecache
com.webos.service.hfp
com.webos.service.ime
com.webos.service.intent
com.webos.service.location
com.webos.service.mediacontroller
com.webos.service.mediaindexer
com.webos.service.mediarecorder
com.webos.service.memorymanager
com.webos.service.nettools
com.webos.service.pdm
com.webos.service.peripheralmanager
com.webos.service.power2
com.webos.service.preferences
com.webos.service.rosbridge
com.webos.service.sdkagent
com.webos.service.settings
com.webos.service.sleep
com.webos.service.storageaccess
com.webos.service.systemservice
com.webos.service.tempdb
com.webos.service.tts
com.webos.service.unifiedsearch
com.webos.service.uwb
com.webos.service.videooutput
com.webos.service.webappmanager
com.webos.service.wifi
com.webos.surfacemanager
WebOSServiceBridge API Reference
WebOSServiceBridge API Reference
webos-service Library
webos-service Library API Reference
luna-service2 Library
luna-service2 Library API Reference
luna-service2++ Library
luna-service2++ Library API Reference
pmloglib Library
pmloglib Library API Reference
uMediaClient API Reference
uMediaClient API Reference

com.webos.service.audio

Note
This API has been supported since API level 11.
API Summary

Controls the audio policy of a webOS system. Implements audio routing (sending audio streams to the proper destinations) and setting volumes in different scenarios.
Its functionality is categorized into the following modules:
Master: Controls the master volume of audio output devices.
UMI: Handles connections and manages volume for audio resources, when playing audio from applications like YouTube.
System: Controls audio policy for DTMF (touch tones), alarm, calendar, and effects.
Media: Controls audio policy for media playback.
Ringtone: Controls audio policy for ringtones.
Alert: Controls audio policy for alerts.
In addition, there is a soundSettings category, to manage sound settings such as setting the output device for the audio.
Note: [ Applicable for Master, UMI, and SoundSettings ] The audio service calls the audiooutput service to communicate with the audio hardware layer.
Overview of the API

-NA-
Methods

UMI/connect

ACG: audio.operation

Added: API level 11
Description
Establishes connection for the audio resource.
Parameters

Name
Required
Type
DescriptionoutputModeRequiredString
Indicates the audio output device.
Possible values are:
alsaaudioTypeRequiredString
Indicates the type of the audio stream.
Possible values are:
umimediasinkRequiredString
Indicates the audio sink.
Possible values are:
ALSAsourceRequiredString
Indicates the audio source.
Possible values are:
AMIXERsourcePortRequiredNumber
Audio source port.
Possible values are:
0 ~ 7: For AMIXER source.contextOptionalString
Indicates the audio pipeline ID.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.sourceOptionalString
Indicates the audio source.sinkOptionalString
Indicates the audio sink.
Examples

Example code

# luna-send -f -n 1 luna://com.webos.service.audio/UMI/connect '{
"outputMode":"alsa",
"audioType":"umimedia",
"sink":"ALSA",
"source":"AMIXER",
"sourcePort":0
}'
Response: For successful call
{
"source": "AMIXER",
"sink": "ALSA",
"returnValue": true
}

Example scenario

# luna-send -f -n 1 luna://com.webos.service.audio/UMI/connect '{
"outputMode":"alsa",
"audioType":"umimedia",
"sink":"ALSA",
"source":"AMIXERTEST",
"sourcePort":0
}'
Response: For failed call
{
"errorCode": 4,
"returnValue": false,
"errorText": "Invalid parameters"
}

Example scenario

# luna-send -f -n 1 luna://com.webos.service.audio/UMI/connect '{
"outputMode":"alsa",
"audioType":"radio",
"sink":"ALSA",
"source":"AMIXER",
"sourcePort":0
}'
Response: For successful call
{
"source": "AMIXER",
"sink": "ALSA",
"returnValue": true
}
UMI/disconnect

ACG: audio.operation

Added: API level 11
Description
Disconnects the connection.
Parameters

Name
Required
Type
DescriptionsinkRequiredString
Indicates the audio sink.
Possible values are:
ALSAsourceRequiredString
Indicates the audio source.
Possible values are:
AMIXERsourcePortRequiredNumber
Audio source port.
Possible values are:
0~ 7: For AMIXER sourceaudioTypeRequiredString
Indicates the audio stream type.
Possible values are:
umimediacontextOptionalString
Indicates the audio pipeline ID.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).sourceRequiredString
Indicates the audio source.sinkRequiredString
Indicates the audio sink.
Examples

Example code

# luna-send -f -n 1 luna://com.webos.service.audio/UMI/disconnect '{
"sink":"ALSA",
"source":"AMIXER",
"sourcePort":0,
"audioType":"umimedia"
}'
Response: For successful call
{
"source": "AMIXER",
"sink": "ALSA",
"returnValue": true
}
UMI/getStatus

ACG: audio.query

Added: API level 11
Description
Shows the connection status of audio resources.
Parameters
None
Call Returns

Name
Required
Type
DescriptionaudioRequiredObject array: audio
Audio connection details.returnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Successful.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).
Examples

Example code

# luna-send -f -n 1 luna://com.webos.service.audio/UMI/getStatus '{}'
Response: For successful call
{
"audio": [
{
"source": "AMIXER",
"sink": "ALSA",
"muted": false,
"outputMode": "alsa"
}
],
"returnValue": true
}
UMI/mute

ACG: audio.operation

Added: API level 11
Description
Mutes or unmutes the input volume of the requested connection.
Note: This method is added for future-use. It does not have any impact on the audio setting.
Parameters

Name
Required
Type
DescriptionsinkRequiredString
Audio sink.
Possible values are:
ALSAsourceRequiredString
Audio source.
Possible values are:
AMIXERsourcePortRequiredNumber
Audio source portmuteRequiredBoolean
Indicates if the input volume is to be muted. Possible values are:
true - If the input volume is to be muted.
false - If the input volume is not to be muted.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Successful.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).
Examples

Example code

# luna-send -n 1 -f luna://com.webos.service.audio/UMI/mute '{
"sink":"ALSA",
"source":"AMIXER",
"sourcePort":0,
"mute":true
}'
Response: For successful call
{
"returnValue": true
}

Example scenario

# luna-send -n 1 -f luna://com.webos.service.audio/UMI/mute '{
"sink":"ALSA",
"source":"AMIXER",
"sourcePort":0,
"mute":false
}'
Response: For successful call
{
"returnValue": true
}
checkAudioEffectStatus

ACG: audio.query

Added: API level 21
Description
Check the status of an audio effect.
Parameters

Name
Required
Type
DescriptioneffectNameRequiredString
Audio effect name. Possible values are:
speech enhancement
gain control
beamforming
dynamic compressor
equalizer
bass boost
Call Returns

Name
Required
Type
DescriptionenabledOptionalBoolean
Indicates the current state of the audio effect. Possible values are:
true: Audio effect is enabled.
false: Audio effect is not enabled.returnValueRequiredBoolean
Indicates the status of the operation. Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'Error Codes' section of this method for details.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Invalid number of input parameters against defined schema of the method15Audiod Internal Error
Internal error19Invalid parameters
Invalid parameters error
Examples

Example : Checks the status of the speech enhancement audio effect

# luna-send -f -n 1 luna://com.webos.service.audio/checkAudioEffectStatus '{"effectName":"speech enhancement"}'
Response:
{
"returnValue": true,
"enabled": true,
}

Example : Checks the status of the gain control audio effect

# luna-send -f -n 1 luna://com.webos.service.audio/checkAudioEffectStatus '{"effectName":"gain control"}'
Response:
{
"returnValue" : true,
"enabled": true
}

Example : Checks the status of the beamforming audio effect

# luna-send -f -n 1 luna://com.webos.service.audio/checkAudioEffectStatus '{"effectName":"beamforming"}'
Response:
{
"returnValue" : true,
"enabled": true
}

Example : Checks the status of the dynamic compressor audio effect

# luna-send -f -n 1 luna://com.webos.service.audio/checkAudioEffectStatus '{"effectName":"dynamic compressor"}'
Response:
{
"returnValue" : true,
"enabled": true
}

Example : Checks the status of the equalizer audio effect

# luna-send -f -n 1 luna://com.webos.service.audio/checkAudioEffectStatus '{"effectName":"equalizer"}'
Response:
{
"returnValue" : true,
"enabled": true
}

Example: Check the status of the bass boost audio effect

# luna-send -f -n 1 luna://com.webos.service.audio/checkAudioEffectStatus '{"effectName":"bass boost"}'
Response:
{
"returnValue" : true,
"enabled": true
}
controlPlayback

ACG: audio.management

Added: API level 29
Description
Controls playback operations like stop, pause/resume for audio samples that are played using the playSound method.
Parameters

Name
Required
Type
DescriptionplaybackIdRequiredString
Playback ID of the played stream.requestTypeRequiredString
Audio control type.
Possible formats are:
pause
resume
stop
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'API Error Codes Reference' section for details.
Error Codes Reference

Error Code
Error Text
Error Description1, 15, 21Depends on error code
See the 'API Error Codes Reference' table for detailed information on relevant error code.
Examples

Example scenario

# luna-send -n 1 luna://com.webos.service.audio/controlPlayback '{"playbackId":"_utg7654h",  "requestType":"stop" }'
Response:
{
"returnValue":true
}
getAudioEffectList

ACG: audio.query

Added: API level 21
Description
Lists all the supported audio effects.
Parameters
None
Call Returns

Name
Required
Type
DescriptionaudioEffectListOptionalString array
List of the available audio effects. Possible values are:
speech enhancement
gain control
beamforming (not listed if none of the array microphones support beamforming)
dynamic compressor
equalizer
bass boostreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'API Error Codes Reference' section for details.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Invalid number of input parameters against defined schema of the method15Audiod Internal Error
Internal error
Examples

Example : Lists the supported audio effects

# luna-send -f -n 1 luna://com.webos.service.audio/getAudioEffectList '{}'
Response:
{
"returnValue" : true
"audioEffectList": [
"speech enhancement",
"gain control",
"beamforming",
"dynamic compressor",
"equalizer"
"bass boost"
]
}
getAudioEffectsStatus

ACG: audio.query

Added: API level 24
Description
Gets the status of all the audio effects.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Subscribe for notifications on changes to the status of audio effects. Possible values are:
true: Subscribed.
false: (default) Not subscribed.
Call Returns

Name
Required
Type
DescriptionsubscribedOptionalBoolean
Indicates if subscribed to get notifications. Possible values are:
true: Subscribed.
false: Not subscribed.returnValueRequiredBoolean
Indicates the status of the operation. Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'Error Codes' section of this method for details.statusOptionalObject array: effectStatus
Indicates status of audio effects.
Subscription Returns

Name
Required
Type
DescriptionsubscribedRequiredBoolean
Indicates if subscribed to get notifications.statusRequiredObject array: effectStatus
Indicates status of audio effects.returnValueRequiredBoolean
Indicates status of the operation.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Input parameters provided are incorrect.15Audiod Internal Error
Internal error
Examples

Example scenario

# luna-send -f -n 1 luna://com.webos.service.audio/getAudioEffectsStatus '{"subscribe":false }'
Response:
{
"subscribed": false,
"returnValue": true,
"status": [
{
"name": "speech enhancement",
"enabled": false
},
{
"name": "gain control",
"enabled": false
},
{
"name": "beamforming",
"enabled": false
},
{
"name": "dynamic compressor",
"enabled": false
},
{
"name": "equalizer",
"enabled": false
},
{
"name": "bass boost",
"enabled": false
}
]
}
getInputVolume

ACG: audio.query

Added: API level 12
Description
Gets the input volume for audio streams.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Indicates if subscribed to get the notifications.
Possible values are:
true: Subscribed to get notifications.
false: Not subscribed (default).streamTypeRequiredString
Indicates the stream name of the input volume to be received.
Possible values are:
palerts
pfeedback
pringtones
pmedia
pdefaultapp
peffects
pvoicerecognition
ptts
default1
default2
tts1
tts2
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.subscribedOptionalBoolean
Indicates if the input volume is subscribed to get the notifications.
Possible values are:
true: Subscribed to get notifications.
false: Not subscribed.streamTypeOptionalString
Indicates the stream name of the input volume to be applied. Check "Parameters" section for list of possible values.volumeOptionalNumber
Returns the value of applied volume in case of success.
Possible range: 0-100errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation.
Subscription Returns

Name
Required
Type
DescriptionsubscribedOptionalBoolean
Indicates if the input volume is subscribed to get the notifications.
Possible values are:
true: Subscribed for notifications.
false: Not subscribed.returnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.
streamTypeOptionalString
Indicates the stream name of the input volume to be applied. Check "Parameters" section for list of possible values.volumeOptionalNumber
Returns the value of applied volume in case of success.
Possible range: 0-100errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Error occurs due to wrong json request.15Audiod Internal Error
Internal error17Audiod Unknown Stream
A wrong streamType is requested.
Examples

Example scenario

# luna-send -i -f luna://com.webos.service.audio/getInputVolume '{
"streamType":"default1",
"subscribe":true
}'
Response:
{
"subscribed":true,
"volume":100,
"streamType":"default1",
"returnValue":true
}
getPlaybackStatus

ACG: audio.previlagequery

Added: API level 29
Description
Checks the status of playback which is played using playSound method.
Parameters

Name
Required
Type
DescriptionplaybackIdRequiredString
Playback ID of the played stream.subscribeOptionalBoolean
Subscribe for notifications on changes.
Possible values are:
true: Subscribed.
false: (default) Not subscribed.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.subscribedOptionalBooleanIndicates if subscribed to get notifications.playbackStatusOptionalString
Playback status.
Possible values are
playing
paused
stoppederrorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'API Error Codes Reference' section for details.
Subscription Returns

Name
Required
Type
DescriptionsubscribedRequiredBoolean
Indicates if subscribed to get notifications.playbackStatusRequiredString
Playback status.returnValueRequiredBoolean
Indicates the status of the operation.
Error Codes Reference

Error Code
Error Text
Error Description1, 15, 21Depends on error code
See the 'API Error Codes Reference' table for detailed information on relevant error code.
Examples

Example scenario

#luna-send -n 1 luna://com.webos.service.audio/getPlaybackStatus '{ "playbackId":"_utg7654h", "subscribe":false }'
Response:
{
"returnValue":true,
"playbackStatus" : "playing",
"subscribed": false
}
getSoundInput

ACG: audio.query

Added: API level 13
Description
Gets the current active sound input device.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalString
Subscribe for notifications on changes in the sound input device.
Possible values are:
true: Subscribed.
false: Not subscribed.displayIdOptionalNumber
Display ID with which the sound input device is associated.
Possible values are:
0
1
Call Returns

Name
Required
Type
DescriptionsoundInputOptionalString
The active sound input device.returnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.subscribedOptionalBoolean
Indicates if subscribed to get notifications.displayIdOptionalNumber
The display ID with which the sound input device is associated.
Subscription Returns

Name
Required
Type
DescriptionsoundInputRequiredString
The active sound input device.returnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.subscribedRequiredBoolean
Indicates whether the request is subscription or notdisplayIdRequiredNumber
The display ID with which the sound input device is associated.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Error occurs due to wrong JSON request.15Audiod internal error
Error occurs due to insufficient resource availability in Audiod.
Examples

Example

# luna-send -n 1 luna://com.webos.service.audio/getSoundInput '{}'
Response:
{
"subscribed":false,
"displayId":0,
"returnValue":true,
"soundInput":"pcm_input"
}
getSoundOutput

ACG: audio.query

Added: API level 13
Description
Gets the current active sound output device.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Subscribe for notifications on changes in the sound output device.
Possible values are:
true: Subscribed.
false (Default): Not subscribed.displayIdOptionalNumber
The display ID with which the sound output device is associated.
Possible values are:
0
1
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).soundOutputOptionalString
Current sound output.
Possible values are:
tv_speaker
external_optical
external_arc
lineout
headphone
tv_external_speaker
tv_speaker_headphone
alsa
wisa_speaker
lgSoundSyncsubscribedOptionalBoolean
Indicates if subscribed to get the notifications.displayIdOptionalNumber
The display ID with which the sound output device is associated.
Subscription Returns

Name
Required
Type
DescriptionsoundOutputOptionalString
Audio output device.subscribedRequiredBoolean
Indicates if subscribed to get the notifications.displayIdOptionalNumber
The display ID with which the sound output device is associated.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Error occurs due to wrong JSON request.15Audiod internal error
Error occurs due insufficient resource availability in Audiod.
Examples

Example

# luna-send -n 1 -f luna://com.webos.service.audio/getSoundOutput '{"subscribe":false}'
Response:
{
"subscribed": false,
"returnValue": true,
"displayId": 0,
"soundOutput": "pcm_output"
}
getSourceInputVolume

ACG: audio.query

Added: API level 13
Description
Gets input volume of the source.
Parameters

Name
Required
Type
DescriptionsourceTypeRequiredString
The source for which volume is required.
Possible values are:
record
btcallsource
alexa
webcall
voiceassistancesubscribeOptionalBoolean
Subscribe for notifications on changes in the source volume.
Possible values are:
true: Subscribed.
false (Default): Not subscribed.
Call Returns

Name
Required
Type
DescriptionsubscribedRequiredBoolean
Indicates if subscribed to get notifications.sourceTypeRequiredString
The source for the volume.returnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.volumeRequiredNumber
The source volume.
Subscription Returns

Name
Required
Type
DescriptionsubscribedRequiredBoolean
Indicates if subscribed to get notifications.sourceTypeRequiredString
The source for the volume.returnValueRequiredBoolean
Indicates the status of the operation.volumeRequiredNumber
The source volume.
Error Codes Reference

Error Code
Error Text
Error Description1Audiod invalid schema
Error occurs due to wrong JSON request.15Audiod internal error
Error occurs due to insufficient resource availability.23AAudiod Unknown Source
Error occurs due to wrong sourceType requested.
Examples

Example : Without subscription

# luna-send -n -i luna://com.webos.service.audio/getSourceInputVolume '{"sourceType":"record"}'
Response:
{
"subscribed":false,
"returnValue":true,
"sourceType":"record",
"volume":100
}

Example : With subscription

# luna-send -n -i luna://com.webos.service.audio/getSourceInputVolume '{"sourceType":"record","subscribe":true}'
Response:
{
"subscribed":true,
"returnValue":true,
"sourceType":"record",
"volume":100
}
Subscription Response:
{
"subscribed":true,
"returnValue":true,
"sourceType":"record",
"volume":75
}
getSourceStatus

ACG: audio.query

Added: API level 13
Description
Gets the status of the source.
Parameters

Name
Required
Type
DescriptionsourceTypeOptionalString
Type of source.
Note: If not specified, all active source details are provided.
Possible values are:
record
btcallsource
alexa
webcall
voiceassistancesubscribeOptionalBoolean
Subscribe for notifications on changes in the source.
Possible values are:
true: Subscribed.
false (Default): Not subscribed.
Call Returns

Name
Required
Type
DescriptionsubscribedRequiredBoolean
Indicates if subscribed to get notifications.returnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.sourceObjectRequiredObject array: sourceObject
The list of active source connections.
Subscription Returns

Name
Required
Type
DescriptionsubscribedRequiredBoolean
Indicates if subscribed to get notifications.sourceObjectRequiredObject array: sourceObject
The list of active source connections.returnValueRequiredBoolean
Indicates the status of the operation.
Error Codes Reference

Error Code
Error Text
Error Description1Audiod invalid schema
Error occurs due to wrong JSON request.15Audiod internal error
Error occurs due insufficient resource availability in Audiod.23Audiod Unknown Source
Error occurs due to wrong sourceType requested.
Examples

Example : Without sourceType and with subscription

# luna-send -n 1 luna://com.webos.service.audio/getSourceStatus '{"subscribe":true}'
Response:
{
"subscribed": true,
"returnValue": true,
"sourceObject": [
]
}

Example : With sourceType and without subscription

# luna-send -n 1 -f luna://com.webos.service.audio/getSourceStatus '{"sourceType":"record"}'
Response:
{
"subscribed": false,
"returnValue": true,
"sourceObject": [
{
"source": "source",
"sink": "sink",
"activeStatus": true,
"muteStatus": false,
"sourceType": "record",
"inputVolume": 100,
"policyStatus": false
}
]
}
getStreamStatus

ACG: audio.query

Added: API level 12
Description
Gets the status and information of the active stream.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Indicates if subscribed to get the notifications.
Possible values are:
true: Subscribed.
false (Default): Not subscribed.streamTypeOptionalString
Indicates the type of the stream.
Note: If not specified, all active stream details are provided.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.subscribedRequiredBoolean
Indicates if subscribed to get the notifications.streamObjectRequiredObject array: streamObject
Indicates the list of active connections.
Subscription Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.subscribedRequiredBoolean
Indicates if subscribed to get the notifications.streamObjectRequiredObject array: streamObject
Indicates the list of active connections.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Error occurs due to wrong json request.15Audiod Internal Error
Internal error17Audiod Unknown Stream
A wrong streamType is requested.
Examples

Example : With subscription

# luna-send -i -f luna://com.webos.service.audio/getStreamStatus '{
"streamType":"default1",
"subscribe":true
}'
Response:
{
"streamObject":[
{
"policyStatus":false,
"source":"source",
"inputVolume":100,
"muteStatus":false,
"sink":"sink",
"streamType":"default1",
"activeStatus":true
}
],
"subscribed":true,
"returnValue":true
}
listSupportedDevices

ACG: audio.query

Added: API level 20
Description
Gets the list of supported audio input and output devices and their connection status.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Subscribe for notifications on changes.
Possible values are:
true: Subscribed.
false: Not subscribed.queryOptionalString
Requested category of sound devices.
Possible values are:
input
output
all (default)
Call Returns

Name
Required
Type
DescriptionsubscribedOptionalBoolean
Indicates if subscribed to get notifications.returnValueRequiredBoolean
Indicates the status of the request.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'Error Codes' section of the method for details.deviceListOptionalObject array: deviceList
List of input and output devices.
Subscription Returns

Name
Required
Type
DescriptionsubscribedRequiredBoolean
Indicates if subscribed to get notifications.deviceListRequiredObject array: deviceList
List of input and output devices.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Invalid number of input parameters against defined schema of the method15Audiod Internal Error
Internal error21Invalid Parameter
Invalid query provided Wrong value for query parameter.
Examples

Example : List supported input and output devices

# luna-send –n –i luna://com.webos.service.audio/listSupportedDevices '{"subscribe":true,"query":"all"}'
Response:
{
"returnValue" : true,
"subscribed" : true,
"deviceList" : [
{
"type" : "output",
"deviceType" : "internal",
"deviceName": "pcm_output",
"deviceNameDetail" : "bcm HDMI",
"connected" : true,
"displayId" :  0,
"active": true,
"deviceIcon": "audio-card"
},
{
"type" : "output",
"deviceType" : "internal",
"deviceName": "pcm_output1",
"deviceNameDetail" : "bcm HDMI",
"connected" : true,
"displayId" :  1,
"active": true,
"deviceIcon": "audio-card"
},
{
"type" : "output",
"deviceType" : "internal",
"deviceName": "pcm_headphone",
"deviceNameDetail" : "bcm HDMI",
"connected" : true,
"displayId" :  0,
"active": false,
"deviceIcon": "audio-card"
},
{
"type" : "output",
"deviceType" : "external",
"deviceName": "bluetooth_speaker0",
"deviceNameDetail" : "bluetooth_speaker0",
"connected" : false,
"displayId" :  0,
"active": false,
"deviceIcon": ""
},
{
"type" : "output",
"deviceType" : "external",
"deviceName": "usb_speaker0",
"deviceNameDetail" : "usb_speaker0",
"connected" : false,
"displayId" :  0,
"active": false,
"deviceIcon": ""
},
{
"type" : "output",
"deviceType" : "external",
"deviceName": "usb_speaker1",
"deviceNameDetail" : "usb_speaker1",
"connected" : false,
"displayId" :  0,
"active": false,
"deviceIcon": ""
},
{
"type" : "input",
"deviceType" : "external",
"deviceName": "usb_mic0",
"deviceNameDetail" : "usb_mic0",
"connected" : false,
"displayId" :  0,
"active": false,
"deviceIcon": ""
},
{
"type" : "input",
"deviceType" : "external",
"deviceName": "usb_mic1",
"deviceNameDetail" : "usb_mic1",
"connected" : false,
"displayId" :  0,
"active": false,
"deviceIcon": ""
}
]
}
master/getMicVolume

ACG: audio.query

Added: API level 20
Description
Gets volume of currently active microphone input.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Subscribe for notifications on changes. Possible values are:
true: Subscribed.
false: Not subscribed.displayIdOptionalNumber (int8_t)
The display associated with the microphone. Possible values are:
0 (default value)
1soundInputOptionalString
Indicates the audio input device. Possible values are:
usb_mic0
usb_mic1
pcm_input (available only for OSE Emulator)
Call Returns

Name
Required
Type
DescriptionsubscribedOptionalBooleanIndicates if subscribed to get notifications.returnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'Error Codes' section of the method for details.soundInputOptionalString
Input device name.
Possible values are:
usb_mic0
usb_mic1
pcm_input (Applicable only for OSE Emulator)volumeOptionalNumber (int8_t)
Device volume.
Possible values 0 - 100.muteStatusOptionalBoolean
Mute status of input device.
Possible values are:
true: Device is muted.
false: Device is not muted.
Subscription Returns

Name
Required
Type
DescriptionsubscribedOptionalBooleanIndicates if subscribed to get notifications.returnValueOptionalBoolean
Indicates the status of the operation.soundInputOptionalString
Input device name.
Possible values are:
usb_mic0
usb_mic1
pcm_inputvolumeOptionalNumber (int8_t)
Device volume.
Possible values 0 - 100.muteStatusOptionalString
Mute status of input device.
Possible values are:
true: Device is muted.
false: Device is not muted.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Invalid number of input parameters against defined schema of the method15Audiod Internal Error
Internal error20DisplayId Not in Range
Wrong displayId parameter supplied204Volume control is not supported
Invalid sound input value given
Examples

Example : Get volume of active mic input for display 0

#luna-send –n 1 luna://com.webos.service.audio/master/getMicVolume '{}'
Response:
{
"returnValue":true,
"subscribed":false,
"soundInput":"usb_mic0",
"volume":100,
"muteStatus":false
}
master/getVolume

ACG: audio.query

Added: API level 11
Description
Gives the current master volume of the audio output device.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribed.
false: Not subscribed.soundOutputOptionalString
Indicates the audio output device.
Possible values are:
alsa
pcm_output
pcm_output1
pcm_headphone
usb_speaker0
usb_speaker1
bluetooth_speaker0
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).volumeStatusRequiredObject: VolumeStatus
Indicates the status of volume for different audio output devices.callerIdRequiredString
Indicates the luna service name of the calling application.
Subscription Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).volumeStatusRequiredObject: VolumeStatus
Indicates the status of volume for different audio output devices.callerIdRequiredString
Indicates the luna service name of the calling application.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Invalid number of input parameters against defined schema of the method15Audiod Internal Error
Internal error204Volume control is not supported
Invalid sound input value given
Examples

Example : Get master volume

# luna-send -n i -f luna://com.webos.service.audio/master/getVolume '{"subscribe":true}'
Response:
{
"volumeStatus":{
"sessionId":0,
"muted":false,
"volume":100,
"soundOutput":"pcm_output"
},
"returnValue":true,
"callerId":"com.webos.lunasend-2027"
}
Subscription Response: After change volume for session 1
{
"volumeStatus":{
"sessionId":1,
"muted":false,
"volume":50,
"soundOutput":"pcm_output1"
},
"returnValue":true,
"callerId":"com.webos.lunasend-2057"
}
master/muteMic

ACG: audio.operation

Added: API level 20
Description
Mutes/unmutes the currently active microphone input device.
Parameters

Name
Required
Type
DescriptiondisplayIdOptionalNumber (int8_t)
The display associated with the microphone. Possible values are:
0 (default value)
1muteRequiredBoolean
Mute status of the device. Possible values are:
true: Muted.
false: Not muted.soundInputOptionalString
Indicates the audio input device. Possible values are:
usb_mic0
usb_mic1
pcm_input (available only for OSE Emulator)
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'Error Codes' section of the method for details.soundInputOptionalString
Input device name.
Possible values are:
usb_mic0
usb_mic1
pcm_input (Applicable only for OSE Emulator)muteOptionalBoolean
Device mute status.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Invalid number of input parameters against defined schema of the method15Audiod Internal Error
Internal Error20DisplayId Not in Range
Wrong displayId parameter supplied204Volume control is not supported
Invalid sound input value given
Examples

Example : Mute mic input device

# luna-send –n 1 luna://com.webos.service.audio/master/muteMic '{"soundInput":"usb_mic0","mute":true}'
Response:
{
"returnValue":true,
"soundInput":"usb_mic0",
"mute":true
}
master/muteVolume

ACG: audio.operation

Added: API level 11
Description
Mutes or unmutes the master volume of the audio output device.
Parameters

Name
Required
Type
DescriptionmuteRequiredBoolean
Indicates if the master volume is to be muted.
Possible values are:
true: Master volume to be muted.
false: Master volume not to be muted.sessionIdOptionalNumber
Indicates the display/session applicable to the operation.
Note: If not provided, the operation is applied to the audio device connected to both the displays/sessions.
Possible values are:
0
1soundOutputRequiredString
Indicates the audio output device.
Possible values are:
pcm_output
pcm_output1
pcm_headphone
usb_speaker0
usb_speaker1
bluetooth_speaker0
alsa
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.muteRequiredBoolean
Indicates if the master volume is on mute or not.
Possible values are:
true: Master volume is on mute.
false: Master volume is not on mute.soundOutputRequiredString
Indicates the audio output device.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Invalid number of input parameters against defined schema of the method15Audiod Internal error
Internal error19Invalid muteVolume Parameters requested
Wrong parameters in request20sessionId Not in Range
session id parameter wrong204"Volume control is not supported
Invalid sound output value given
Examples

Example: Mute volume for sessionId: 0

# luna-send -f -n 1 luna://com.webos.service.audio/master/muteVolume '{
"soundOutput":"pcm_output",
"mute":true,
"sessionId":0
}'
Response:
{
"mute": true,
"returnValue": true,
"soundOutput": "pcm_output"
}

Example: Mute volume for sessionId 1

# luna-send -f -n 1 luna://com.webos.service.audio/master/muteVolume '{
"soundOutput":"alsa",
"mute":true,
"sessionId":1
}'
Response:
{
"mute": true,
"returnValue": true,
"soundOutput": "alsa"
}

Example: Unmute volume for sessionId 1

# luna-send -f -n 1 luna://com.webos.service.audio/master/muteVolume '{
"soundOutput":"alsa",
"mute":false,
"sessionId":1
}'
Response:
{
"mute": false,
"returnValue": true,
"soundOutput": "alsa"
}
master/setMicVolume

ACG: audio.operation

Added: API level 20
Description
Sets the volume of the currently active microphone input device.
Parameters

Name
Required
Type
DescriptiondisplayIdOptionalNumber (int8_t)
The display associated with the microphone. Possible values are:
0 (default value)
1volumeRequiredNumber (int8_t)
The volume to be set.
Possible values : 0 - 100.soundInputOptionalString
Indicates the audio input device. Possible values are:
usb_mic0
usb_mic1
pcm_input (available only for OSE Emulator)
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'Error Codes' section of the method for details.soundInputOptionalString
Input device name.
Possible values are:
usb_mic0
usb_mic1
pcm_input  (Applicable only for OSE Emulator)volumeOptionalNumber (int8_t)
Device volume.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Invalid number of input parameters against defined schema of the method3SoundInput volume is not in range
Sound Input volume is not in range15Audiod Internal Error
Internal error20DisplayId Not in Range
Wrong displayId parameter supplied204Volume control is not supported
Invalid sound input value given
Examples

Example : Set volume as 50

#luna-send –n 1 luna://com.webos.service.audio/master/setMicVolume '{"soundInput":usb_mic0,"volume":50}'
Response:
{
"returnValue":true,
"soundInput":"usb_mic0",
"volume":50
}
master/setVolume

ACG: audio.operation

Added: API level 11
Description
Sets the master volume of the audio output device.
Parameters

Name
Required
Type
DescriptionsessionIdOptionalNumber
Indicates the display/session applicable to the operation.
Possible values are:
0 (Default)
1soundOutputRequiredString
Indicates the target sound output device.
Possible values are:
pcm_output
pcm_output1
pcm_headphone
usb_speaker0
usb_speaker1
bluetooth_speaker0
alsavolumeRequiredNumber
Indicates the volume level to be set.
The value can range from 0 to 100.
Call Returns

Name
Required
Type
DescriptionvolumeRequiredNumber
Indicates the current volume level.
The value can range from 0 to 100.soundOutputRequiredString
Indicates the target sound output device.returnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Successful.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Invalid number of input parameters against defined schema of the method3SoundOutput volume is not in range
Volume value not in range15Audiod Internal error
Internal error20sessionId Not in Range
session id parameter wrong204Volume control is not supported
Invalid sound output value given
Examples

Example: Set volume as 57 for sessionId 0

# luna-send -f -n 1 luna://com.webos.service.audio/master/setVolume '{
"soundOutput":"pcm_output",
"volume":57,
"sessionId":0
}'
Response:
{
"volume": 57,
"returnValue": true,
"soundOutput": "pcm_output"
}
master/volumeDown

ACG: audio.operation

Added: API level 11
Description
Reduces the master volume of the device.
Parameters

Name
Required
Type
DescriptionsoundOutputRequiredString
Indicates the audio output device.
Possible values are:
alsa
pcm_output
pcm_output1
pcm_headphone
usb_speaker0
usb_speaker1
bluetooth_speaker0 sessionIdOptionalNumber
Indicates the display/session applicable to the operation.
Possible values are:
0 (Default)
1
Call Returns

Name
Required
Type
DescriptionvolumeRequiredNumber
Indicates the current level of volume.
The value can range from 0 to 100.returnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Successful.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).soundOutputRequiredString
Indicates the audio sound output device.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Invalid number of input parameters against defined schema of the method15Audiod Internal error
Internal error19Invalid volumeDown Parameters requested
Wrong parameters in request20sessionId Not in Range
session id parameter wrong204Volume control is not supported
Invalid sound output value given
Examples

Example : Reduce the volume for sessionId 0

# luna-send -f -n 1 luna://com.webos.service.audio/master/volumeDown '{"soundOutput":"pcm_output", "sessionId":0}'
Response:
{
"volume": 11,
"returnValue": true,
"soundOutput": "pcm_output"
}

Example: Reduce the volume for sessionId 1

# luna-send -f -n 1 luna://com.webos.service.audio/master/volumeDown '{"soundOutput":"alsa", "sessionId":1}'
Response:
{
"volume": 49,
"returnValue": true,
"soundOutput": "alsa"
}
master/volumeUp

ACG: audio.operation

Added: API level 11
Description
Increases the master volume of the device.
Parameters

Name
Required
Type
DescriptionsessionIdOptionalNumber
Indicates the display/session applicable to the operation.
Possible values are:
0 (Default)
0soundOutputOptionalString
Indicates the audio output device
Possible values are:
alsa
pcm_output
pcm_output1
pcm_headphone
usb_speaker0
usb_speaker1
bluetooth_speaker0
Call Returns

Name
Required
Type
DescriptionvolumeRequiredNumber
Indicates the current level of volume.
The value can range from 0 to 100.returnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Successful.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).soundOutputRequiredString
Indicates the audio output device.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Invalid number of input parameters against defined schema of the method15Audiod Internal error
Internal error20sessionId Not in Range
session id parameter wrong204Volume control is not supported
Invalid sound output value given
Examples

Example: Increase the volume for sessionId 0

# luna-send -f -n 1 luna://com.webos.service.audio/master/volumeUp '{
"soundOutput":"pcm_output",
"sessionId":0
}'
Response:
{
"volume": 12,
"returnValue": true,
"soundOutput": "pcm_output"
}

Example: Increase the volume for sessionId 1

# luna-send -f -n 1 luna://com.webos.service.audio/master/volumeUp '{
"soundOutput":"alsa",
"sessionId":1
}'
Response:
{
"volume": 20
"returnValue": true,
"soundOutput": "alsa"
}
media/setVolume

ACG: audio.operation

Added: API level 11
Description
Sets the volume level of the current or the specified scenario.
Parameters

Name
Required
Type
DescriptionvolumeRequiredNumber
Indicates the volume level to be set.sessionIdOptionalNumber
Indicates the display/session to which the operation is applicable.
Possible values are:
0
1
Note: If not provided, the operation is applied to session 0.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "Error Codes" section of this method for details.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Wrong JSON message format2"Missing 'volume' integer parameter."
Mandatory Parameter  Volume  has to be specified3"failed to set parameter (invalid scenario name?)"
Volume for the scenario could not be set. Check for the validity of scenario3Invalid 'volume' integer parameter value or file not found.
Volume value is not valid. It should be  between 0 and 100.
Examples

Example: With volume

# luna-send -f -n 1 luna://com.webos.service.audio/media/setVolume '{"volume":10}'
Response:
{
"returnValue": true
}

Example: display1

# luna-send -f -n 1 luna://com.webos.service.audio/media/setVolume '{"volume":50, "sessionId":0}'
Response:
{
"returnValue": true
}

Example: display 2

# luna-send -f -n 1 luna://com.webos.service.audio/media/setVolume '{"volume":50, "sessionId":1}'
Response:
{
"returnValue": true
}
muteSink

ACG: audio.operation

Added: API level 13
Description
Mutes the sink volume.
Parameters

Name
Required
Type
DescriptionstreamTypeRequiredString
The sink to be muted.
Possible values are:
palerts
pfeedback
pringtones
pmedia
pdefaultapp
peffects
pvoicerecognition
ptts
default1
default2
tts1
tts2muteRequiredBoolean
Mute or unmute the sink.
Possible values are:
true: Mute the sink.
false: Unmute the sink.
Call Returns

Name
Required
Type
DescriptionstreamTypeOptionalString
The sink that is muted/unmuted.returnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the "errorCode" and "errorText" fields for details. See the "Error Codes" section of this method for details.muteOptionalBoolean
Indicates the mute status of the sink.errorTextOptionalString
The reason for the failure of the operation.errorCodeOptionalNumber
The error code for the failed operation.
Error Codes Reference

Error Code
Error Text
Error Description1Audiod invalid schema
Error occurs due to wrong JSON request.15Audiod internal error
Error occurs due insufficient resource availability in Audiod.17Audiod Unknown Source
A wrong streamType is requested.
Examples

Example : Mute the sink default1

# lluna-send -n 1 luna://com.webos.service.audio/muteSink '{"streamType":"default1","mute":true}'
Response:
{
"returnValue":true,
"streamType":"default1",
"mute":true
}
muteSource

ACG: audio.operation

Added: API level 13
Description
Mutes the source volume.
Parameters

Name
Required
Type
DescriptionsourceTypeRequiredString
The source to be muted.
Possible values are:
record
btcallsource
alexa
webcall
voiceassistancemuteRequiredBoolean
Mute or unmute the source.
Possible values are:
true: Mute the source.
false: Unmute the source.
Call Returns

Name
Required
Type
DescriptionsourceTypeRequiredString
The source that is muted/unmuted.returnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.muteRequiredBoolean
Indicates the mute status of the source.
Error Codes Reference

Error Code
Error Text
Error Description1Audiod invalid schema
Error occurs due to wrong JSON request.15Audiod internal error
Error occurs due insufficient resource availability in Audiod.23Audiod Unknown Source
Error occurs due to wrong sourceType requested.
Examples

Example

# luna-send -n 1 luna://com.webos.service.audio/muteSource '{"sourceType":"record","mute":true}'
Response:
{
"returnValue":true,
"sourceType":"record",
"mute":true
}
playSound

ACG: audio.management

Added: API level 12
Description
Plays PCM audio files through PulseAudio sound server.
Parameters

Name
Required
Type
DescriptionfileNameRequiredString
Indicates the absolute path of the PCM file to be played.sinkRequiredString
Indicates the virtual PulseAudio sink used by the application.
Possible values are:
default1
default2
tts1
tts2
palerts
pringtones
pdefaultapp
pmedia
peffects
ptts
pvoicerecognitionformatOptionalString
Indicates the sample format to be set.
Possible values are:
PA_SAMPLE_S16LE
PA_SAMPLE_S24LE
PA_SAMPLE_S32LE (Default)sampleRateOptionalNumber
Indicates the sample rate to be set.
Possible values are:
44100
48000 (Default)
32000
22050channelsOptionalNumber
Indicates the number of audio channels to be used while playing the file.
Possible values are:
1: mono
2 (Default): stereo
3
4
5
6
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.playbackIdRequiredString
Playback ID of the played stream.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Error occurs due to wrong json request.19Invalid file format
Invaild file format  provided 19Invalid virtual sink name
Invaild virtual sink name provided 19Invalid sample format
Invaild sample format provided 19Invalid channel count
Invaild channel count provided 19Invalid sample rate
Invaild sample rate provided
Examples

Example

# luna-send -n 1 luna://com.webos.service.audio/playSound '{
"fileName":"/usr/share/audiod/systemsounds/voicestart-ondemand.pcm",
"sink":"default1",
"sampleRate":48000,
"format":"PA_SAMPLE_S16LE",
"channels":2
}'
Response:
{
"returnValue":true,
"playbackId" : "_utg7654h"
}
registerTrack

ACG: audio.operation

Added: API level 16
Description
Registers a playback by an application/service and returns a track ID.
The track ID must be used to control the volume of that particular playback by using setTrackVolume().
Parameters

Name
Required
Type
DescriptionstreamTypeRequiredString
Type of the audio stream. Possible values are:
palerts
pfeedback
pringtones
pmedia
pdefaultapp
peffects
pvoicerecognition
ptts
default1
default2
tts1
tts2
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'API Error Codes Reference' section for details.trackIdOptionalString
Track ID of the registered playback.streamTypeOptionalString
Type of the audio stream.
Examples

Example : Register a track

# luna-send -n 1 -f luna://com.webos.service.audio/registerTrack '{"streamType":"default1"}
Response:
{
"trackId": "_OOWR1nOw9",
"returnValue": true
}
setAudioEffect

ACG: audio.operation

Added: API level 21
Description
Sets the status of an audio effect.
Parameters

Name
Required
Type
DescriptioneffectNameRequiredString
Audio effect name. Possible values are:
speech enhancement
gain control
beamforming
dynamic compressor
equalizer
bass boostenabledRequiredBoolean
Status of the audio effect. Possible values are:
true: Audio effect is enabled.
false: Audio effect is disabled.
Note: By default, all the audio effects are disabled.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation. Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'Error Codes' section of this method for details.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Invalid number of input parameters against defined schema of the method5SoundInput not connected
SoundInput device not available7AGC Already Enabled
AGC feature is already enabled15Audiod Internal Error
Internal Error19Invalid parameters
Invalid parameters error
Examples

Example : Enable speech enhancement effect

# luna-send -f -n 1 luna://com.webos.service.audio/setAudioEffect '{"effectName":"speech enhancement", "enabled":true}'
Response:
{
"returnValue": true
}

Example : Enable gain control effect

# luna-send -f -n 1 luna://com.webos.service.audio/setAudioEffect '{"effectName":"gain control", "enabled":true}'
Response:
{
"returnValue" : true
}

Example : Enable beamforming effect

# luna-send -f -n 1 luna://com.webos.service.audio/setAudioEffect '{"effectName":"beamforming", "enabled":true}'
Response:
{
"returnValue" : true
}

Example : Enable dynamic compressor effect

# luna-send -f -n 1 luna://com.webos.service.audio/setAudioEffect '{"effectName":"dynamic compressor", "enabled":true}'
Response:
{
"returnValue" : true
}

Example : Enable equalizer effect

# luna-send -f -n 1 luna://com.webos.service.audio/setAudioEffect '{"effectName":"equalizer", "enabled":true}'
Response:
{
"returnValue" : true
}

Example: Enable bass boost effect

# luna-send -f -n 1 luna://com.webos.service.audio/setAudioEffect '{"effectName":"bass boost", "enabled":true}'
Response:
{
"returnValue" : true
}
setAudioEqualizerBandLevel

ACG: audio.operation

Added: API level 25
Description
Sets the equalizer band level.
Parameters

Name
Required
Type
DescriptionbandRequiredNumber
Band index of the equalizer band.
Value range: [0, 5] (6 bands)levelRequiredNumber
New gain (in decibels) for the specified band.
Value range: [-10, 10]
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'API Error Codes Reference' section for details.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Incorrect parameters are provided.15Audiod Internal Error
Internal error19Invalid parameters
Invalid parameters error
Examples

Example : Set the equalizer band level

# luna-send -f -n 1 luna://com.webos.service.audio/setAudioEqualizerBandLevel '{"band":1, "level":-5}'
Response:
{
"returnValue" : true
}
setAudioEqualizerPreset

ACG: audio.operation

Added: API level 25
Description
Sets the equalizer preset value.
Parameters

Name
Required
Type
DescriptionpresetRequiredNumber
ID of equalizer preset.
Possible values are:
0: CLASSIC
1: JAZZ
2: POP
3: ROCK
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'API Error Codes Reference' section for details.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Incorrect parameters are provided.15Audiod Internal Error
Internal error19Invalid parameters
Invalid parameters error
Examples

Example: Set the equalizer preset

#luna-send -f -n 1 luna://com.webos.service.audio/setAudioEqualizerPreset '{"preset":1}'
Response:
{
"returnValue" : true
}
setInputVolume

ACG: audio.operation

Added: API level 12
Description
Sets the input volume for audio streams.
Parameters

Name
Required
Type
DescriptionstreamTypeRequiredString
Indicates the stream name of the input volume to be applied.
Possible values are:
palerts
pfeedback
pringtones
pmedia
pdefaultapp
peffects
pvoicerecognition
ptts
default1
default2
tts1
tts2volumeRequiredNumber
Indicates the volume to be applied.
The value can range from 0 to 100.rampOptionalBoolean
Indicates if the volume is to be applied in steps.
Possible values are:
true: Volume is applied in steps.
false (Default): Volume is not applied in steps.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.volumeRequiredNumber
Returns the value of applied volume in case of success.
The value can range from 0 to 100.streamTypeRequiredString
Returns the stream name of the volume applied.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Error occurs due to wrong json request.3Volume Not in Range
Error occurs due to invalid volume level.15Audiod Internal Error
Internal error17Audiod Unknown Stream
A wrong streamType is requested.
Examples

Example

# luna-send -n 1 luna://com.webos.service.audio/setInputVolume '{
"streamType":"default1",
"volume":50
}'
Response:
{
"volume":50,
"returnValue":true,
"streamType":"default1"
}
setSoundInput

ACG: audio.management

Added: API level 13
Description
Sets the sound input device for recording.
Parameters

Name
Required
Type
DescriptionsoundInputRequiredString
Sound input device.
Possible values are:
pcm_input: For AVN
usb_mic0
usb_mic1
usb_mic2
usb_mic3
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.soundInputRequiredString
The sound input device that is set.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Error occurs due to wrong JSON request.15Audiod internal error
Error occurs due to insufficient resource availability in Audiod.24Audiod Unknown sound input
Error occurs due to unsupported soundinput requested.
Examples

Example

# luna-send -n 1 luna://com.webos.service.audio/setSoundInput '{"soundInput":"pcm_input"}'
Response:
{
"returnValue":true,
"soundInput":"pcm_input"
}
setSoundOutput

ACG: audio.management

Added: API level 13
Description
Sets the sound output device.
Parameters

Name
Required
Type
DescriptionsoundOutputRequiredString
The audio output device.
Possible values are:
pcm_output
pcm_output1
usb_speaker0
bluetooth_speaker0
usb_speaker1
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).soundOutputRequiredString
The audio output device.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Invalid number of input parameters against defined schema of the method204Audiod Unknown soundOutput
Invalid sound output value given
Examples

Example

# luna-send -n 1 luna://com.webos.service.audio/setSoundOutput '{"soundOutput":"pcm_output"}'
Response:
{
"returnValue":true,
"soundOutput":"pcm_output"
}
setSourceInputVolume

ACG: audio.operation

Added: API level 13
Description
Sets input volume of the source.
Parameters

Name
Required
Type
DescriptionsourceTypeRequiredString
The source to which volume must be applied.
Possible values are:
record
btcallsource
alexa
webcall
voiceassistancevolumeRequiredNumber
The volume level to be applied to the source.
The value can range from 0 to 100.rampOptionalBoolean
Indicates if the volume is to be applied in steps.
Possible values are:
true: Applied in steps.
false (Default): Not applied in steps.
Call Returns

Name
Required
Type
DescriptionvolumeRequiredNumber
The updated volume level.sourceTypeRequiredString
The source to which the volume is set.returnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.
Error Codes Reference

Error Code
Error Text
Error Description1Audiod invalid schema
Error occurs due to wrong JSON request.3Volume Not in Range
Error occurs due to invalid volume level.15Audiod internal error
Error occurs due to insufficient resource availability in Audiod.23Audiod Unknown Source
Error occurs due to wrong sourceType requested.
Examples

Example

# luna-send -n 1 luna://com.webos.service.audio/setSourceInputVolume '{"sourceType":"record","volume":10}'
Response:
{
"returnValue":true,
"sourceType":"record",
"volume":10
}

Example

# luna-send -n 1 luna://com.webos.service.audio/setSourceInputVolume '{"sourceType":"record","volume":100, "ramp":false}'
Response:
{
"returnValue":true,
"sourceType":"record",
"volume":100
}
setTrackVolume

ACG: audio.operation

Added: API level 16
Description
Sets the volume for a specific playback that is identified by the track ID (obtained by using registerTrack()).
The effective playback volume is calculated as a percentage of the stream volume of the corresponding track.
Example 1:
Stream volume: 100
Track (playback) volume set using setTrackVolume(): 100
Effective volume of the track: 100 * 100/100 = 100
Example 2:
Stream volume: 80
Track (playback) volume set using setTrackVolume(): 100
Effective volume of the track: 80 * 100/100 = 80
Example 3:
Stream Volume: 40
Track (playback) volume set using setTrackVolume(): 50
Effective volume of the playback: 40 * 50/100 = 20
Parameters

Name
Required
Type
DescriptiontrackIdRequiredString
Track ID of the registered playback.volumeRequiredNumber
Volume level to be set. The valid volume range is 0-100
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'API Error Codes Reference' section for details.trackIdOptionalString
Track ID for which the volume is set.volumeOptionalNumber
Volume level that is set.streamTypeOptionalString
Type of audio stream.
Examples

Example : Set the playback volume

# luna-send -n 1 -f luna://com.webos.service.audio/setTrackVolume '{"trackId":"_rKjYAlq3r","volume":50}'
Response:
{
"returnValue": true,
"trackId": "_rKjYAlq3r",
"volume": 50,
"streamType": "default1"
}
soundSettings/setSoundOut

ACG: audio.management

Added: API level 11
Description
Sets the audio output device.
Parameters

Name
Required
Type
DescriptionsoundOutRequiredString
Indicates the audio output device.
Possible values are:
alsa
Call Returns

Name
Required
Type
DescriptionsoundOutRequiredString
Indicates the audio output device.
Possible values are:
alsareturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).
Examples

Example code

# luna-send -n 1 -f luna://com.webos.service.audio/soundSettings/setSoundOut '{"soundOut":"alsa"}'
Response: For successful call
{
"soundOut": "alsa",
"returnValue": true
}
systemsounds/playFeedback

ACG: audio.management

Added: API level 11
Description
Plays the various system alert sounds based on the name passed to it.
Parameters

Name
Required
Type
DescriptionnameRequiredString
Name of the system sound.sinkOptionalString
Sink to use to play sound (default: pfeedback).playOptionalBoolean
To preload and play the file, set play to true.
To preload but not to play the file, set play to false.
The default value of play is true.overrideOptionalBoolean
Override feedback sound.
Possible values are:
true: override feedback sound
false: (default) No override
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
If the method succeeds, returnValue will contain true.
If the method fails, returnValue will contain false.
Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Error occurs due to wrong json request.2Missing 'name' string parameter.
'name' parameter is missed.3Invalid 'name' string parameter value or file not found
Invalid 'name' parameter is provided.3Invalid 'sink' string parameter value or file not found.
Invalid 'sink' parameter is provided.
Examples

Example code

# luna-send -n 1 -f luna://com.webos.service.audio/systemsounds/playFeedback '{
"name":"voicestart",
"sink":"pfeedback",
"play":true
}'
Response:
{
"returnValue": true
}

Example scenario

# luna-send -n 1 -f luna://com.webos.service.audio/systemsounds/playFeedback '{
"name":"voicestart",
"sink":"pfeedback",
"play":false
}'
Response:
{
"returnValue": true
}

Example scenario

# luna-send -n 1 -f luna://com.webos.service.audio/systemsounds/playFeedback '{"name": "voicestart", "play":false}'
Response:
{
"returnValue": true
}

Example scenario

# luna-send -n 1 -f luna://com.webos.service.audio/systemsounds/playFeedback '{"name": "voicestart"}'
Response:
{
"returnValue": true
}

Example scenario

# luna-send -n 1 -f luna://com.webos.service.audio/systemsounds/playFeedback '{"name": "shutter"}'
Response:
{
"returnValue": true
}
udev/event

ACG: audio.management

Added: API level 11
Description
Gives the audiod information regarding the USB Mic/Headset Connected/Disconnected events based on the udev rules.
It also provides the sound card number and device number information.
Parameters

Name
Required
Type
DescriptioneventRequiredString
The event to be passed to audiod by the udev rule when USB soundcard is detected.It is a simple string defined by audiod. For example supported events are:
headset-removed
headset-inserted
headset-mic-inserted
usb-mic-inserted
usb-mic-removed
usb-headset-inserted
usb-headset-removedsoundcard_noOptionalNumber
Sound card number. As of now it is being extracted from the device path where USB sound card is detected by udev.device_noOptionalNumber
Device number. As of now it is being extracted from the device path where USB sound card is detected by udev.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
If the method succeeds, returnValue will contain true.
If the method fails, returnValue will contain false.
The method may fail because of one the error conditions described in the Error Codes Reference of this API.errorCodeOptionalNumber
errorCode contains the error code if the method fails. The method will return errorCode only if it fails.errorTextOptionalString
errorText contains the error text if the method fails. The method will return errorText only if it fails.
Examples

Example scenario

# luna-send -n 1 luna://com.webos.service.audio/udev/event '{"event":"headset-inserted"}'
Response:
{
"returnValue":true
}
unregisterTrack

ACG: audio.operation

Added: API level 16
Description
Unregisters a playback by an application/service.
Parameters

Name
Required
Type
DescriptiontrackIdRequiredString
Track ID of the registered playback.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'API Error Codes Reference' section for details.trackIdOptionalString
Track ID that is unregistered.
Examples

Example : Unregister a registered track

# luna-send -n 1 -f luna://com.webos.service.audio/unregisterTrack '{"trackId":"_OOWR1nOw9"}'
Response:
{
"returnValue": true,
"trackId": "_OOWR1nOw9"
}
Objects

VolumeStatus

Added: API level 29
Description
Provides the volume details of the target sound output device.
Properties

Name
Required
Type
DescriptionmutedRequiredBoolean
Indicates if the audio is on mute or not.
Possible values are:
true: Audio is on mute.
false: Audio is not on mute.volumeRequiredNumber
Indicates the current volume level.
Note: Returns a value only if the audio is not on mute.soundOutputRequiredString
Indicates the target sound output device.
Possible values:
pcm_output
pcm_output1
pcm_headphone
usb_speaker0
usb_speaker1
bluetooth_speaker0
alsasessionIdRequiredNumber
Indicates the volume status of the targeted display/session.
Possible values are:
0
1
audio

Added: API level 29
Description
Object returned by the UMI/getStatus.
Properties

Name
Required
Type
DescriptionsourceRequiredString
Indicates the audio source.
Possible values are:
AMIXERsinkRequiredString
Indicates the audio sink.
Possible values are:
ALSAmutedRequiredBoolean
Indicates if the audio is muted.
Possible values are:
true: If the audio is muted.
false: If the audio is not muted.outputModeRequiredString
Indicates the audio output device.
Possible values are:
ALSA
deviceList

Added: API level 29
Description
Provides information about all supported input and output devices and their type and connection status.
Properties

Name
Required
Type
DescriptiontypeRequiredString
Indicates if device is input or output device.
Possible values are:
input
outputdeviceTypeRequiredString
Indicates if the device is internal or external device.
Possible values are:
internal
externaldeviceNameRequiredString
Device name internal.​
Possible values are:
pcm_output
pcm_output1
pcm_headphone
bluetooth_speaker0
usb_speaker0
usb_speaker1deviceNameDetailRequiredString
Device full name.
Note: It is based on name of the device which will vary based on different sound cards.connectedRequiredBoolean
Indicates device connection status.
Possible values are:
true: Device is connected.
false: Device is not connected.displayIdRequiredNumber
Display id to which the device is associated.
Possible values are:
0
1activeRequiredBoolean
Status of the device.
Possible values are:
true: Device is active
false: Device is not activedeviceIconRequiredString
Name of the icon used for the device.
effectStatus

Added: API level 29
Description
Provides the name of the audio effects and their status.
Properties

Name
Required
Type
DescriptionnameRequiredString
Name of the audio effect.
Possible values are:
speech enhancement
gain control
beamforming
dynamic compressor
equalizer
bass boostenabledRequiredBoolean
Status of the audio effect.
Possible values are:
true: Audio effect is enabled.
false: Audio effect is disabled.
Note: By default, all the audio effects are disabled
sourceObject

Added: API level 29
Description
Indicates the list of active source connection
Properties

Name
Required
Type
DescriptionactiveStatusRequiredBoolean
Indicates whether the source is active.
Possible values are:
true: Source is active.
false: Source is not active.inputVolumeRequiredNumber
Indicates the input volume of the source.
The value can range from 0 to 100.muteStatusRequiredBoolean
Indicates if the audio is muted.
Possible values are:
true: Volume is muted.
false: Volume is not muted.policyStatusRequiredBoolean
Indicates if the policy for the sources is in progress.
Possible values are:
true: Policy is in progress.
false: Policy is not in progress.sinkRequiredString
Indicates the audio sink.
Possible values are:
MAIN
SUB
ALSAsourceRequiredString
Indicates the audio source.
Possible values are:
ADEC
AMIXERsourceTypeRequiredString
Indicates the active source connection.
Possible values are:
record
btcallsource
alexa
webcall
voiceassistance
streamObject

Added: API level 29
Description
Contains the list of active connections.
Properties

Name
Required
Type
DescriptionactiveStatusRequiredBoolean
Indicates whether the stream is active.
Possible values are:
true: Stream is active.
false: Streams is not active.inputVolumeRequiredNumber
Indicates the input volume of the stream.
The value can range from 0 to 100.muteStatusRequiredBoolean
Indicates if the audio is muted.
Possible values are:
true: Volume is muted.
false: Volume is not muted.policyStatusRequiredBoolean
Indicates if the policy for the streams is in progress.
Possible values are:
true: Policy is in progress.
false: Policy is not in progress.sinkOptionalString
Indicates the audio sink.
Possible values are:
MAIN
SUB
ALSAsourceOptionalString
Indicates the audio source.
Possible values are:
ADEC
AMIXERstreamTypeRequiredString
Indicates the active stream names.
Possible values are:
ptts
pvoicerecognition
pfeedback
pdefaultapp
palerts
pringtones
pmedia
peffects
default1
default2
tts1
tts2
API Error Codes Reference

Error Code
Error Text
Error Description1Could not validate json message against schema
Failed to validate against defined schema of the method3Invalid volume control
AUDIOD_ERRORCODE_NOT_SUPPORT_VOLUME_CHANGE3Volume limit reached
AUDIOD_ERRORCODE_NOT_SUPPORT_VOLUME_CHANGE15Audiod Internal Error
Internal Error.16Audiod internal error
AUDIOD_ERRORCODE_INVALID_MIXER_INSTANCE17Audiod Unknown Stream
A wrong streamType is requested.17Audiod internal error
AUDIOD_ERRORCODE_FAILED_MIXER_CALL18Audiod internal error
AUDIOD_ERRORCODE_INVALID_ENVELOPE_INSTANCE19Audiod internal error
AUDIOD_ERRORCODE_INVALID_AUDIO_TYPE20Unknown error
AUDIOD_ERRORCODE_UNKNOWN_ERROR21Invalid parameters
Invalid parameters error.22Not supported
AUDIOD_ERRORCODE_NOT_SUPPORTED22Driver error
AUDIOD_ERRORCODE_NOT_SUPPORTED22Audio not connected
AUDIOD_ERRORCODE_NOT_SUPPORTED22Soundout type not supported
AUDIOD_ERRORCODE_NOT_SUPPORTED22Connection not supported
AUDIOD_ERRORCODE_NOT_SUPPORTED23Invalid schema
AUDIOD_ERRORCODE_INVALID_SCHEMA25Audiod Unknown trackId
A wrong trackId is passed.200Audio not connected
Audio not connected204Volume control is not supported
Volume control is not supported

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 and sample code is licensed under the Apache License 2.0.

Contents