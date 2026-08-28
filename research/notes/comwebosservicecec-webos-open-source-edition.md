---
title: com.webos.service.cec | webOS Open Source Edition
id: comwebosservicecec-webos-open-source-edition
tags:
- lgtv-webos-ha-root-1a89ff
- locus-rooted-acl-boundary-stock-vs-root-luna-matrix
created: '2026-08-28T02:28:01.511674Z'
source: https://www.webosose.org/docs/reference/ls2-api/com-webos-service-cec/
source_domain: www.webosose.org
fetched_at: '2026-08-28T02:28:01.510283Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: docs
deprecated: false
---

com.webos.service.cec | webOS Open Source Edition

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

com.webos.service.cec

Note
This API has been supported since API level 17.
API Summary

The CEC (Consumer Electronic Control) service allows webOS to control connected HDMI CEC devices.
Overview of the API

HDMI-CEC is a feature of HDMI which allows to command and control devices connected through HDMI without user intervention. For example:
CEC can be used to control playback on a TV device connected via HDMI
When you play a video on a Chromecast with the TV off, and the TV automatically powers on and switches to the Chromecast source.
These APIs provide the following support:
Control a device that supports CEC, like a TV, connected via HDMI.
Power the TV on or off
Control TV playback
Change the TV volume up or down
Methods

getConfig

ACG: cec.query

Added: API level 17
Description
Gets the value of the specified input configuration.
Parameters

Name
Required
Type
DescriptionadapterOptionalString
Input HDMI-CEC adapter.
Default: cec0keyRequiredString
Key name to get configuration value.
Possible values are:
vendorId: Vendor ID of device.
version: CEC Version of the device.
osd: OSD name of the device.
language: Menu language.
powerState: Power status of the device.
physicalAddress: Physical address of the device.
logicalAddress: Logical address of the device.
deviceType: Type of device (TV, recorder, playback).
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.keyRequiredString
Key name of input configuration.valueRequiredString
Value of input configuration.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'API Error Codes Reference' section for details.
Error Codes Reference

Error Code
Error Text
Error Description1, 2, 6See API Error Codes Reference
See API Error Codes Reference.
Examples

Example : Get the vendor ID

# luna-send -n 1 -f luna://com.webos.service.cec/getConfig '{ "adapter":"cec0", "key": "vendorId" }'
Response:
{
"returnValue": true,
"key": "vendorId",
"value": "LG"
}
listAdapters

ACG: cec.query

Added: API level 17
Description
Searches CEC adapters from system and list all the identified local CEC adapters.
Parameters
None
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.cecAdaptersRequiredString array
List of local HDMI-CEC adapters.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'API Error Codes Reference' section for details.
Examples

Example : List HDMI-CEC adapters

# luna-send -n 1 -f luna://com.webos.service.cec/listAdapters '{ }'
Response:
{
"returnValue": true,
"cecAdapters" : [
"cec0",
"cec1"
]
}
scan

ACG: cec.query

Added: API level 17
Description
Scans the CEC bus and provides information of the connected HDMI CEC devices.
Parameters

Name
Required
Type
DescriptionadapterOptionalString
Input HDMI-CEC adapter.
Default: cec0
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.devicesRequiredObject array: devices
Information about connected HDMI CEC devices.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'API Error Codes Reference' section for details.
Error Codes Reference

Error Code
Error Text
Error Description1, 6See API Error Codes Reference
See API Error Codes Reference.
Examples

Example : Scan the cec0 adapter and list the devices

# luna-send -n 1 -f luna://com.webos.service.cec/scan '{ "adapter": "cec0" }'
Response:
{
"returnValue": true,
"devices" : [
{
"name": "TV"
"address": "0.0.0.0"
"activeSource": "no"
"vendor": "LG"
"osd": "TV"
"cecVersion": "1.3a"
"powerStatus": "on"
"language": "eng"
},
{
"name": "Recorder 1"
"address": "1.0.0.0"
"activeSource": "yes"
"vendor": "LG"
"osd": "CECTester"
"cecVersion": "1.3a"
"powerStatus": "on"
"language": "eng"
}
]
}
sendCommand

ACG: cec.operation

Added: API level 17
Description
Sends the input command to destination HDMI CEC devices connected on CEC bus.
Parameters

Name
Required
Type
DescriptionadapterOptionalString
HDMI CEC device from which the command gets executed.
Default: cec0destAddressRequiredString
Physical or logical address of destination HDMI CEC device.timeoutOptionalNumber
Reply timeout, in milliseconds.
Default: 1000commandRequiredObject: command
Command to execute on destination CEC device.
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
The reason for the failure of the operation. See the 'API Error Codes Reference' section for details.payloadOptionalObject
Response payload provides the array of return values for the requested parameters in key value form. Check examples below.
Note: This parameter is only returned in cases where the arg value is not provided (this means the command is requesting for information).
Error Codes Reference

