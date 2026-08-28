---
title: com.webos.service.applicationmanager | webOS Open Source Edition
id: comwebosserviceapplicationmanager-webos-open-source-edition
tags:
- lgtv-webos-ha-root-1a89ff
- locus-companion-lifecycle-enact-vs-js-service-vs-systemd-persistence
created: '2026-08-28T02:33:21.480022Z'
source: https://www.webosose.org/docs/reference/ls2-api/com-webos-service-applicationmanager/
source_domain: www.webosose.org
fetched_at: '2026-08-28T02:33:21.457985Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: docs
deprecated: false
---

com.webos.service.applicationmanager | webOS Open Source Edition

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

com.webos.service.applicationmanager

Note
This API has been supported since API level 11.
API Summary

Provides methods for managing application life cycle, application information, LaunchPoint list.
Overview of the API

NA
Methods

addLaunchPoint

ACG: application.launcher

Added: API level 11
Description
Adds a dynamic launchpoint. According to the information on launchpoint, application is displayed in the Launcher.
If a parameter is not defined, SAM set the LP's parameter value same as appInfo's value.
Parameters

Name
Required
Type
DescriptionidRequiredString
Indicates the application ID to be added.launchPointIdOptionalString
Indicates the launchpoint ID to be added.titleOptionalString
Indicates the launchpoint title.iconOptionalString
Indicates the path of the icon image displayed for the launchpoint.bgImageOptionalString
Indicates the path of the background image displayed to the user when the user hovers over the launchpoint.bgColorOptionalString
Indicates the background color for the launchpoint. It will be displayed when the bgImage is not provided or unable to display. A color can be specified as a hex value or as a HTML color name.
Format: color hex code (ex. #000000(black))
http://www.color-hex.com/imageForRecentsOptionalString
Indicates the path of the image displayed in the "Recents" tile.iconColorOptionalString
Indicates the background color for the application tile. The application tile is displayed in the Home, the Launcher, and the Recent screen.
Format: color hex code (ex. #000000(black))
http://www.color-hex.com/largeIconOptionalString
Indicates the path of the large icon (130x130 pixels) displayed in the top left corner of the screen, when the user hovers over an application tile in the Launcher.
Note: This file path is relative to the appinfo.json file.appDescriptionOptionalString
Indicates a brief description for the launchpoint.
Note: The appDescription cannot exceed 60 characters.paramsOptionalObject: params
If params is used, it should contain information on the launchpoint.bgImagesOptionalString array
Indicates the paths of the background images displayed to the user when the user hovers over the launchpoint.tileSizeOptionalString
Indicates the tile size on UI.
Possible values are
normal
large.
Default: normal
Note:
The large tile hints that UI should make this tile larger than normal (2x).
Usually, large size may be used for promotional application. unmovableOptionalBoolean
Indicates if the launchpoint position is movable or not.
Possible values are:
true: The launchpoint position cannot be moved by the user.
false: the launchpoint position can be moved by the user.
Default: falseuserDataOptionalString
Indicates the additional data that may be used for analytical purposes. The userData will be logged when the user interacts with it in Launcher.policyCategoryOptionalString
Indicates the category(group) of the launch point. The value should be the one of below mapping table.
*$RESERVED_VALUE is for special callers to be controlled by LPM.defaultAny9*$RESERVED_VALUE$RESERVED_LP$RESERVED_POSITION
Value
Launch Point Type
positionsupportI18nTitleOptionalBoolean
If "supportI18nTitle" is set to true, i18n will be supported for title when any information of this launch point is changed.
If "supportI18nTitle" is set to false, i18n will be supported for title when any information of this launch point is changed.
The default value of supportI18nTitle is truefaviconOptionalString
Indicates the paths of the favorite icon for the launchpoint.relaunchOptionalBoolean
If it is set to true, the app will be fresh-launched(re-randering) whenever user clicks the launchpoint.
Note: This parameter is deprecated in IvyLeague.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.launchPointIdOptionalString
Indicates the launchpoint ID to be added.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "Error Codes" section of this method for details.errorCodeOptionalNumber
The error code for the failed operation.
Error Codes Reference

Error Code
Error Text
Error DescriptionNoneinvalid json request
Invalid JSON request.
Examples

Example code

# luna-send -n 1 -f luna://com.webos.service.applicationmanager/addLaunchPoint '{
"id":"com.webos.app.test",
"title":"TestLP"
}'
Response:
{
"launchPointId":"178884",
"returnValue":true
}
close

ACG: application.launcher

Added: API level 11
Description
Closes an application.
Note A: At least one parameter is required. ('id', 'launchPointId', 'instanceId')
Note B: Don't use this API in TV and signage. The API is deprecated in the platforms.
Parameters

Name
Required
Type
DescriptionidOptionalString
Indicates the id of the application.launchPointIdOptionalString
Indicates the launchPointId of the application.instanceIdOptionalString
Indicates the instanceId of the application.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "Error Codes" section of this method for details.errorCodeOptionalNumber
The error code for the failed operation.processIdOptionalString
Indicates the processId of the closed application.instanceIdOptionalString
Indicates the instanceId of the running application.launchPointIdOptionalString
Indicates the launchPointId of the running application.appIdOptionalString
Indicates the appId of the running application.displayIdOptionalNumber (int32_t)
Indicates the displayId of running application.
Error Codes Reference

Error Code
Error Text
Error DescriptionNoneInvalid processId specified
Invalid processId is specified.NoneNot string
Invalid type value.NoneUnknown Process
Unknown processId.
Examples

Example code

# luna-send -n 1 -f luna://com.webos.service.applicationmanager/close '{
"id":"com.webos.app.test"
}'
{
"launchPointId": "com.webos.app.test_default",
"appId": "com.webos.app.test",
"returnValue": true,
"displayId": 0,
"instanceId": "a3effa8b-fe4a-4f5c-953b-0d326c0d2ef20"
}
closeByAppId

ACG: application.launcher

Added: API level 11
Description
Closes an application by appId in the system manager.
Parameters

Name
Required
Type
DescriptionidOptionalString
Indicates the id of the application.reasonOptionalString
Indicates the reason of why the app was closed. Subscribers who are watching app status will get the reason.
Note: This parameter is only for reserved caller such as surfacemanager. Other services or apps should not use this parameter.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check "errorText" field for details.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "Error Codes Reference" section of this method for details.instanceIdOptionalString
Indicates the instanceId of the running application.launchPointIdOptionalString
Indicates the launchPointId of the running application.displayIdOptionalString
Indicates the displayId of the running application.
Error Codes Reference

Error Code
Error Text
Error DescriptionNoneinvalid parameter
invalid parameter.Noneno app description
Invalid appId is specified. That is, the 'id' parameter is empty.NoneNot string
Invalid type value.Noneapp is not running
Application is not running.
Examples

Example code

# luna-send -n 1 -f luna://com.webos.service.applicationmanager/closeByAppId '{
"id":"com.webos.app.test"
}'
dev/close

ACG: application.devmode

Added: API level 23
Description
Closes application by either of  application id, instance id and launchpoint id .
Note: At least one parameter is required. Available only in developer mode (devmode)
Parameters

Name
Required
Type
DescriptionidOptionalString
Indicates the id of the application.
Note: At least one parameter of 'id', 'launchPointId', or 'instanceId' is mandatory.launchPointIdOptionalString
Indicates the launchPointId of the application.
Note: At least one parameter of 'id', 'launchPointId', or 'instanceId' is mandatory.instanceIdOptionalString
Indicates the instanceId of the application.
Note: At least one parameter of 'id', 'launchPointId', or 'instanceId' is mandatory.
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
The reason for the failure of the operation. See the 'Error Codes' section of this method for details.processIdOptionalString
Process ID of the closed application.launchPointIdOptionalString
Launch point ID of the running application.appIdOptionalString
App ID of the running application.displayIdOptionalNumber (int32_t)
Display ID of running application.
Error Codes Reference

