---
title: com.webos.service.camera2 | webOS Open Source Edition
id: comwebosservicecamera2-webos-open-source-edition
tags:
- lgtv-webos-ha-root-1a89ff
- locus-ultimate-edge-node-cec-ambient-voice-dashboard-soc-limits
created: '2026-08-28T02:58:46.548232Z'
source: https://www.webosose.org/docs/reference/ls2-api/com-webos-service-camera2/
source_domain: www.webosose.org
fetched_at: '2026-08-28T02:58:46.546321Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: docs
deprecated: false
---

com.webos.service.camera2 | webOS Open Source Edition

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

com.webos.service.camera2

Note
This API has been supported since API level 11.
API Summary

Provides an interface to capture and stream images from a camera that is connected to a webOS device.
Note: Currently, only V4L2 USB cameras are supported.
It provides the following features:
Live Camera Preview: Continuously streams live data from the camera to the shared memory (SystemV and POSIX). The data on the shared memory can be used by applications either using the native shared memory API for Linux or through multimedia middleware framework like GStreamer.
Capture Images: Allows capturing images in various modes. You can take single or multiple images based on the selected mode.
Control Camera Settings: Allows you to adjust the camera frame size, output format, and properties such as brightness, exposure, and so on.
Overview of the API

N/A
Methods

capture

ACG: camera.operation

Added: API level 27
Description
Starts capturing images using the camera. The captured images are stored as separate files at the specified location.
The default file name is of the format PictureDDMMYYYY-HHMMSS, where DDMMYYYY-HHMMSS is current date and time.
Example: Picture11022019-204128.jpeg
Note: This method should be called after startPreview().
Parameters

Name
Required
Type
DescriptionhandleRequiredNumber
Indicates the handle for the device obtained using the open() API.nimageOptionalNumber
Indicates the number of images to be captured.
The value can range from 1 to 30. The default value is 1.pathOptionalString
Indicates the location where the captured images are to be saved.
By default, captured images are saved in the /tmp/ folder.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).pathRequiredString array
Indicates the path and file names of the captured images.
Error Codes Reference

Error Code
Error Text
Error Description20, 22, 39, 45, 47, 200-
Check details in the "API Error Codes Reference" table.
Examples

Example : Capture two images

# luna-send -n 1 -f luna://com.webos.service.camera2/capture '{"handle": 189,"nimage": 2}'
Response:
{
"returnValue": true,
"path": [
"/tmp/Picture11022019-204128.jpeg",
"/tmp/Picture11022019-204230.jpeg"
]
}
close

ACG: camera.operation

Added: API level 11
Description
Closes the connection between the camera and the webOS device.
Parameters

Name
Required
Type
DescriptionhandleRequiredNumber
Indicates the handle for the device obtained using the open() API.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.
Error Codes Reference

Error Code
Error Text
Error Description20, 200-
Check details in the "API Error Codes Reference" table.
Examples

Example

# luna-send -n 1 -f luna://com.webos.service.camera2/close '{"handle":886}'
Response:
{
"returnValue":true
}
getCameraList

ACG: camera.query

Added: API level 11
Description
Gets the list of cameras connected to the webOS device. Returns IDs for each of the cameras connected to the device.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Subscribe for notifications on changes.
Possible values are:
true: Subscribed.
false (Default): Not subscribed.
Call Returns

Name
Required
Type
DescriptiondeviceListRequiredObject array: deviceList
Indicates the list of cameras connected to the device.
Note: The method returns an empty list if no camera is connected.returnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.subscribedRequiredBoolean
Indicates if subscribed to get notifications.
Note: Returns only if the subscribe is true.
Subscription Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.subscribedRequiredBoolean
Indicates if subscribed to get notifications.deviceListRequiredObject array: deviceList
Indicates the list of cameras connected to the device.
Note: The method returns an empty list if no camera is connected.
Examples

Example

# luna-send -n 1 -f luna://com.webos.service.camera2/getCameraList '{}'
Response:
{
"deviceList":[
{
"id":"camera1"
}
],
"returnValue":true
}

Example : With subscription

# luna-send -i -f luna://com.webos.service.camera2/getCameraList '{"subscribe":true}'
Response:
{
"subscribed":true,
"returnValue":true,
"deviceList":[
{
"id":"camera1"
}
]
}
Subscription Response: when camera2 is connected AND then when camera1 is disconnected
{
"returnValue":true,
"subscribed":true,
"deviceList":[
{
"id":"camera1"
},
{
"id":"camera2"
}
]
}
{
"returnValue":true,
"subscribed":true,
"deviceList":[
{
"id":"camera2"
}
]
}
getEventNotification

ACG: camera.operation

Added: API level 11
Description
Gets a notification when there is a change in any of the camera properties and formats or when there is an error event on your device.
Parameters

Name
Required
Type
DescriptionsubscribeRequiredBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribed.
false: Not subscribed.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.subscribedOptionalBoolean
Indicates if subscribed to get notifications.
Note: Returned only if "subscribe" is true.
Subscription Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.eventTypeRequiredString
Indicate the event type.
Possible values are:
preview_fault: If the device cannot send preview data due to an error during camera preview.
capture_fault: If an error occurs during camera capture.
input: If there is a input eventidOptionalString
ID of the camera.subscribedOptionalBoolean
Indicates if subscribed to get notifications.inputInfoOptionalObject: inputInfo
Indicates the details of user input on the screen when eventType is input.
Note: This is supported only in the window created by the camera service.
Error Codes Reference