Error Code
Error Text
Error Description1, 2, 4, 5, 6, 7See API Error Codes Reference
See API Error Codes Reference.
Examples

Example : Set audio mute status off

#  luna-send -n 1 -f luna://com.webos.service.cec/sendCommand '{
"adapter": "cec0",
"destAddress" : "0.0.0.0",
"timeout": 500,
"command" : {
"name" : "report-audio-status",
"args" : [
{ "arg" : "aud-mute-status", "value" : "off"}
]
}
}'
Response:
{
"returnValue": true
}

Example : Get language information

# luna-send -n 1 -f luna://com.webos.service.cec/sendCommand '{
"adapter": "cec0",
"destAddress" : "0.0.0.0",
"timeout": 500,
"command" : {
"name" : "system-information",
"args" : [
{ "arg" : "language"}
]
}
}'
Response:
{
"returnValue": true,
"payload" : [{"language": "eng"}]
}

Example : Get language and version information

# luna-send -n 1 -f luna://com.webos.service.cec/sendCommand '{
"adapter": "cec0",
"destAddress" : "0.0.0.0",
"timeout": 500,
"command" : {
"name" : "system-information",
"args" : [
{ "arg" : "language"},
{ "arg" : "version"}
]
}
}'
Response:
{
"returnValue": true,
"payload" : [
{"language": "eng"},
{"version": "1.3a"}
]
}
setConfig

ACG: cec.operation

Added: API level 17
Description
Sets the input configuration.
Parameters

Name
Required
Type
DescriptionadapterOptionalString
Input CEC adapter.
Default: cec0keyRequiredString
Key name to set configuration value.
Possible values are:
vendorId: Vendor ID of device.
version: CEC Version of the device.
osd: OSD name of the device.
language: Menu language.
powerState: Power status of the device.
physicalAddress: Physical address of the device.
logicalAddress: Logical address of the device.
deviceType: Type of device (TV, recorder, playback).valueRequiredString
Configuration value to be set for the specified key.
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
Error Description1, 2, 6See API Error Codes Reference
See API Error Codes Reference.
Examples

Example : Set the vendor ID

# luna-send -n 1 -f luna://com.webos.service.cec/setConfig '{"adapter":"cec0","key": "vendorId", "value": "LG"}'
Response:
{
"returnValue": true
}
Objects

args

Added: API level 29
Description
Contains list of arguments passed to command.
Properties

Name
Required
Type
DescriptionargRequiredString
Indicates command argument. Below are supported "arg":
Available commandnameargvaluereport-power-statuspwr-state
on
standbyreport-audio-statusaud-mute-status
off
onset-volumevolume
up
downosd-displayosdstringactiveset-active NAone-touch-playactive-source NAsystem-information
vendor-id
version
name
language
power-state
is-active NAvendor-commandspayloadraw data in hex (eg:20:36)valueOptionalString
Value of command argument.
command

Added: API level 29
Description
Command to execute on destination HDMI CEC device.
Properties

Name
Required
Type
DescriptionnameRequiredString
Indicates command to be executed.
Possible values are:
report-power-status: Control power of remote device.
report-audio-status: Audio Status.
set-volume: Control volume of device.
osd-display: Display OSD string on device.
active: Make the device as active source.
one-touch-play: One Touch Play.
system-information: Checks following information:
Vendor ID of device
CEC Version
OSD Name
Menu Language
Check if device is active source
vendor-commands: Vendor commands.argsRequiredObject: args
An array of objects that contains list of arguments passed to command.
devices

Added: API level 29
Description
Contains information about connected HDMI CEC devices.
Properties

Name
Required
Type
DescriptionnameRequiredString
Indicates HDMI CEC device name.addressRequiredString
Physical address of HDMI CEC device that identifies the device uniquely on CEC bus.activeSourceRequiredString
Indicates whether HDMI CEC device is currently active source or not.vendorRequiredString
Vendor name of connected HDMI CEC device.osdRequiredString
On-screen display (OSD) name of HDMI CEC device.cecVersionRequiredString
CEC version of connected HDMI CEC device.powerStatusRequiredString
Power status of connected HDMI CEC device.languageRequiredString
Language of HDMI CEC device.
API Error Codes Reference

Error Code
Error Text
Error Description1The JSON input does not match the expected schema
One or more of the parameters do not have the correct parameter type. See the "Parameters" table to know the expected data type for each input parameter.
Note: Any required parameter missing will be a different error return based on the missing key.2Invalid input parameter
Invalid input parameter value.4Destination device not found
Provided input destination device is not found.5Invalid input command
Invalid input command, make sure that you have entered commands from list of available commands.6CEC adapter doesn't exist
Input CEC adapter does not exist.7Command aborted by target device
Command aborted by target device.

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 and sample code is licensed under the Apache License 2.0.

Contents