Error Code
Error Text
Error Description2Only Dev app should be closed using /dev category_API
Only Dev app cane be closed using /dev category_API3invalid parameter
invalid parameterNoneapp is not running
app is not running
Examples

Example : Closing application by app id

1. Launch the application.
# luna-send -n 1 -f luna://com.webos.service.applicationmanager/launch '{"id":"com.lgsi.test.app" }'
Response:
{
"launchPointId": "com.lgsi.test.app_default",
"appId": "com.lgsi.test.app",
"instanceId": "7bf743c6-140d-4daf-817a-ef86d5d2d0060",
"displayId": 0,
"returnValue": true
}

2. Close the application.
# luna-send -n 1 -f luna://com.webos.service.applicationmanager/dev/close '{"id":"com.lgsi.test.app"}'
Response:
{
"launchPointId": "com.lgsi.test.app_default",
"appId": "com.lgsi.test.app",
"instanceId": "7bf743c6-140d-4daf-817a-ef86d5d2d0060",
"displayId": 0,
"returnValue": true
}

Example : Closing application by app instanceId

1. Launch the application.
# luna-send -n 1 -f luna://com.webos.applicationManager/launch '{"id":"com.domain.app"}'
Response:
{
"launchPointId": "com.domain.app_default",
"appId": "com.domain.app",
"instanceId": "74a77a9c-1779-4f9c-92c2-87d3a27650260",
"displayId": 0,
"returnValue": true
}

2. Close the application.
# luna-send -n 1 -f luna://com.webos.applicationManager/dev/close '{"instanceId":"74a77a9c-1779-4f9c-92c2-87d3a27650260"}'
Response:
{
"launchPointId": "com.domain.app_default",
"appId": "com.domain.app",
"instanceId": "74a77a9c-1779-4f9c-92c2-87d3a27650260",
"displayId": 0,
"returnValue": true
}

Example : Closing application by app launchPointId

1. Launch the application.
# luna-send -n 1 -f luna://com.webos.applicationManager/launch '{"id":"com.domain.app"}'
Response:
{
"launchPointId": "com.domain.app_default",
"appId": "com.domain.app",
"instanceId": "93cb3c90-4837-4514-8fb7-34645cc11dc90",
"displayId": 0,
"returnValue": true
}

2. Close the application.
# luna-send -n 1 -f luna://com.webos.applicationManager/dev/close '{"launchPointId":"com.domain.app_default"}'
Response:
{
"launchPointId": "com.domain.app_default",
"appId": "com.domain.app",
"instanceId": "93cb3c90-4837-4514-8fb7-34645cc11dc90",
"displayId": 0,
"returnValue": true
}
dev/closeByAppId

ACG: application.devmode

Added: API level 11
Description
Closes an application by the application id.
Note: Available only in developer mode (devmode). To enable devmode, call 'com.webos.service.devmode' ('setDevMode') with value 'true'.
Parameters

Name
Required
Type
DescriptionidRequiredString
Indicates the application id to be closed.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed.  See the "Error Codes" section of this method for details.instanceIdOptionalString
Indicates the instanceId of running application.launchPointIdOptionalString
Indicates the launchPointId of running application.appIdOptionalString
Indicates the appld of the closed application.displayIdOptionalNumber (int32_t)
Indicates the displayId of the running application.
Error Codes Reference

Error Code
Error Text
Error Description2 is not running
is not running2Only Dev app should be closed using /dev category_API
Only Dev app should be closed using /dev category_API3invalid parameters
invalid parameters
Examples

Example code

# luna-send -n 1 -f luna://com.webos.service.applicationmanager/dev/closeByAppId '{"id":"com.webos.app.test"}'
Response:
{
"appId": "com.webos.app.test",
"returnValue": true
}
dev/listApps

ACG: application.devmode

Added: API level 11
Description
Lists all of the registered applications.
Note:
Available only in developer mode (devmode). To enable devmode, call 'com.webos.service.devmode' ('setDevMode') with value 'true'.
Works for devmode app type.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribe to get notifications
false: Do not subscribe
Default: falsepropertiesOptionalString array
Indicates the name of properties to be extracted from appinfo.json file.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. See the "API Error Codes Reference" for more information.subscribedOptionalBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribed to get notifications
false: Not subscribedappsRequiredObject array: appInfo
If the dev/listApps method succeeds, the array of the applications will be returned.
Subscription Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. See the "API Error Codes Reference" for more information.appRequiredObject: appInfo
Returns the information of an app which has been installed/updated/removed.subscribedRequiredBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribed to get notifications
false: Not subscribed
Default: truechangeOptionalString
Indicates the reason for the change in the app information.
Possible values are:
added
updated
removed
Examples

Example: Success

This method returns information for all apps at first.
# luna-send -i -f luna://com.webos.service.applicationmanager/dev/listApps '{
"subscribe":true
}'
Response:
{
"subscribed":true,
"apps":[
{
"...."
}
],
"returnValue":true
}
When an app is update/removed/installed, the method returns only changed app's information
{
"subscribed":true,
"change":"removed",
"returnValue":true,
"app":{
"..."
}
}
dev/managerInfo

ACG: application.devmode

Added: API level 23
Description
Provides information provided by listLaunchPoints,running, and listApps APIs. Gets all of the launchpoints and lists all of the registered applications. Lists the background/foreground applications and their process IDs that are running on device.
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
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'Error Codes' section of this method for details.launchPointsOptionalObject array: launchPoints
Array of the launch points.lunaTasksOptionalObject array
Provides information of caller of dev/managerInfo API.runningOptionalObject array: running_apps
Indicates the background/foreground applications and their process IDs that are running on device.appsOptionalObject array: appInfo
Lists all of the registered applications.
Error Codes Reference

Error Code
Error Text
Error Description3invalid parameter
For invalid parameter.
Examples

Example