Error Code
Error Text
Error Description32-
Check details in the "API Error Codes Reference" table.
Examples

Example : With subscription

# luna-send -i -f luna://com.webos.service.camera2/getEventNotification '{"subscribe":true}'
Response:
{
"subscribed": true,
"returnValue": true
}
Subscription Response: If there is an error during camera preview
{
"subscribed": true,
"returnValue": true,
"id": "camera1",
"eventType": "preview_fault"
}

Example : With subscription

# luna-send -i -f luna://com.webos.service.camera2/getEventNotification '{"subscribe":true}'
Response:
{
"subscribed": true,
"returnValue": true
}
Subscription Response: If there is a user input in window
{
"subscribed": true,
"returnValue": true,
"eventType":"input",
"inputInfo":{
"handle": 3245,
"y": 550,
"x": 1068
}
}
getFd

ACG: camera.operation

Added: API level 13
Description
Provides the FD (File Descriptor) for the POSIX shared memory.
Note: It returns the FD by attaching it using LS2 attach fd interface to the client.
Parameters

Name
Required
Type
DescriptionhandleRequiredNumber
Indicates the handle for the device obtained using the open() API. typeRequiredString
Indicates the FD type.
Possible values are:
buffer: Indicates the FD of the buffer in camera shared memory.
signal: Indicates the FD for the synchronization signal of the Camera Shared Memory.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.
Error Codes Reference

Error Code
Error Text
Error Description20, 47, 200-
Check details in the "API Error Codes Reference" table.
Examples

Example

# luna-send -n 1 -f luna://com.webos.service.camera2/getFd '{"handle": 886, "type": "buffer"}'
Response:
{
"returnValue":true
}

Sample for fetching the fd from getFd response:
getFdCb(LSHandle *lsHandle, LSMessage *message, void *user_data)
{
...
LS::Message ls_message(message);
LS::PayloadRef payload_ref = ls_message.accessPayload();
fd = payload_ref.getFd();
...
}
getFormat

ACG: camera.operation

Added: API level 27
Description
Gets the current resolution, FPS, and format settings of the connected camera device.
Parameters

Name
Required
Type
DescriptionidRequiredString
Indicates the camera id for the device obtained using the getCameraList() API.
Note: The camera must be opened first.subscribeOptionalBoolean
Subscribe for notifications on changes.
Possible values are:
true: Subscribed.
false: (default) Not subscribed.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.subscribedOptionalBoolean
Indicates if subscribed to get notifications.
Note: Returns only if the subscription is true.paramsOptionalObject: camera_format
Indicates the size and format of the preview stream.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'API Error Codes Reference' section for details.
Subscription Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.subscribedOptionalBoolean
Indicates if subscribed to get notifications.idOptionalString
Indicates the id of the camera.paramsOptionalObject: camera_format
Indicates the size and format of the preview stream.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "API Error Codes Reference" section of this method for details.
Examples

Example : Get format without subscription

# luna-send -n 1 -f luna://com.webos.service.camera2/getFormat '{ "id":"camera1"}'
Response:
{
"returnValue":true,
"params":{
"format":"YUV",
"width":640,
"fps":30,
"height":480
}
}

Example : Get format with subscription

# luna-send -n 1 -f luna://com.webos.service.camera2/getFormat '{ "id":"camera1", "subscribe":true}'
Response:
{
"subscribed":" true",
"returnValue":true,
"params":{
"format":"YUV",
"width":640,
"fps":30,
"height":480
}
}
Subscription response:
{
"subscribed":true,
"returnValue":true,
"id":"camera1",
"params":{
"format":"JPEG",
"fps":30,
"width":1280,
"height":720
}
}
getInfo

ACG: camera.query

Added: API level 11
Description
Gets information about a camera that is connected to the webOS device.
Parameters

Name
Required
Type
DescriptionidRequiredString
Indicates id of the camera obtained using the getCameraList() API.
Call Returns

Name
Required
Type
DescriptioninfoRequiredObject: capture_info
Returns information about the camera.returnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.
Examples

Example