# luna-send -i -f luna://com.webos.applicationManager/dev/managerInfo '{}'
Response:
{
"launchPoints":[
{
"checkUpdateOnLaunch":true,
"title":"Bare App",
"icon":"/usr/palm/applications/bareapp/icon.png",
"tileSize":"normal",
"inAppSetting":false,
"miniicon":"icon.png",
"folderPath":"/usr/palm/applications/bareapp",
"lptype":"default",
"transparent":false,
"icons":[

],
"version":"1.0.1",
"hasPromotion":false,
"lockable":true,
"trustLevel":"default",
"bgImage":"",
"systemApp":true,
"launchPointId":"bareapp_default",
"main":"index.html",
"visible":true,
"largeIcon":"/usr/palm/applications/bareapp/icon.png",
"privilegedJail":false,
"inspectable":false,
"imageForRecents":"",
"defaultWindowType":"card",
"vendor":"LG Electronics, Inc.",
"accessibility":{
"supportsAudioGuidance":false
},
"deeplinkingParams":"",
"type":"web",
"spinnerOnLaunch":true,
"id":"bareapp",
"disableBackHistoryAPI":false,
"favicon":"",
"handlesRelaunch":false,
"noSplashOnLaunch":false,
"removable":false,
"unmovable":false,
"uiRevision":"2"
},
{
"v8SnapshotFile":"snapshot_blob.bin",
"checkUpdateOnLaunch":true,
"requiredPermissions":[
"com.example.service.iotivity.client.group",
"com.example.service.iotivity.server.group",
"notification.operation"
],
"title":"IoTivity Sampler",
"icon":"/usr/palm/applications/com.example.app.iotivity/icon.png",
"tileSize":"normal",
"inAppSetting":false,
"folderPath":"/usr/palm/applications/com.example.app.iotivity",
"lptype":"default",
"transparent":false,
"version":"1.0.0",
"trustLevel":"default",
"hasPromotion":false,
"lockable":true,
"icons":[

],
"bgImage":"",
"launchPointId":"com.example.app.iotivity_default",
"systemApp":true,
"main":"index.multi.html",
"visible":true,
"largeIcon":"",
"privilegedJail":false,
"inspectable":false,
"imageForRecents":"",
"defaultWindowType":"card",
"vendor":"LGE",
"type":"web",
"deeplinkingParams":"",
"accessibility":{
"supportsAudioGuidance":false
},
"spinnerOnLaunch":true,
"id":"com.example.app.iotivity",
"disableBackHistoryAPI":false,
"favicon":"",
"handlesRelaunch":false,
"noSplashOnLaunch":false,
"removable":false,
"unmovable":false,
"usePrerendering":true,
"uiRevision":2
}
],
"returnValue":true,
"lunaTasks":[
{
"caller":"com.webos.lunasend-1851",
"kind":"/dev/managerInfo"
}
],
"running":[
{
"appType":"web",
"displayId":0,
"instanceId":"03419c62-edad-4031-8ffb-c2494170befc0",
"launchPointId":"com.webos.app.volume_default",
"webprocessid":"1161",
"id":"com.webos.app.volume",
"processid":"-1",
"defaultWindowType":"system_ui"
},
{
"appType":"web",
"displayId":0,
"instanceId":"0b4c885e-e9c2-4923-9ad3-2ff663cc3c320",
"launchPointId":"com.webos.app.notification_default",
"webprocessid":"1156",
"id":"com.webos.app.notification",
"processid":"434",
"defaultWindowType":"system_ui"
},
{
"appType":"web",
"displayId":0,
"instanceId":"457dcbb0-76ab-4fa7-9c0f-ffa9cbca44110",
"launchPointId":"bareapp_default",
"webprocessid":"1043",
"id":"bareapp",
"processid":"434",
"defaultWindowType":"card"
},
{
"appType":"web",
"displayId":0,
"instanceId":"61a9142a-f21f-4ab1-ac37-2aeeed660cb50",
"launchPointId":"com.webos.app.home_default",
"webprocessid":"1064",
"id":"com.webos.app.home",
"processid":"434",
"defaultWindowType":"system_ui"
}
],
"apps":[
{
"checkUpdateOnLaunch":true,
"title":"Bare App",
"icon":"icon.png",
"tileSize":"normal",
"inAppSetting":false,
"miniicon":"icon.png",
"folderPath":"/usr/palm/applications/bareapp",
"transparent":false,
"version":"1.0.1",
"icons":[

],
"hasPromotion":false,
"lockable":true,
"trustLevel":"default",
"systemApp":true,
"largeIcon":"icon.png",
"main":"index.html",
"visible":true,
"privilegedJail":false,
"inspectable":false,
"defaultWindowType":"card",
"vendor":"LG Electronics, Inc.",
"deeplinkingParams":"",
"type":"web",
"accessibility":{
"supportsAudioGuidance":false
},
"spinnerOnLaunch":true,
"id":"bareapp",
"disableBackHistoryAPI":false,
"handlesRelaunch":false,
"noSplashOnLaunch":false,
"removable":false,
"unmovable":false,
"uiRevision":"2"
},
{
"v8SnapshotFile":"snapshot_blob.bin",
"checkUpdateOnLaunch":true,
"requiredPermissions":[
"com.example.service.iotivity.client.group",
"com.example.service.iotivity.server.group",
"notification.operation"
],
"title":"IoTivity Sampler",
"icon":"icon.png",
"tileSize":"normal",
"inAppSetting":false,
"folderPath":"/usr/palm/applications/com.example.app.iotivity",
"transparent":false,
"version":"1.0.0",
"icons":[

],
"hasPromotion":false,
"lockable":true,
"trustLevel":"default",
"systemApp":true,
"main":"index.multi.html",
"visible":true,
"privilegedJail":false,
"inspectable":false,
"defaultWindowType":"card",
"accessibility":{
"supportsAudioGuidance":false
},
"deeplinkingParams":"",
"type":"web",
"vendor":"LGE",
"spinnerOnLaunch":true,
"id":"com.example.app.iotivity",
"disableBackHistoryAPI":false,
"handlesRelaunch":false,
"noSplashOnLaunch":false,
"removable":false,
"unmovable":false,
"usePrerendering":true,
"uiRevision":2
}
]
}
dev/running

ACG: application.devmode

Added: API level 11
Description
Lists the background/foreground applications and their process IDs that are running on the webOS platform.
Note:
Available only in developer mode (devmode). To enable devmode, call 'com.webos.service.devmode' ('setDevMode') with value 'true'.
Works for devmode app type.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribe to get notifications
false: Not subscribed
Default: false
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed.
Note: returnValue will always contain true.subscribedOptionalBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribe to get notifications
false: Not subscribedrunningRequiredObject array: running_apps
If the dev/running method succeeds, the array of the running applications will be returned.
Subscription Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. See the API Error Codes Reference for more information.
Note: returnValue will always contain true.subscribedOptionalBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribe to get notifications
false: Not subscribedrunningRequiredObject array: running_apps
If the dev/running method succeeds, the array of the running applications will be returned
Examples

Example: Success

# luna-send -i -f luna://com.webos.service.applicationmanager/dev/running '{
"subscribe":true
}'
Response:
{
"subscribed":true,
"running":[
{
"id":"com.webos.app.test",
"webprocessid":"",
"defaultWindowType":"card",
"appType":"native",
"processid":"1176"
}
],
"returnValue":true
}
getAppBasePath

ACG: application.operation

Added: API level 11
Description
Gets the path of the application.
Note: This API is useful to get base directory path of installed application.
Parameters

Name
Required
Type
DescriptionappIdRequiredString
Indicates the appId.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check "errorText" field for details.appIdOptionalString
Indicates the appId.basePathOptionalString
Indicates the application path.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "Error Codes" section of this method for details.errorCodeOptionalNumber
The error code for the failed operation.
Error Codes Reference

Error Code
Error Text
Error DescriptionNoneNot allowed. Allow only for the info of calling app itself.
Not allowed. Allow only for the information of calling application itself.NoneError parsing request:Missing required key
Missing required key.NoneError parsing request:Not string
Invalid type value.
Examples

Example code

# luna-send -n 1 -a "bareapp" -f luna://com.webos.service.applicationmanager/getAppBasePath '{
"appId":"bareapp"
}'
getAppInfo

ACG: application.operation

Added: API level 11
Description
Gets the application information.
Note: The information is generated from appinfo.json file.
Parameters

Name
Required
Type
DescriptionidRequiredString
Indicates the id of the application.propertiesOptionalString array
Indicates the value to be extracted from appinfo.json file.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check "errorText" field for details.appIdOptionalString
Indicates the appld.appInfoOptionalObject: appInfo
If the getAppinfo method succeeds, the appInfo object contains information about the application.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "Error Codes Reference" section of this method for details.errorCodeOptionalNumber
The error code for the failed operation.
Error Codes Reference

Error Code
Error Text
Error DescriptionNoneInvalid appId specified
Invalid appId is specified. That is, the 'id' parameter is empty.Noneparameters must contain a 'id' (string)
Parameters must contain an 'id' (string).NoneInvalid appId specified OR Unsupported Application Type
Invalid appId is specified or an unsupported application type.
Examples

Example: Success

# luna-send -n 1 -f luna://com.webos.service.applicationmanager/getAppInfo '{
"id":"com.webos.app.test"
}'
Response:
{
"appInfo":{
"..."
},
"appId":"com.webos.app.test",
"returnValue":true
}
getAppLifeEvents

ACG: application.operation

Added: API level 11
Description
Provides the application's event status in its life cycle.
Parameters

Name
Required
Type
DescriptionsubscribeRequiredBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribed for notifications
false: Not subscribed
Default: false
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.subscribedRequiredBoolean
Indicates if subscribed to get notifications.
true: Subscribe for notifications
false: Not subscribederrorTextOptionalString
Indicates the reason for the failure of the operation. See the "API Error Codes Reference" section for details.errorCodeOptionalNumber (int8_t)
The error code for the failed operation.
Subscription Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.subscribedRequiredBoolean
Indicates if subscribed to get notifications.
true: Subscribe for notifications
false: Not subscribedappIdRequiredString
Indicates the appId whose event has been changed.launchPointIdOptionalString
Indicates the launchPointId of the app.instanceIdOptionalString
Indicates the instanceId of the app.displayIdOptionalNumber
Indicates the displayId of the app.eventRequiredString
Indicates the application's status.
Possible values are:
splash
preload
launch
foreground
background
pause
close
stoptitleOptionalString
Indicates the application title as it is shown in the launcher and in the application window.
Note: It is included only when event type is "splash".showSplashOptionalBoolean
Indicates if splash image is shown. This value is set during app scanning.
Possible values are:
true: Splash image is shown.
false: Splash image is not shown.
Note: It is included only when event type is "splash".showSpinnerOptionalBoolean
Indicates if the spinner is shown. The value is set during app scanning.
Possible values are:
true: Spinner is shown.
false: Spinner is not shown.
Note: It is included only when event type is "splash".splashBackgroundOptionalString
Indicates the background image to be shown while the application is loading.
Example: splash-background.png.
Note: It is included only when the event type is "splash".preloadOptionalBoolean
Indicates the current preload status.
Possible values are:
full
semi-full
partial
minimal
Note: It is included only when the event type is "preload".reasonOptionalString
Indicates the reason behind the launching/closing of the target app.
Note: It is included only when event type is "launch/close/stop".windowTypeOptionalString
Indicates the windowType of the application.
Note: It is included only when event type is "foreground".windowGroupOptionalString
Indicates if the application has windowGroup or not.
Note: It is included only when event type is "foreground".windowGroupOwnerOptionalString
Indicates that the application has WindowGroupOwner or not.
Note: It is included only when event type is "foreground".windowGroupOwnerIdOptionalString
Indicates the windowGroupOwner of the application.
Note: It is included only when event type is "foreground".statusOptionalString
Indicates the current background status.
Possible values are:
preload
normal
Note: It is included only when event type is "background".
Examples

Example : With subscription - success

# luna-send -i -f luna://com.webos.service.applicationmanager/getAppLifeEvents '{"subscribe":true}'
Response:
{
"subscribed":true,
"returnValue":true
}

Example: Without subscription - error case

# luna-send -i -f luna://com.webos.service.applicationmanager/getAppLifeEvents '{}'
Response:
{
"subscribed":false,
"errorCode":1,
"returnValue":false,
"errorText":"subscription is required"
}
getAppLifeStatus

ACG: application.operation

Added: API level 11
Description
Provides the application's life cycle status.
Note: This API is useful to do something based on application's life cycle status.
Parameters

Name
Required
Type
DescriptionsubscribeRequiredBoolean
Indicates if subscribed to get the notifications.
Possible values are:
true: Subscribe to get notifications
false: Not subscribed.
Default: false
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check "errorText" field for details.subscribedRequiredBoolean
Indicates if subscribed to get the notifications.
Possible values are:
true: Subscribe to get notifications
false: Not subscribed.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "Error Codes" section of this method for details.
Subscription Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check "errorText" field for details.subscribedRequiredString
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribed for notifications
false: Not subscribedappIdOptionalString
Indicates the appId whose status has been changed.launchPointIdOptionalString
Indicates the launchPointId of the application.instanceIdOptionalString
Indicates the instanceId of the application.statusOptionalString
Indicates the status of the application.
Possible values are:
stop
launching
relaunching
foreground
background
closingtypeOptionalString
Indicates the application type.
Possible values are:
web
nativeprocessIdOptionalString
Indicates the processId of the application.displayIdOptionalNumber
Indicates the displayId of the application.reasonOptionalString
In LAUNCHING/RELAUNCHING status, indicates the reason for the launching the target app.
In CLOSING/STOP status, indicates the reason for closing the target app.windowTypeOptionalString
Indicates the windowType of the application.
Note: This reason is replied only in FOREGROUND status.windowGroupOptionalBoolean
Indicates that the app has window group or not.
Note: This reason is replied only in FOREGROUND status.windowGroupOwnerOptionalBoolean
Indicates that the app is window group owner or not.
Note: This reason is replied only in FOREGROUND status.windowGroupOwnerIdOptionalString
Indicates the window group owner of the app.
Note: This reason is replied only in FOREGROUND status.backgroundStatusOptionalString
Indicates whether the app is preloaded or not.
Note: This reason is replied only in BACKGROUND status.
Error Codes Reference

Error Code
Error Text
Error DescriptionNonesubscription is needed
"subscribe": true parameter is needed.
Examples

Example: Success

AppLifeStatus can be subscribed by below command,
# luna-send -i -f luna://com.webos.service.applicationmanager/getAppLifeStatus '{
"subscribe":true
}'
Response:
{
"subscribed":true,
"returnValue":true
}
When barenativeqt is launched, outputs are shown like below.
{
"reason":"",
"appId":"barenativeqt",
"status":"launching",
"type":"native"
}
When barenativeqt is closed, below outputs are shown.
{
"reason":"undefined",
"appId":"barenativeqt",
"status":"stop",
"processId":"932",
"type":"native"
}
getAppStatus

ACG: application.operation

Added: API level 11
Description
Gets the application status and information.
Parameters

Name
Required
Type
DescriptionappIdRequiredString
Indicates the appld.appInfoOptionalObject: appInfo
Indicates the information of the application.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.appIdRequiredString
Indicates the target appld.eventRequiredString
Indicates event according to the target app status.statusRequiredString
Indicates the current app status. existRequiredBoolean
Indicates if target app is present on the device.
Possible values are:
true: Target app exists on the device.
false: Target app does not exist on the device. launchableRequiredBoolean
Indicates whether the target app could be launched or not.
Possible values are:
true: Target app could be launched.
false: Target app could not be launched. appInfoOptionalObject: appInfo
If the getAppStatus method succeeds and the parameter "appInfo" is true, the appInfo object contains information about the application.errorCodeOptionalNumber (int8_t)
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "API Error Codes Reference" section for details.
Subscription Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. appIdRequiredString
Indicates the target appld.eventRequiredString
Indicates the event according to the target app status.statusRequiredString
Indicates the current app status. existRequiredBoolean
Indicates if target app is present on the device.
Possible values are:
true: Target app exists on the device.
false: Target app does not exist on the device.launchableRequiredBoolean
Indicates whether the target app could be launched or not. Possible values are:
true: Target app could be launched.
false: Target app could not be launched. appInfoOptionalObject array: appInfo
If the getAppStatus method succeeds and the parameter "appInfo" is true, the appInfo object contains information about the application.
Examples