# luna-send -n 1 -f luna://com.webos.service.camera2/getInfo '{ "id":"camera1"}'
Response:
{
"info":{
"type":"camera",
"builtin":false,
"supported":true,
"resolution":{
"YUV":[
"640,480,30",
"640,480,24",
"640,480,20",
"640,480,15",
"640,480,10",
"640,480,7",
"640,480,5",
"160,90,30",
"160,90,24",
"160,90,20",
"160,90,15",
"160,90,10",
"160,90,7",
"160,90,5",
"160,120,30",
"160,120,24",
"160,120,20",
"160,120,15",
"160,120,10",
"160,120,7",
"160,120,5",
"176,144,30",
"176,144,24",
"176,144,20",
"176,144,15",
"176,144,10",
"176,144,7",
"176,144,5",
"320,180,30",
"320,180,24",
"320,180,20",
"320,180,15",
"320,180,10",
"320,180,7",
"320,180,5",
"320,240,30",
"320,240,24",
"320,240,20",
"320,240,15",
"320,240,10",
"320,240,7",
"320,240,5",
"352,288,30",
"352,288,24",
"352,288,20",
"352,288,15",
"352,288,10",
"352,288,7",
"352,288,5",
"432,240,30",
"432,240,24",
"432,240,20",
"432,240,15",
"432,240,10",
"432,240,7",
"432,240,5",
"640,360,30",
"640,360,24",
"640,360,20",
"640,360,15",
"640,360,10",
"640,360,7",
"640,360,5",
"800,448,30",
"800,448,24",
"800,448,20",
"800,448,15",
"800,448,10",
"800,448,7",
"800,448,5",
"800,600,24",
"800,600,20",
"800,600,15",
"800,600,10",
"800,600,7",
"800,600,5",
"864,480,24",
"864,480,20",
"864,480,15",
"864,480,10",
"864,480,7",
"864,480,5",
"960,720,15",
"960,720,10",
"960,720,7",
"960,720,5",
"1024,576,15",
"1024,576,10",
"1024,576,7",
"1024,576,5",
"1280,720,10",
"1280,720,7",
"1280,720,5",
"1600,896,7",
"1600,896,5",
"1920,1080,5",
"2560,1472,2"
],
"JPEG":[
"640,480,30",
"640,480,24",
"640,480,20",
"640,480,15",
"640,480,10",
"640,480,7",
"640,480,5",
"160,90,30",
"160,90,24",
"160,90,20",
"160,90,15",
"160,90,10",
"160,90,7",
"160,90,5",
"160,120,30",
"160,120,24",
"160,120,20",
"160,120,15",
"160,120,10",
"160,120,7",
"160,120,5",
"176,144,30",
"176,144,24",
"176,144,20",
"176,144,15",
"176,144,10",
"176,144,7",
"176,144,5",
"320,180,30",
"320,180,24",
"320,180,20",
"320,180,15",
"320,180,10",
"320,180,7",
"320,180,5",
"320,240,30",
"320,240,24",
"320,240,20",
"320,240,15",
"320,240,10",
"320,240,7",
"320,240,5",
"352,288,30",
"352,288,24",
"352,288,20",
"352,288,15",
"352,288,10",
"352,288,7",
"352,288,5",
"432,240,30",
"432,240,24",
"432,240,20",
"432,240,15",
"432,240,10",
"432,240,7",
"432,240,5",
"640,360,30",
"640,360,24",
"640,360,20",
"640,360,15",
"640,360,10",
"640,360,7",
"640,360,5",
"800,448,30",
"800,448,24",
"800,448,20",
"800,448,15",
"800,448,10",
"800,448,7",
"800,448,5",
"800,600,30",
"800,600,24",
"800,600,20",
"800,600,15",
"800,600,10",
"800,600,7",
"800,600,5",
"864,480,30",
"864,480,24",
"864,480,20",
"864,480,15",
"864,480,10",
"864,480,7",
"864,480,5",
"960,720,30",
"960,720,24",
"960,720,20",
"960,720,15",
"960,720,10",
"960,720,7",
"960,720,5",
"1024,576,30",
"1024,576,24",
"1024,576,20",
"1024,576,15",
"1024,576,10",
"1024,576,7",
"1024,576,5",
"1280,720,30",
"1280,720,24",
"1280,720,20",
"1280,720,15",
"1280,720,10",
"1280,720,7",
"1280,720,5",
"1600,896,30",
"1600,896,24",
"1600,896,20",
"1600,896,15",
"1600,896,10",
"1600,896,7",
"1600,896,5",
"1920,1080,30",
"1920,1080,24",
"1920,1080,20",
"1920,1080,15",
"1920,1080,10",
"1920,1080,7",
"1920,1080,5"
]
},
"name":"HD Pro Webcam C920."
},
"returnValue":true
}
getProperties

ACG: camera.operation

Added: API level 11
Description
Gets the current settings of the connected camera device.
Parameters

Name
Required
Type
DescriptionparamsOptionalString array
Indicates the list of specific properties for which settings are returned.idRequiredString
Indicates the camera id for the device obtained using the getCameraList() API.
Note: The camera must be opened first.subscribeOptionalBoolean
Subscribe for notifications on changes.
Possible values are:
true: Subscribed.
false (Default): Not subscribed.
Call Returns

Name
Required
Type
DescriptionparamsRequiredObject: camera_properties
Indicates the current properties of the camera.returnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.subscribedOptionalBoolean
Indicates if subscribed to get notifications.
Note: Returns only if the subscription is true.
Subscription Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.subscribedOptionalBoolean
Indicates if subscribed to get notifications (check 'subscribe' parameter).idRequiredString
ID of the camera.paramsRequiredObject: camera_properties
Indicates the current properties of the camera.
Examples

Example : With ID and subscription

# luna-send -n 1 -f luna://com.webos.service.camera2/getProperties '{"id":"camera1", "subscribe":true}'
Response:
{
"subscribed":true,
"returnValue":true,
"params":{
"exposure":{
"max":10000,
"min":78,
"default":312,
"step":1,
"value":312
},
"backlightCompensation":{
"max":3,
"min":0,
"default":0,
"step":1,
"value":0
},
"frequency":{
"max":2,
"min":0,
"default":1,
"step":1,
"value":1
},
"saturation":{
"max":100,
"min":0,
"default":58,
"step":1,
"value":58
},
"brightness":{
"max":64,
"min":-64,
"default":0,
"step":1,
"value":64
}
}
}
Subscription Response:
{
"subscribed":true,
"returnValue":true,
"id":"camera1",
"params":{
"exposure":{
"max":10000,
"min":78,
"default":312,
"step":1,
"value":312
},
"backlightCompensation":{
"max":3,
"min":0,
"default":0,
"step":1,
"value":0
},
"frequency":{
"max":2,
"min":0,
"default":1,
"step":1,
"value":1
},
"saturation":{
"max":100,
"min":0,
"default":58,
"step":1,
"value":58
},
"brightness":{
"max":64,
"min":-64,
"default":0,
"step":1,
"value":64
}
}
}

Example : With ID and params

# luna-send -n 1 -f luna://com.webos.service.camera2/getProperties '{"id": "camera1", "params": ["frequency", "saturation"]}'
Response:
{
"returnValue": true,
"params": {
"saturation": {
"max": 255,
"min": 0,
"default": 128,
"step": 1,
"value": 128
},
"frequency": {
"max": 2,
"min": 0,
"default": 2,
"step": 1,
"value": 2
}
}
}
getSolutions

ACG: camera.operation

Added: API level 21
Description
Gets the current status of the supported camera solutions.
Parameters

Name
Required
Type
DescriptionhandleOptionalNumber
Indicates the handle for the device. It is obtained using the open() API.
Note: Either one of "handle" or "id" must be provided. idOptionalString
Indicates the camera id for the device. It is obtained using the getCameraList() API.
Note: Either one of "handle" or "id" must be provided.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.solutionsOptionalObject array: solutions
Provides current status of the supported camera solutions.
Error Codes Reference

Error Code
Error Text
Error Description11Camera device is not opened
Camera device is not opened20Parsing error
Luna command parsing error.23Param missing
One or more parameters are missing in luna command.32Wrong param
Input parameter is incorrect.47Wrong handle
Device handle number is incorrect.
Examples

Example : Get solutions by specifying the -id- parameter

# luna-send -n 1 -f luna://com.webos.service.camera2/getSolutions '{"id": "camera1"}'
Response:
{
"returnValue": true,
"solutions": [
{
"name": "FaceDetectionCNN",
"params": {
"enable": false
}
},
{
"name": "FaceDetection",
"params": {
"enable": false
}
}
]
}

Example : Get solutions by specifying the -handle- parameter

# luna-send -n 1 -f luna://com.webos.service.camera2/getSolutions '{"handle": 2214}'
Response:
{
"returnValue": true,
"solutions": [
{
"name": "FaceDetectionCNN",
"params": {
"enable": false
}
},
{
"name": "FaceDetection",
"params": {
"enable": false
}
}
]
}

Example : Get solutions

# luna-send -n 1 -f luna://com.webos.service.camera2/getSolutions '{"id": "camera1"}'
Response:
{
"returnValue": true,
"solutions": [
{
"name": "FaceDetection",
"params": {
"autoPtz": true,
"faceDraw": true,
"lineWidth": 1,
"lineColor": 2
}
},
{
"name": "PoseDetection",
"params": {
"enable": false,
"lineWidth": 1,
"lineColor": 3
}
},
{
"name": "Segmentation",
"params": {
"enable": false,
"bgColor": 3
}
},
{
"name": "SignDetection",
"params": {
"enable": false,
"lineWidth": 1,
"lineColor": 1
}
},
{
"name": "TextDetection",
"params": {
"enable": false,
"lineWidth": 1,
"lineColor": 7
}
}
]
}
open

ACG: camera.operation

Added: API level 11
Description
Establishes a connection between a camera and the webOS device. Returns the device handle for this connection instance.
Parameters

Name
Required
Type
DescriptionidRequiredString
Indicates the unique identifier of the camera obtained using the getCameraList() API.modeOptionalString
Indicates whether the calling app can update the camera settings.
Note:
If no mode is selected, then the first call to open the camera gets primary access, and others are given secondary access.
If there are multiple calls with the mode set as primary, then only the first call gets primary access.
Possible values are:
primary: Calling app can update the camera settings.
secondary:  Calling app cannot update the camera settings.appIdOptionalString
ID of the application
Note: App must have permission to open the camera.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.handleRequiredNumber
Indicates the unique identifier for each connection instance.
Error Codes Reference

Error Code
Error Text
Error Description13, 20, 44, 51-
Check details in the "API Error Codes Reference" table.
Examples

Example : Open command with no mode

# luna-send -n 1 -f luna://com.webos.service.camera2/open '{"id":"camera1"}'
Response:
{
"returnValue":true,
"handle":9383
}

Example : Open command with the mode set to primary

# luna-send -n 1 -f luna://com.webos.service.camera2/open '{"id":"camera1","mode":"primary"}'
Response:
{
"returnValue":true,
"handle":886
}