Example: Without appInfo

# luna-send -n 1 -f luna://com.webos.service.applicationmanager/getAppStatus '{
"appId":"com.webos.app.browser"
}'
Response:
{
"event":"nothing",
"appId":"com.webos.app.browser",
"status":"launchable",
"exist":true,
"launchable":true,
"returnValue":true
}

Example: With appInfo

# luna-send -n 1 -f luna://com.webos.service.applicationmanager/getAppStatus '{
"appId":"com.webos.app.browser",
"appInfo":true
}'
Response:
{
"event":"nothing",
"appInfo":{
"...."      "id":"com.webos.app.browser",
"title":"Web Browser",
"...."
},
"appId":"com.webos.app.browser",
"status":"launchable",
"exist":true,
"launchable":true,
"returnValue":true
}

Example: Fail

Example response for a failed call:
# luna-send -n 1 -f luna://com.webos.service.applicationmanager/getAppStatus '{
"id":"com.webos.app.browser"
}'
Response:
{
"errorCode":2,
"returnValue":false,
"errorText":"invalid parameters"
}
getForegroundAppInfo

ACG: application.operation

Added: API level 11
Description
Gets the information on the foreground application.
Note: The information comes from LSM. Please use extraInfo parameter to get raw responsePayload from LSM.
Parameters

Name
Required
Type
DescriptionextraInfoOptionalBoolean
Indicates if enabled, the method returns an array of foreground applications.
true: Enable.
false: Disable.
Default: false.subscribeOptionalBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribed to get notifications
false: Not subscribed
Default: false
Call Returns

Name
Required
Type
DescriptionsubscribedOptionalBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribed to get notifications
false: Not subscribedreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed.
Default: trueappIdOptionalString
Indicates the appId running in the foreground.launchPointIdOptionalString
Indicates the launchPointId of the application.instanceIdOptionalString
Indicates the instanceId of the application.displayIdOptionalNumber
Indicates the displayId of the application.windowIdRequiredString
Indicates the windowId of the application running in the foreground. processIdOptionalString
Indicates the processId of the application running in the foreground.foregroundAppInfoOptionalObject array: foregroundAppInfo
Indicates an array of the foreground application.
Subscription Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed.
Default: truesubscribedRequiredBoolean
Indicates if subscribed to get the notifications.
Possible values are:
true: Subscribed to get the notifications
false: Not subscribed
Default: trueappIdRequiredString
Indicates the application ID of the application running in the foreground.launchPointIdOptionalString
Indicates the launchPointId of the application.instanceIdOptionalString
Indicates the instanceId of the application.displayIdOptionalNumber
Indicates the displayId of the application.windowIdRequiredString
Indicates the windowId of the application running in the foreground. processIdRequiredString
Indicates the processId of the application running in the foreground.foregroundAppInfoOptionalObject array: foregroundAppInfo
Indicates an array of the foreground application.
Examples

Example: Without subscription

# luna-send -n 1 -f luna://com.webos.service.applicationmanager/getForegroundAppInfo '{}'
Response:
{
"appId":"bareapp",
"returnValue":true,
"processId":""
}

Example: With subscription

# luna-send -i -f luna://com.webos.service.applicationmanager/getForegroundAppInfo '{"subscribe":true}'
Response:
{
"appId":"bareapp",
"subscribed":true,
"returnValue":true,
"processId":""
}

Example: With extraInfo

# luna-send -i -f luna://com.webos.service.applicationmanager/getForegroundAppInfo '{"subscribe":true, "extraInfo":true}'
Response:
{
"subscribed":true,
"foregroundAppInfo":[
{
"instanceId":"c057ba89-6de6-4807-a5fe-81e8af4aac700",
"windowGroup":false,
"appId":"bareapp",
"windowType":"_WEBOS_WINDOW_TYPE_CARD",
"params":{
},
"processId":"719"
}
],
"returnValue":true
}
launch

ACG: application.launcher

Added: API level 11
Description
Launches an application corresponding to the given application ID. Opens the service or app.
Example: The user can download a content with a service in the background. Once the content is downloaded, the service must launch the app again.
Parameter can be given in the JSON object during the launch of the application. The method can be called multiple times for the same application with different parameters. Application should handle these overtime requests. Generally, application is re-launched for every request.
Note : At least one parameter is required. ('id', 'launchPointId', 'instanceId')
Parameters

Name
Required
Type
DescriptionidOptionalString
Indicates the application ID to be launched.launchPointIdOptionalString
Indicates the launch point ID of the app.instanceIdOptionalString
Indicates the instance ID of the app.paramsOptionalObject: params
If params is used, it should contain information on the target application. Specify correct parameters for each application. See the following parameter examples:
YouTube application: "params":{ "contentTarget" : "https://www.youtube.com/tv?v=9bZkp7q19f0"}
Today application: "params":{"type":"showRecordedList"}keepAliveOptionalBoolean
Indicates the status of the application running in the background.
Possible values are:
true: To run the application in the background, set keepAlive to true.
false: To terminate the application, set keepAlive to false.
Default: keepAlive is set to false.
Note: Only applicable to web app. Do not use keepAlive for native app launching. An web App, which is launched with this parameter, can be killed when memory status is low or critical.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "API Error Codes Reference" section of this method for details.instanceIdOptionalString
Indicates the instanceId of the running application.launchPointIdOptionalString
Indicates the launchPointId of running application.appIdOptionalString
Indicates the appld of the running application.displayIdOptionalNumber (uint32_t)
Indicates the displayId of the running application.
Examples

Example: Launching app without parameter

# luna-send -n 1 -f luna://com.webos.service.applicationmanager/launch '{
"id":"com.yourdomain.callee"
}'
{
"launchPointId": "com.yourdomain.callee_default",
"appId": "com.yourdomain.callee",
"returnValue": true,
"displayId": 0,
"instanceId": "a3effa8b-fe4a-4f5c-953b-0d326c0d2ef20"
}

Example: Launching app with parameters

# luna-send -n 1 -f luna://com.webos.service.applicationmanager/launch '{
"id":"com.yourdomain.callee",
"params": {
"customParam1": "value1"
}
}
{
"launchPointId": "com.yourdomain.callee_default",
"appId": "com.yourdomain.callee",
"returnValue": true,
"displayId": 0,
"instanceId": "a3effa8b-fe4a-4f5c-953b-0d326c0d2ef20"
}
listApps

ACG: application.operation

Added: API level 11
Description
Lists all of the registered applications.
Note: Client can get all installed application information using this API.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Indicates if subscribe to get notifications.
Possible values are:
true: Subscribe for notifications
false: Not subscribed
Default: falsepropertiesOptionalString array
Indicates the value to be extracted from appinfo.json file.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed.
Default: trueappsRequiredObject array: appInfo
If the listApps method succeeds, the array of the applications will be returned.subscribedOptionalBoolean
Indicates if subscribe to get notifications.
Possible values are:
true: Subscribe for notifications
false: Not subscribed
Subscription Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed.appsRequiredObject array: appInfo
Either this, or app is required.
apps is returned when all apps' information has been changed by language change.appRequiredObject array: appInfo
Either this, or apps is required.
app is returned the information of an app which has been installed/updated/removed.subscribedRequiredBoolean
Indicates if subscribe to get notifications.
Possible values are:
true: Subscribe for notifications
false: Not subscribed
Default: truechangeOptionalString
Indicates the reason why the app’s information has been changed.
Possible values are:
“added”
“updated”
“removed”changeReasonOptionalString
Indicates the reason behind the target app being added/removed.
Examples

Example: Success