Example : Error case - Open command with mode as primary (when an application has already opened with mode as primary)

# luna-send -n 1 -f luna://com.webos.service.camera2/open '{"id":"camera1","mode":"primary"}'
Response:
{
"errorCode":44,
"returnValue":false,
"errorText":"Already another device opened as primary"
}
setFormat

ACG: camera.operation

Added: API level 11
Description
Sets the size and format of the preview stream. This includes the height and width of the frame and the format in which data is to be written to the shared buffer.
Parameters

Name
Required
Type
DescriptionhandleRequiredNumber
Indicates the camera handle obtained using the open() API.paramsRequiredObject: camera_format
Indicates the size and format of the preview stream.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.
Examples

Example

# luna-send -n 1 -f luna://com.webos.service.camera2/setFormat '{
"handle":9383,
"params":{
"width":640,
"height":480,
"format":"JPEG",
"fps":30
}
}'
Response:
{
"returnValue":true
}
setProperties

ACG: camera.operation

Added: API level 11
Description
Sets the properties of the connected camera device.
Parameters

Name
Required
Type
DescriptionhandleRequiredNumber
Indicates the handle for the device obtained using the open() API. paramsRequiredObject: camera_properties
Indicates an object containing properties of the camera.
Note: Even though the API succeeds when an empty params object is provided, we recommend that at least one value must be included.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.
Examples

Example

# luna-send -n 1 -f luna://com.webos.service.camera2/setProperties '{
"handle": 9383,
"params":
{
"contrast": 100
}
}'
Response:
{
"returnValue":true
}
setSolutions

ACG: camera.operation

Added: API level 21
Description
Enables and disables camera solutions.
Parameters

Name
Required
Type
DescriptionhandleOptionalNumber
Indicates the handle for the device. It is obtained using the open() API.
Note: Either one of "handle" or "id" must be provided. idOptionalString
Indicates the camera id for the device. It is obtained using the getCameraList() API.
Note: Either one of "handle" or "id" must be provided. solutionsRequiredObject array: solutions
Specifies the current status of the supported camera solutions.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.
Error Codes Reference

Error Code
Error Text
Error Description11Camera device is not opened
Camera device is not opened20Parsing error
Luna command parsing error.23Param missing
One or more parameters are missing in luna command.32Wrong param
Input parameter is incorrect.47Wrong handle
Device handle number is incorrect.
Examples

Example : Set solutions by specifying the -id- parameter

# luna-send -n 1 -f luna://com.webos.service.camera2/setSolutions '{
"id": "camera1",
"solutions": [
{
"name": "AutoContrast",
"params": {
"enable": true
}
},
{
"name": "FaceDetection",
"params": {
"enable": true
}
}
]
}'
Response:
{
"returnValue": true
}

Example : Set solutions by specifying the -handle- parameter

# luna-send -n 1 -f luna://com.webos.service.camera2/setSolutions '{
"handle": 4231,
"solutions": [
{
"name": "AutoContrast",
"params": {
"enable": true
}
},
{
"name": "FaceDetection",
"params": {
"enable": true
}
}
]
}'
Response:
{
"returnValue": true
}

Example : FaceDetection

# luna-send -n 1 -f luna://com.webos.service.camera2/setSolutions '{
"id": "camera1",
"solutions": [
{
"name": "FaceDetection",
"params": {
"autoPtz": true,
"faceDraw": true
}
}
]
}'
Response:
{
"returnValue": true
}

Example : PoseDetection

# luna-send -n 1 -f luna://com.webos.service.camera2/setSolutions '{
"id": "camera1",
"solutions": [
{
"name": "PoseDetection",
"params": {
"enable": true
}
}
]
}'
Response:
{
"returnValue": true
}

Example : Segmentation

# luna-send -n 1 -f luna://com.webos.service.camera2/setSolutions '{
"id": "camera1",
"solutions": [
{
"name": "Segmentation",
"params": {
"enable": true
}
}
]
}'
Response:
{
"returnValue": true
}

Example : TextDetection

# luna-send -n 1 -f luna://com.webos.service.camera2/setSolutions '{
"id": "camera1",
"solutions": [
{
"name": "TextDetection",
"params": {
"enable": true
}
}
]
}'
Response:
{
"returnValue": true
}

Example : SignDetection

# luna-send -n 1 -f luna://com.webos.service.camera2/setSolutions '{
"id": "camera1",
"solutions": [
{
"name": "SignDetection",
"params": {
"enable": true
}
}
]
}'
Response:
{
"returnValue": true
}
setWindow

ACG: camera.operation

Added: API level 32
Description
Sets the window's position and size, display ID, and overlay/mirror options.
Parameters

Name
Required
Type
DescriptionhandleRequiredNumber
Indicates the handle for the device obtained using the open() API. paramsRequiredObject: window_params
Defines a window's position, size, display ID, and overlay/mirror options.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates method execution status.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.
Error Codes Reference

Error Code
Error Text
Error Description20, 47-
For details, see the 'API Error Codes Reference' table.
Examples

Example :

# luna-send -n 1 -f luna://com.webos.service.camera2/setWindow '{
"handle": 189,
"params": {
"x": 960,
"y": 0,
"w": 960,
"h": 540,
"mirror": false,
"overlay": false,
"displayId": 0
}
}'
Response:
{
"returnValue": true
}
startCamera

ACG: camera.operation

Added: API level 27
Description
Starts camera and turns on streaming of captured image frames into the shared memory (SystemV or POSIX). The method returns a key or an FD for accessing the shared memory, which is required for applications to access data from the shared memory.
Notes:
Use this method if the application needs only to access image frame data kept in the shared memory.
In order to set the image resolution and format of the image frame, use the setFormat() method.
Parameters

Name
Required
Type
DescriptionhandleRequiredString
Indicates the handle for the device obtained using the open() API.paramsRequiredObject: camera_memory_source
Defines the type and source of memory.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.keyOptionalNumber
Indicates the key for memory access.
For SystemV, key can be accessed directly for camera device buffers.
For POSIX, shared memory FD has to be shared over getFd() API for accessing the camera device buffers.
Error Codes Reference

Error Code
Error Text
Error Description20, 32, 200-
Check details in the "API Error Codes Reference" table.
Examples

Example : For SystemV shared memory

# luna-send -n 1 -f luna://com.webos.service.camera2/startCamera '{"handle": 5699}'
Response:
{
"returnValue": true
}
startCapture

ACG: camera.operation
Deprecated

Added: API level 11
Deprecated: API level 32
Description
Starts capturing images using the camera. The captured images are stored as separate files at the location given by the "path" parameter.
The default file name is of the format PictureDDMMYYYY-HHMMSS, where DDMMYYYY-HHMMSS is current date and time.
Example: Picture11022019-204128.jpeg
Parameters

Name
Required
Type
DescriptionhandleRequiredNumber
Indicates the handle for the device obtained using the open() API. paramsRequiredObject: camera_capture_format
Indicates the size and format of the images to be captured. pathOptionalString
Indicates the location where the captured images are to be saved.
Note:
By default, captured images are saved in the /tmp/ folder.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.
Examples

Example : Without specifying the location

# luna-send -n 1 -f luna://com.webos.service.camera2/startCapture '{
"handle": 9383,
"params":
{
"width": 640,
"height": 480,
"format": "JPEG",
"mode":"MODE_BURST",
"nimage":2
}
}'
Response: For successful call
{
"returnValue":true
}

Example : With location specified

# luna-send -n 1 -f luna://com.webos.service.camera2/startCapture '{
"handle": 9383,
"params":
{
"width": 640,
"height": 480,
"format": "JPEG",
"mode":"MODE_BURST",
"nimage":2
},
"path":"/tmp/"
}'
Response: For successful call
{
"returnValue":true
}

Example : Error case - With read-only location specified

# luna-send -n 1 -f luna://com.webos.service.camera2/startCapture '{
"handle": 9383,
"params":
{
"width": 640,
"height": 480,
"format": "JPEG",
"mode":"MODE_BURST",
"nimage":2
},
"path":"/sys/"
}'
Response: For failed call
{
"errorCode": 45,
"returnValue": false,
"errorText": "Cannot write at specified location"
}
startPreview

ACG: camera.operation

Added: API level 11
Description
Turns on camera streaming of captured image frames into the shared memory (SystemV or POSIX) and shows preview on the specified surface.  The method returns a key or an fd for accessing the shared memory for applications to utilize.
Notes:
Use this API if the application needs to render image frames on the specified surface.
While the camera is previewing, the application can access the shared memory for purposes except for preview.
In order to set the image resolution and format of the image frame, use the setFormat() method.
Parameters

Name
Required
Type
DescriptionhandleRequiredNumber
Indicates the handle for the device obtained using the open() API. windowIdOptionalString
Indicates windowId associated with the surface.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.
Error Codes Reference

Error Code
Error Text
Error Description20, 106, 200-
Check details in the "API Error Codes Reference" table.
Examples

Example

[Precondition]
# camera_window_manager_exporter &
Response:
displayID=0
x=0, y=0, exportWidth=1920, exportHeight=1080exporter.initialize success
exported window ID is : _Window_Id_1
[Preview]
# luna-send -n 1 -f luna://com.webos.service.camera2/startPreview '{
"handle": 189,
"windowId": "_Window_Id_1"
}'
Response:
{
"returnValue": true
}

Example :

# luna-send -n 1 -f luna://com.webos.service.camera2/startPreview '{
"handle": 189
}'
Response:
{
"returnValue": true
}
stopCamera

ACG: camera.operation

Added: API level 27
Description
Stops camera and turns off streaming into the shared memory.
Note: Applications that called startCamera() should call this method to stop streaming.
Parameters

Name
Required
Type
DescriptionhandleRequiredNumber
Indicates the handle for the device obtained using the open() API.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.
Error Codes Reference

Error Code
Error Text
Error Description13, 20, 32, 200-
Check details in the "API Error Codes Reference" table.
Examples

Example : Stop camera

# luna-send -n 1 -f luna://com.webos.service.camera2/stopCamera '{"handle": 5699}'
Response:
{
"returnValue": true,
}
stopCapture

ACG: camera.operation
Deprecated