This method returns information for all apps at first.
# luna-send -i -f luna://com.webos.service.applicationmanager/listApps '{
"subscribe":true
}'
Response:
{
"subscribed":true,
"apps":[
{
"...."
}
],
"returnValue":true
}
When an app is update/removed/installed, the method returns only changed app's information
{
"subscribed":true,
"change":"removed",
"returnValue":true,
"app":{
"..."
}
}
listLaunchPoints

ACG: application.operation

Added: API level 11
Description
Gets all of the launchpoints.
Note: LaunchPoint is the virtual instance of an application. The webOS provides shortcut based on launchPoint.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribed for notifications
false: Not subscribed
Default: false
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed.
Note: returnValue will always contain true.subscribedRequiredBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribed for notifications
false: Not subscribedlaunchPointsRequiredObject array: launchPoints
If the listLaunchPoints method succeeds, the array of the launchpoints will be returned.
Subscription Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.subscribedRequiredString
Indicates if subscribed to get the notifications.
Possible values are:
true: Subscribed for notifications
false: Not subscribed
Default: truelaunchPointOptionalObject
Returned if only one app's launchPoint is changed by updating/removing/installing.changeOptionalString
Indicates the change in the status of the launch point.
Possible values are:
added
updated
removedfaviconOptionalString
Favorite icon image displayed for the website.
Examples

Example code

# luna-send -n 1 -f luna://com.webos.service.applicationmanager/listLaunchPoints '{
"subscribe":true
}'
Response:
{
"subscribed":true,
"launchPoints":[
{
"id":"bareapp",
"..."
},
"..."
],
"returnValue":true
}
lockApp

ACG: application.launcher

Added: API level 11
Description
Locks an application.
Note:
Once it is locked, the application cannot be launched.
This method is only called internally. Do not use this method in your application.
Parameters

Name
Required
Type
DescriptionidRequiredString
The application ID to be locked.lockRequiredBoolean
Indicates if the application is locked.
Possible values are:
true: The application is locked, set lock to true. If set to true, the application cannot be launched.
false: The application is unlocked.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check "errorText" field for details.lockedOptionalBoolean
Indicates if the application is locked or unlocked.
Possible values are:
true: The application is locked
false: The application is unlockedidOptionalString
Indicates the application ID which is locked or unlocked.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "Error Codes" section of this method for details.
Error Codes Reference

Error Code
Error Text
Error Description2was not found OR Unsupported Application Type
Requested id was not found OR Unsupported Application id3invalid parameters
Requested parameters are invalid
open

ACG: applications,applications.launch,applications.internal
Retired

Added: API level 29
Deprecated: API level 29
Retired: API level 29
Description
The open method implicitly opens an application based on the target URL or MIME type.
Caution: Using this method is not recommended due to insecurity.
Parameters

Name
Required
Type
DescriptionidOptionalString
The application ID to be launched.targetRequiredString
A specific URL that is used in the browser application. It is automatically included under params object. The id parameter is substituted with the target parameter. If application ID is not specified, the target is open with an appropriate application.mimeRequiredString
The mime identifies which application should be used for the specific file or URL. The MIME type usually identifies files, such as mp3, on all operation systems as well as stores the unique application signatures for application launching.paramsOptionalObject: params
If params is used, it should contain information on the target application. You should specify correct parameters for each application. See the following parameter examples:
YouTube application: "params":{ "contentTarget" : "https://www.youtube.com/tv?v=9bZkp7q19f0"}
Today application: "params":{"type":"showRecordedList"}
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
If the open method succeeds, returnValue will contain true.
If the open method fails, returnValue will contain false. The method may fail because of one of the error conditions described in the API Error Codes Reference of this service. See the API Error Codes Reference for more information.errorCodeOptionalString
The open method will return errorCode only if it fails. See the API Error Codes Reference of this service for more details.errorTextOptionalString
The open method will return errorText only if it fails. See the API Error Codes Reference of this service for more details.
Examples

Example code

Example response for a successful call:
# luna-send -n 1 -f luna://com.webos.service.applicationmanager/open '{"mime": "text/html" }'
{
"returnValue": true,
"processId": "n-2590"
}

# luna-send -n 1 -f luna://com.webos.service.applicationmanager/open '{"target":"http://www.google.co.kr"}'
{
"returnValue": true,
"processId": "n-3017"
}

Example response for a failed call:
# luna-send -n 1 -f luna://com.webos.service.applicationmanager/open '{"target":"invalid.test"}'
{
"errorCode": -6,
"returnValue": false,
"errorText": "No handler for invalid.test"
}
pause

ACG: application.launcher

Added: API level 11
Description
Pauses an application.
Note: At least one parameter is required. ('id', 'launchPointId', 'instanceId')
Parameters

Name
Required
Type
DescriptionidOptionalString
Indicates the id of the application.launchPointIdOptionalString
Indicates the launchPointId of the application.instanceIdOptionalString
Indicates the instanceId of the application.paramsOptionalObject
If params is used, it should contain information on the target application.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.errorCodeOptionalNumber (int8_t)
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "API Error Codes Reference" section for details.instanceIdOptionalString
Indicates the instanceId of the running application.launchPointIdOptionalString
Indicates the launchPointId of the running application.appIdOptionalString
Indicates the appId of the running application.displayIdOptionalNumber (int32_t)
Indicates the displayId of the running application.
Examples

Example code

# luna-send -n 1 -f luna://com.webos.service.applicationmanager/pause '{
"id":"com.webos.app.test"
}'
Response:
{
"returnValue":true
}
registerApp

ACG: application.operation

Added: API level 11
Description
Registers to receive events related to app life cycle.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Indicates if subscribed to get events.
Possible values are:
true: (default) Subscribed to get events data
false: Not subscribed
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed.eventOptionalString
Possible value is "registered", this is return when calling registerApp for the first time.errorCodeOptionalNumber
Please refer to the errorcode reference.errorTextOptionalString
Please refer to the errorcode reference.subscribedOptionalBoolean
indicates if subscribed to get events.
Possible values are:
true: Subscribed to get events
false: Not subscribed
Subscription Returns

Name
Required
Type
DescriptioneventRequiredString
​Indicates the event that is triggered.
Possible values are:
relaunch: Triggered when an already registered application is launched.
pause: Triggered when transitioning the foreground app to the background. The close event is delivered only when memory manager terminates.
close: Triggered when the registered application is closed.returnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed.parametersOptionalObject: params
Indicates the information to be delivered to the registered app.reasonOptionalString
Indicates the reason for the app to be launched/pause/closed.
Note: Always has the callerId value.appIdOptionalString
Indicates the ID of the registered app. subscribedOptionalBoolean
indicates if subscribed to get events.
Possible values are:
true: Subscribed to get events
false: Not subscribed
Error Codes Reference

Error Code
Error Text
Error Description2"application is not running" or "The app is already registered"
"application is not running"  :  It indicates that requested application does not exist in the running list.
"The app is already registered" : It indicates that requested application is already registered.3invalid parameters
API requested with invalid parameter
removeLaunchPoint

ACG: application.launcher

Added: API level 11
Description
Removes a dynamic launchpoint.
Note: It can cause application uninstall.
Parameters

Name
Required
Type
DescriptionlaunchPointIdRequiredString
Indicates the launchpoint ID to be removed.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.errorCodeOptionalNumber (int8_t)
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "API Error Codes Reference" section for more details.
Error Codes Reference

Error Code
Error Text
Error DescriptionNoneinvalid json request
Invalid JSON request.Nonecannot find launch point info
Cannot find launch point information for launchPointId.
Examples

Example: With launchPointid