Added: API level 11
Deprecated: API level 32
Description
Stops camera from capturing images in the continuous mode. Continuous mode captures frames in succession till the stopCapture() method is called.
Parameters

Name
Required
Type
DescriptionhandleRequiredNumber
Indicates the handle for the device obtained using the open() API.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.
Examples

Example

# luna-send -n 1 -f luna://com.webos.service.camera2/stopCapture '{"handle":9383}'
Response:
{
"returnValue":true
}
stopPreview

ACG: camera.operation

Added: API level 11
Description
Turns off camera streaming and finishes showing the preview on the surface.
Note: The applications should call this method to stop streaming and preview when the applications called startPreview().
Parameters

Name
Required
Type
DescriptionhandleRequiredNumber
Indicates the handle for the device obtained using the open() API.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.
Error Codes Reference

Error Code
Error Text
Error Description13, 20, 32, 200-
Check details in the "API Error Codes Reference" table.
Examples

Example

# luna-send -n 1 -f luna://com.webos.service.camera2/stopPreview '{"handle":9383}'
Response:
{
"returnValue":true
}
Objects

camera_capability

Added: API level 29
Description
Contains the capability of the camera
Properties

Name
Required
Type
DescriptionminOptionalNumber
The minimum value of the control.maxOptionalNumber
The maximum value of the control.defaultOptionalNumber
The default value of the control.stepOptionalNumber
The step value of the control.valueOptionalNumber
The current value of the control.
camera_capture_format

Added: API level 29
Description
Indicates the size and the format in which images are to be captured.
Properties

Name
Required
Type
DescriptionwidthRequiredNumber
Indicates the width of the image to be captured.
Default width: 640 pixelsheightRequiredNumber
Indicates the height of the image to be captured.
Default value: 480 pixelsformatRequiredString
Indicates the format of the image.
Possible values are:
JPEG
YUV
Default: YUVnimageOptionalNumber
Indicates the number of images to be captured.
Note: The field is required for capturing images in burst mode.modeRequiredString
Indicates the mode in which the image is to be captured.
Possible values are:
MODE_ONESHOT: For one-shot mode
MODE_BURST: For burst mode
MODE_CONTINUOUS: For continuous mode
camera_format

Added: API level 29
Description
Indicates the size and format for the preview stream and images.
Properties

Name
Required
Type
DescriptionwidthRequiredNumber
Indicates the width of the image to be captured.
Default: 640 pixelsheightRequiredNumber
Indicates the height of the image to be captured.
Default: 480 pixelsformatRequiredString
Indicates the format of the image.
Possible values are:
JPEG
YUV
Default: YUVfpsRequiredNumber
Indicates the frames per second.
camera_memory_source

Added: API level 29
Description
Indicates the type of the memory for the preview data to be written.
Properties
None
camera_properties

Added: API level 29
Description
Contains the properties of the camera.
Properties

Name
Required
Type
DescriptionsharpnessOptionalObject: camera_capability
Indicates the camera sharpness autoExposureOptionalObject: camera_capability
Indicates the camera auto exposureautoFocusOptionalObject: camera_capability
Indicates the camera auto focusautoWhiteBalanceOptionalObject: camera_capability
Indicates the camera auto white balancebacklightCompensationOptionalObject: camera_capability
Indicates the camera backlight compensation valuebrightnessOptionalObject: camera_capability
Indicates the camera brightnesscontrastOptionalObject: camera_capability
Indicates the camera contrastexposureOptionalObject: camera_capability
Indicates the exposure valuefocusAbsoluteOptionalObject: camera_capability
Indicates the focus valuefrequencyOptionalObject: camera_capability
Indicates the camera power line frequencygainOptionalObject: camera_capability
Indicates the camera gaingammaOptionalObject: camera_capability
Camera gammahueOptionalObject: camera_capability
Indicates the camera huepanOptionalObject: camera_capability
Indicates the pan valuesaturationOptionalObject: camera_capability
Indicates the camera saturationtiltOptionalObject: camera_capability
Indicates the tilt valuewhiteBalanceTemperatureOptionalObject: camera_capability
Indicates the white balance temperaturezoomAbsoluteOptionalObject: camera_capability
Indicates the zoom value
capture_info

Added: API level 29
Description
Indicates the information about the camera.
Properties

Name
Required
Type
DescriptionnameOptionalString
Indicates the name of the camera.typeOptionalString
Indicates the type of the device.
Possible values are:
camerabuiltinOptionalBoolean
Indicates if the camera is built-in or not.resolutionOptionalObject
Indicates the supported format resolutions.supportedOptionalBoolean
Indicates whether the camera is supported.
deviceList

Added: API level 29
Description
Contains the list of cameras connected to the webOS device.
Properties

Name
Required
Type
DescriptionidOptionalString
Indicates the unique camera identifier.
inputInfo

Added: API level 32
Description
Indicates the details of user input on the screen.
Properties

Name
Required
Type
DescriptionhandleRequiredNumber
Indicates the handle for the device obtained using the open() API. xRequiredNumber
The horizontal position of the input.
The value can range from 0 to 1920.yRequiredNumber
The vertical position of the input.
The value can range from 0 to 1080.
picture