# luna-send -n 1 -f luna://com.webos.service.applicationmanager/removeLaunchPoint '{
"launchPointId":"178884"
}'
Response:
{
"returnValue":true
}
running

ACG: application.launcher

Added: API level 11
Description
Lists the background/foreground applications and their process IDs that are running on webOS platform.
Note: This API is one of key methods of applicationmanager.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribe to get notifications
false: Not subscribed
Default: false
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed.
Default: truesubscribedOptionalBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribe to get notifications
false: Not subscribedrunningRequiredObject array: running_apps
If the running method succeeds, the array of the running applications will be returned.
Subscription Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed.
Default: truesubscribedOptionalBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribe to get notifications
false: Not subscribedrunningRequiredObject array: running_apps
If the running method succeeds, the array of the running applications will be returned.
Examples

Example: Success

# luna-send -i -f luna://com.webos.service.applicationmanager/running '{
"subscribe":true
}'
Response:
{
"subscribed":true,
"running":[
{
"id":"bareapp",
"..."
}
],
"returnValue":true
}
updateLaunchPoint

ACG: application.launcher

Added: API level 11
Description
Updates a dynamic launchpoint.
Note: If a user changes the HDMI application icon to another icon like a game icon using Input Manager on a TV, the HDMI application icon is dynamically
changed to the new icon on the launcher.
Parameters

Name
Required
Type
DescriptionlaunchPointIdRequiredString
Indicates the launchpoint ID to be updated.
Note: Both launchPointId and one or more parameters (title, icon, etc) need to be passed from service user.titleOptionalString
Indicates the launchpoint title.iconOptionalString
Indicates the path of the icon image displayed for the launchpoint.bgImageOptionalString
Indicates the path of the background image displayed to the user when the user hovers over the launchpoint.
Format: color hex code (ex. #000000(black))
http://www.color-hex.com/bgColorOptionalString
Indicates the background color for the launchpoint. It will be displayed when the bgImage is not provided or unable to display. A color can be specified as a hex value or as a HTML color name.imageForRecentsOptionalString
Indicates the path of the image displayed in the Recents tile.iconColorOptionalString
Indicates the background color for the application tile. The application tile is displayed in the Home, the Launcher, and the Recent screen.
Format: color hex code (ex. #000000(black))
http://www.color-hex.com/largeIconOptionalString
Indicates the path of the large icon (130x130 pixels) displayed in the top left corner of the screen, when the user hovers over an application tile in the Launcher.
Note: This file path is relative to the appinfo.json file.appDescriptionOptionalString
Indicates a brief description for the launchpoint.
Note: The appDescription cannot exceed 60 characters.paramsOptionalObject: params
If params is used, it should contain information on the launchpoint which will be passed to the application.bgImagesOptionalString array
Indicates the paths of the background images displayed to the user when the user hovers over the launchpoint.tileSizeOptionalString
Indicates the tile size on UI.
Possible values are
normal
large.
Default: normal
Note:
The large tile hints that UI should make this tile larger than normal (2x).
Usually, large size may be used for promotional application.unmovableOptionalBoolean
Indicates if the launchpoint position is movable or not.
Possible values are:
true: The launchpoint position cannot be moved by the user.
false: the launchpoint position can be moved by the user.
Default: falseuserDataOptionalString
Indicates the additional data that may be used for analytical purposes.
Note: The userData will simply be logged when the user interacts with it in Launcher.iconsOptionalObject array
Indicates the list of icon images.
Note: The icons will be shown in the launch point alternately.faviconOptionalString
Indicates the favorite icon image displayed for the website.policyCategoryOptionalString
Indicate a category(group) of the launch point. The value should be the one of below mapping table.
*$RESERVED_VALUE is for special callers to be controlled by LPM.ValueLaunch Point TypepositiondefaultAny9*$RESERVED_VALUE$RESERVED_LP$RESERVED_POSITIONrelaunchOptionalBoolean
Indicates if the target app is re-launched whenever the launch point is clicked. (Not fast-switching)
Note: This parameter is deprecated in IvyLeague.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.errorCodeOptionalNumber (int8_t)
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "API Error Codes Reference" section for more details.
Error Codes Reference

Error Code
Error Text
Error DescriptionNoneinvalid json request
Invalid JSON request.Nonecannot find launch point info
Cannot find launch point information for launchPointId.
Examples

Example: With launchPointId and title

# luna-send -n 1 -f luna://com.webos.service.applicationmanager/updateLaunchPoint '{
"launchPointId":"178884",
"title":"Test"
}'
Response:
{
"returnValue":true
}

Example: Insufficient parameters

# luna-send -n 1 -f luna://com.webos.service.applicationmanager/updateLaunchPoint '{
"launchPointId":"178884"
}'
Response:
{
"returnValue":false,
"errorText":"Insufficient parameters"
}
Objects

appInfo

Added: API level 29
Description
Contains the information about the application.
Properties