Added: API level 29
Description
Indicates the image size and image format.
Properties

Name
Required
Type
DescriptionmaxWidthOptionalNumber
Width valuemaxHeightOptionalNumber
Height valueformatOptionalString
Supported formats
solution_params

Added: API level 29
Description
Detailed information of a specific solution.
Properties

Name
Required
Type
DescriptionenableOptionalBoolean
Status of solution [enable/disable each solution]autoPtzOptionalBoolean
Automatically adjust pan, tilt, and zoom when face detection is active.
Possible values are:
true
false (Default)faceDrawOptionalBoolean
Shows detected face areas on the screen when face detection is active.
Possible values are:
true
false (Default)lineWidthOptionalNumber
Sets the thickness of displayed lines.
The value can range from 1 to 10. The default value is 1.lineColorOptionalNumber
Chooses the color of the displayed lines.
Possible values are:
0: Red
1: Yello
2 (Default): Green
3: Cyan
4: Blue
5: Magenta
6: Black
7: WhitebgColorOptionalNumber
Defines the background color for segmentation.
Possible values are:
0: Red
1: Yellow
2: Creen
3 (Default): Sky Blue
4: Blue
5: Magenta
6: Black
7: White
solutions

Added: API level 29
Description
Information of all supported camera solutions.
Properties

Name
Required
Type
DescriptionnameRequiredString
Name of supported solution.
Possible values are:
FaceDetection: Detects faces at short range.
PoseDetection: Pose estimation using PoseNet.
Segmentation: Image segementation using MediaPipe selfie.
TextDetection: Text area detection using PaddleOCR.
SignDetection: Sign area detection using YOLOv5n.paramsRequiredObject: solution_params
Detailed information of a specific solution.
video

Added: API level 29
Description
Indicates the video size and the video format.
Properties

Name
Required
Type
DescriptionmaxWidthOptionalNumber
Indicates the width value.maxHeightOptionalNumber
Indicates the height value.formatOptionalString
Gives the supported format for video.frameRateOptionalNumber
Indicates the video frame rate.
window_params

Added: API level 32
Description
Defines a window's position, size, display ID, and overlay/mirror options.
Note: At least one property must be mandatory.
Properties

Name
Required
Type
DescriptionxOptionalNumber
The horizontal position of the window on the screen. It is measured in pixels from the left edge.
The value can range from 0 to 1920. The default value is 0.yOptionalNumber
The vertical position of the window on the screen. It is measured in pixels from the top edge.
The value can range from 0 to 1080. The default value is 0.wOptionalNumber
The width of the window in pixels.
The value can range from 0 to 1920. The default value is 1920.hOptionalNumber
The height of the window in pixels.
The value can range from 0 to 1080. The default value is 1080.mirrorOptionalBoolean
A flag indicating if the content should be mirrored horizontally. If true, the content will be flipped from left to right.
Possible values are:
true: Mirror content.
false (Default): Do not mirror content.overlayOptionalBoolean
A flag indicating if the window should be an overlay on top of other content. If true, the window will appear above other windows.
Possible values are:
true: Overlay
false (Default): No overlaydisplayIdOptionalNumber
The identifier for the display where the window will appear. This helps to specify which screen to use.
https://www.webosose.org/docs/guides/setup/setting-up-dual-displays/
Possible values are:
0 (Default): Primary display (HDMI0)
1: Secondary display (HDMI1)
API Error Codes Reference

Error Code
Error Text
Error Description2Cannot close device
Device cannot be closed.3Cannot open device
Device cannot be opened.5Cannot start device
Preview stream cannot be started.6Cannot stop device
Preview stream cannot be stopped.7Device already closed
Device is already closed.8Device is already open
Device is already opened.9Device is already started
Preview stream is already started.10Device is already stopped
Preview stream is already stopped.11Device not opened
Device is not opened.12Device not started
Preview stream is not yet started.13There is no device
There is no device connected corresponding to input ID.20Parsing error
Luna command parsing error.22Out of param range
A parameter value is not within the expected or allowed range.23Param missing
One or more parameters are missing in luna command.26Unsupported format
Unsupported format.29Device unsupported
Device is not supported.30Format unsupported
Format is not supported.32Wrong param
Input parameter is incorrect.35Unknown error
Unknown error38Fail to open file
Fail to open file39Fail to write file
There is a problem or failure in writing data to a file. It could occur due to various reasons such as insufficient permissions, lack of disk space, or hardware issues.44Already another device opened as primary
Only one application can open a camera device as primary. Other application will not be allowed to open camera if an application has already opened with primary priority.45Cannot write at specified location
Cannot write at the specified location.46Unsupported Memory Type
Error due to unsupported memory type47Wrong handle
Handle is not exist.48Preview not started
Preview is not started.49Handle is not in POSIXSHM mode
Handle is not in POSIXSHM mode51Failed to register pid with specified signal
Id of the signal is not valid.52Must specify client pid
PID should be provided in the request.100The subscribed camera is disconnected
The subscription is canceled because the camera is disconnected.105Request Timeout
Requested operation is timed out.106Invalid windowId
The windowId is invalid.200Invalid state
Camera device state is invalid.

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 and sample code is licensed under the Apache License 2.0.

Contents