Name
Required
Type
DescriptionidRequiredString
Indicates the application ID.
Example: \"com.newco.app.myApp\"
Note:
Every application has a unique ID, created from reverse DNS naming conventions.
The launcher uses the ID to uniquely identify application and displays it with the title above.
The application ID is unique,can only be set once, and cannot be changed after publishing the application.mainRequiredString
Indicates the launchpoint of the application.
Note: This is a file path relative to the appinfo.json file and needs to point to an HTML file.titleRequiredString
Indicates the application title as it is shown in the launcher and in the application window.
Note: The application title is unique, set once.keywordsOptionalString array
Indicates the keyword metadata.
Note: The types contain the user-entered text in their keywords values.mimeTypesOptionalString array
Indicates the internet standard for defining the content type.
Note: Used for mime system.iconRequiredString
Indicates the path of the icon image displayed for the application.
Note: The file path is relative to the appinfo.json file. The default is \"icon.png\"largeIconOptionalString
The path of the large icon (130x130 pixels) displayed in the top left corner of the screen, when the user hovers over an application tile in the Launcher. This file path is relative to the appinfo.json file.mediumIconOptionalString
The medium sized icon. This is a file path relative to the appinfo.json file. e.g., mediumIcon: 96x96.png.typeRequiredString
The application type; web or pdk.splashiconOptionalString
The splash icon to be shown over splash background while application is loading, e.g., icon: 256x256.png.splashBackgroundOptionalString
The background image to be shown while application is loading, e.g., splash-background.png.miniiconOptionalString
Used for notifications. This is a file path relative to the appinfo.json file.launchinnewgroupOptionalBoolean
This indicates whether to prevent application from launching in the current card stack.categoryOptionalString
The application category such as game, business, documentation, lifestyle.vendorOptionalString
The application owner used in the launcher and deviceinfo dialogs.vendorurlOptionalString
The URL that turns the vendor portion in deviceinfo dialogs to hyperlinks.appsizeOptionalNumber (int8_t)
The application size.noWindowOptionalBoolean
This indicates whether the application is headless or not.visibleOptionalBoolean
This indicates whether the launcher icons are visible or not. By default, the launcher icons are visible. transparentOptionalBoolean
This indicates whether the web application's background is transparent or not.classOptionalObject: class
The class object contains window behavior of the application in the compositor. For example, hidden indicates whether the application is hidden in Recents or not.trustLevelOptionalString
The trust level of application.versionOptionalString
The application version number, in the dot-notation format, e.g., 3.0.2500.removableOptionalBoolean
This indicates whether the application is removable or not.hardwareFeaturesNeededOptionalString array
This indicates the application need hardware features, e.g., WiFi, Bluetooth.bootLaunchParamsOptionalObject: params
The bootLaunchParams contains the boot application for launching.handlesRelaunchOptionalBoolean
This indicates whether the application is relaunched or not when a user executes application that is already running.requestedWindowOrientationOptionalString
The window orientation supported by various devices except for a TV: up, down, left, right, landscape, portrait.entrypointOptionalString
This parameter is required for sysmgrbuiltin application type.argsOptionalString
This field is required for sysmgrbuiltin application type.uiRevisionOptionalString
If this is set to 2, applications can make full use of the full screen; otherwise, the application is given a 320x480 window in which to display.timestampOptionalString
The time stamp.debugOptionalBoolean
This indicates whether the application is debug mode or not.vendorExtensionOptionalObject: params
If vendorExtension is used, it is specified whether the application supports cross domain.inspectableOptionalBoolean
This indicates whether the application is inspectable in Developer Mode or not, based on the application's installed location (/media/developer) or the presence of an \"inspectable\" field (if true) in the application's appinfo.json file.bgImageOptionalString
The path of the background image displayed to the user when the application is activated in the Launcher.bgColorOptionalString
The background color. It will be displayed when the bgImage is not provided or unable to display. A color can be specified as a hex value or as a HTML color name. deeplinkingParamsOptionalString
The parameter pattern for deep linking. Pattern must have \"$CONTENTID\" keyword which will be replaced with real content ID given by cloud.defaultWindowTypeOptionalString
The default window type of the application.
Used by WAM (WebAppMgr) to launch a window with a special window type setting.
The value will be one of the followings:
card
favoriteShows
minimal
overlay
popup
screenSaver
showcaseageOptionalNumber (int8_t)
The minimum age of the application viewer.imageForRecentsOptionalString
The path of the image displayed in the Recents tile.requiredMemoryOptionalNumber (int8_t)
The memory consumption is increasing quickly while launching. OOM can occur before system (Memory Manager) try to acquire adequate memory for the application.
The requiredMemory describes the maximum usage of memory, in megabytes, while an application is launching. This is not same as the maximum memory usage while the application is running.iconColorOptionalString
The background color for the application tile. The application tile is displayed in the Home, the Launcher, and the Recent screen.appDescriptionOptionalString
A short description for the application. The appDescription cannot exceed 60 characters.appDescriptionLongOptionalString
A long description for MVPD application. The appDescription can exceed 60 characters.noDeprecatedStylesOptionalBoolean
This indicates whether to suppress loading of the global-deprecated.css style sheet or to improve the framework loading time.inAppSettingOptionalBoolean
This indicates whether the application supports deeplinking for inAppSetting or not.disableBackHistoryAPIOptionalBoolean
This indicates whether to use of the HTML5 History API with Back key or not.privilegedJailOptionalBoolean
This indicates whether a native application is launched with native_builtin jail configuration or not.requiredEULAOptionalString
The EULA agreement which is required to launch application.lockableOptionalBoolean
This indicates whether the application is locked or not.checkUpdateOnLaunchOptionalBoolean
This indicates whether the SAM checks the update for the application or not.hasPromotionOptionalBoolean
This indicates whether the application has promotional contents or not.noSplashOnLaunchOptionalBoolean
This indicates whether the application is launched without splash screen or not.bgImagesOptionalString array
Indicates the paths of the background images displayed to the user when the application is activated in the launcher.tileSizeOptionalString
Indicates the tile size of the UI
Possible values are:
normal
large.
Default: normal
Note:
The large tile hints that the UI should make the tile larger than normal (2x).
Usually, large size is used for promotional application.unmovableOptionalBoolean
Indicates if the application is moved from its given position.
Possible values are:
true: The application is unmovable from the specified position
false: The application can is movable from the specified positioninstallTimeOptionalString
Indicates the unix time stamp of the appinfo.json file's last modification time for the installed / pre-installed application.containerJSOptionalString
Indicates the container-app.js file path.enyoVersionOptionalString
Indicates the Enyo version of the web application.spinnerOnLaunchOptionalBoolean
Indicates if the application is launched with the spinner.
Possible values are:
true: The application is launched with the spinner
false: The application is not launched with the spinnerfolderPathOptionalString
The package installed pathappCategoryOptionalString array
This specifies a category for the app. One of apps in the category could be launched by calling launchDefaultAppaccessibilityOptionalObject
Specify which accessibility feature this app supports
supportsAudioGuidance :Specify this app supports audio guidancerequiredPermissionsOptionalString array
Specifies the required Access Control Group (ACG) names associated with the LS2 API methods used in the app.iconsOptionalString array
Indicates the list of icon images.systemAppOptionalBoolean
It indicates that app is system (built-in) application or downloadable application.
if true means , application is an built-in else it is an downloadable application.
foregroundAppInfo

Added: API level 29
Description
The object contains sorted foreground applications in ascending order.
Properties

Name
Required
Type
DescriptioninstanceIdOptionalString
InstanceId of running application.appIdRequiredString
The application ID.processIdRequiredString
The process ID of the application running in the foreground.displayIdOptionalNumber
The display ID of application.windowGroupOptionalString
Description herewindowTypeOptionalString
Indicates window type associated with the surface.
Example:  _WEBOS_WINDOW_TYPE_CARDlaunchPointIdOptionalString
Indicates the launchPointId of the application.paramsOptionalObject
If params is used, it should contain information on the target application.
launchPoints

Added: API level 29
Description
Contains the array of launchpoints.
Properties

Name
Required
Type
DescriptionlptypeRequiredString
The launchpoint type: default, bookmark, group.idRequiredString
The application ID of the launchpoint.launchPointIdRequiredString
The unique launchpoint ID.removableRequiredBoolean
This indicates whether the application is removable or not.titleRequiredString
The application title as it is shown in the Launcher and in the application window. The application title is unique, set once.iconRequiredString
The image displayed for the application.iconColorRequiredString
The background color for the application tile. The application tile is displayed in the Home, the Launcher, and the Recent screen.largeIconRequiredString
The path of the large icon (130x130 pixels) displayed in the top left corner of the screen, when the user hovers over an application tile in the Launcher. This file path is relative to the appinfo.json file.appDescriptionRequiredString
A short description for the application. The appDescription cannot exceed 60 characters.paramsOptionalObject: params
The params object contains information on the target application. You should specify correct parameters for each application.userDataOptionalString
The additional data that may be used for analytical purposes. The userData will simply be logged when the user interacts with it in Launcher.
params

Added: API level 29
Description
Contains the parameters for the target application. Specify correct parameters for each application. As each application has different parameters, the parameters of params cannot be defined.
Properties
None
running_apps

Added: API level 29
Description
Indicates the object that contains the array of the running applications.
Properties

Name
Required
Type
DescriptionidRequiredString
The application ID.launchPointIdOptionalString
The launch point ID of the app. instanceIdOptionalString
The instance ID of the app.displayIdOptionalNumber
The display ID of the app.processIdRequiredString
The process ID of the application.webprocessidRequiredString
The webprocess ID of the application.defaultWindowTypeRequiredString
The default window type of the application.
Used by WAM (WebAppMgr) to launch a window with a special window type setting.
The value will be one of the followings:
card
minimal
overlay
popupappTypeRequiredString
The application type.
API Error Codes Reference

Error Code
Error Text
Error Description-312not allowed
EULA is not accepted.-203[ID] is already launching
The native application is already launching.-102[ID] has been locked.
Application has been locked.2application is not running
application is not running2id was not found OR Unsupported Application Type
id was not found OR Unsupported Application Type2The app is already registered
The app is already registered3invalid parameters
invalid parameters

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 and sample code is licensed under the Apache License 2.0.

Contents