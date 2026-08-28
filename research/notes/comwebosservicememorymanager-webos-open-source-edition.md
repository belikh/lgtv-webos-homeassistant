---
title: com.webos.service.memorymanager | webOS Open Source Edition
id: comwebosservicememorymanager-webos-open-source-edition
tags:
- lgtv-webos-ha-root-1a89ff
- locus-ultimate-edge-node-cec-ambient-voice-dashboard-soc-limits
created: '2026-08-28T02:57:25.162258Z'
source: https://www.webosose.org/docs/reference/ls2-api/com-webos-service-memorymanager/
source_domain: www.webosose.org
fetched_at: '2026-08-28T02:57:25.160765Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: docs
deprecated: false
---

com.webos.service.memorymanager | webOS Open Source Edition

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

com.webos.service.memorymanager

Note
This API has been supported since API level 11.
API Summary

Manages applications to ensure that the system does not run into kernel-Out-Of-Memory situation. This is achieved by killing applications that are in the background when we reach low memory conditions.
The goal of MemoryManager:
To maintain the state of memory usage across the app
To prevent running OOM (out of memory)
To correct the situation where memory runs out.
Overview of the API

N/A
Methods

getManagerEvent

ACG: memorymanager.query
Deprecated

Added: API level 11
Deprecated: API level 15
Description
Subscribe to be notified when a MemoryManager internal event occurs.
Parameters

Name
Required
Type
DescriptiontypeRequiredString
Indicates the memory manager event type.
Possible values are:
killing: application killing event when memory level is under 'low'subscribeRequiredBoolean
Indicates if subscribed for notifications.
Possible values are:
true: Subscribe for notifications
false: Notifications are not required
Call Returns

Name
Required
Type
DescriptionsubscribedRequiredBoolean
Indicates if subscribed to get notifications.
true: Subscribed for notifications
false: Not subscribedreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Method execution is successful
false: Method executed with errors. Check the errorCode and errorText for details.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "API Error Codes Reference" section for details.
Subscription Returns

Name
Required
Type
DescriptionidOptionalString
Indicates the app ID.
Note: The value exists only for 'killing' type event.typeRequiredString
Memory Manager Event Type.
'killing' : application killing event when memory level is under 'low'returnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Method execution is successful
false: Method executed with errors. Check the errorCode and errorText for details.subscribedRequiredBoolean
Indicates if subscribed to get notifications.
true: Subscribed for notifications
false: Not subscribedinstanceIdOptionalString
Indicates the instance ID.
Examples

Example code

# luna-send -f -i luna://com.webos.service.memorymanager/getManagerEvent '{
"type":"killing",
"subscribe":true
}'
Response:
{
"subscribed": true,
"returnValue": true
}
Subscription response:
{
"subscribed": true,
"returnValue": true,
"instanceId": "339164a1-2d8d-4d93-819b-427b5c12a75b1",
"id": "com.webos.app.test.enact",
"type": "killing"
}
getMemoryStatus

ACG: memorymanager.query

Added: API level 11
Description
Provides the current status of the memory.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Subscribe for notifications.
Possible values are:
true: Get notifications
false: Notifications are not required
Default: false
Call Returns

Name
Required
Type
DescriptionapplicationsRequiredObject array: application
Indicates the list of running applications.systemRequiredObject: system
Indicates the current system information.thresholdRequiredObject: threshold
Indicates the threshold values.subscribedRequiredBoolean
Subscribe for notifications.
Possible values are:
true: Get notifications
false: Notifications are not requiredreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Method execution is successful
false: Method executed with errors. Check the errorCode and errorText for details.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "API Error Codes Reference" section for details.
Examples

Example code

# luna-send -f -i luna://com.webos.service.memorymanager/getMemoryStatus '{
"subscribe":true
}'
Response:
{
"subscribed": true,
"returnValue": true,
"system": {
"level": "normal",
"available": 5995,
"total": 7538
},
"threshold": {
"low": {
"enter": 250,
"exit": 280
},
"critical": {
"enter": 100,
"exit": 130
}
},
"applications": [
{
"appId": "com.webos.app.test.enact",
"instanceId": "56a536ae-bf17-45f3-a255-4ba521b9081e1",
"pid": 2499,
"status": "foreground",
"type": "web",
"pss": "0"
}
]
}
requireMemory

ACG: memorymanager.management

Added: API level 11
Description
Requests for the memory that is required to launch an application.
Note: This method is called by the SAM module when it is about to launch an application.
Parameters

Name
Required
Type
DescriptionrequiredMemoryRequiredNumber
Indicates the amount of memory required to launch the application.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
This method always returns true.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "API Error Codes Reference" section for details.
Examples

Example code

# luna-send -f -n 1 luna://com.webos.service.memorymanager/requireMemory '{
"requiredMemory":120
}'
Response:
{
"returnValue":true
}
sysInfo

ACG: memorymanager.query
Retired

Added: API level 13
Deprecated: API level 15
Retired: API level 25
Description
Provides a way to account for memory usage.
Parameters
None
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Method execution is successful
false: Method executed with errors. Check the errorCode and errorText for details.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "API Error Codes Reference" section for details.System ViewRequiredObject array: system_view
Indicates the system level memory information.PSS ViewRequiredObject array: pss_view
Indicates the PSS information of services and applications per session.
Examples

Example code

# luna-send -f -n 1  luna://com.webos.service.memorymanager/sysInfo '{ }'
Response:
{
"returnValue":true,
"System View":[
{
"Essential":[
"BSP      : 669224 K",
"Custom Kernel : 513466 K",
"Kernel     : 508892 K",
"System PSS   : 750928 K"
]
},
{
"Foreground":[
"Foreground PSS : 90490 K"
]
},
{
"Performance":[
"Cached Kernel : 304672 K",
"Cached PSS   : 0 K"
]
},
{
"Free":[
"Free      : 5550936 K"
]
}
],
"PSS View":[
{
"driver0":[
{
"System":[
"55096 K: maliit-server.service (pid 2016)",
"39725 K: webapp-mgr.service (pid 1631)",
"...",
"297 K: maliit-server.service (pid 1995)"
]
},
{
"Foreground":[
"30414 K: com.webos.app.firstuse (pid 1835)"
]
}
]
},
{
"guest0":[
{
"System":[
"54682 K: maliit-server.service (pid 1987)",
"45024 K: webapp-mgr.service (pid 1514)",
"...",
"291 K: maliit-server.service (pid 1957)"
]
},
{
"Foreground":[
"30119 K: com.webos.app.firstuse (pid 1837)"
]
}
]
},
{
"guest1":[
{
"System":[
"54676 K: maliit-server.service (pid 2064)",
"42434 K: webapp-mgr.service (pid 1556)",
"...",
"285 K: maliit-server.service (pid 2030)"
]
},
{
"Foreground":[
"29957 K: com.webos.app.firstuse (pid 1834)"
]
}
]
},
{
"host":[
{
"System":[
"43910 K: surface-manager-daemon.service (pid 1010)",
"5957 K: pulseaudio.service (pid 1040)",
"...",
"163 K: qrtr-ns.service (pid 477)"
]
}
]
}
]
}
Objects

application

Added: API level 29
Description
Indicates the application memory description.
Properties

Name
Required
Type
DescriptionappIdRequiredString
Indicates the application ID.statusRequiredString
Indicates the status of the application.
Possible values are:
foreground
background
unknown
....pidRequiredNumber
Indicates the process ID.timeRequiredNumber
Indicates the timestamp about 'foreground' apps.typeRequiredString
Indicates the application type.
Possible values are:
web
native
qml
unknown
pss_view

Added: API level 29
Description
PSS information of services and applications per session
Properties

Name
Required
Type
DescriptionhostRequiredObject array
Indicates the PSS information on host session.driver0OptionalObject array
Indicates the PSS information on driver0 session.guest0OptionalObject array
Indicates the PSS information on guest0 session.guest1OptionalObject array
Indicates the PSS information on guest1 session.
system

Added: API level 29
Description
Indicates the current memory information.
Properties

Name
Required
Type
DescriptionavailableRequiredNumber
Indicates the available memory.totalRequiredNumber
Indicates the total memory.levelRequiredString
Indicates the current memory status.
Possible values are:
normal
low
critical
system_view

Added: API level 29
Description
Provides system-level memory information.
Properties

Name
Required
Type
DescriptionEssentialRequiredString array
Indicates the essential memory to run the system.
Values are:
BSP
Kernel
Custom Kernel
System PSSForegroundRequiredString array
Indicates the memory of processes that interacts with users.
Value is:
Foreground PSSFreeRequiredString array
Indicates the free memory.
Value is:
FreePerformanceRequiredString array
Indicates the memory that does not interact with users, but memory for performance improvement.
Values are:
Cached Kernel
Cached PSS
threshold

Added: API level 29
Description
Indicates the memory level threshold.
Properties

Name
Required
Type
DescriptionlowRequiredObject: threshold_item
Indicates the low threshold.criticalRequiredObject: threshold_item
Indicates the critical threshold.
threshold_item

Added: API level 29
Description
Indicates the threshold item.
Properties

Name
Required
Type
DescriptionenterRequiredNumber
Indicates the enter threshold.exitRequiredNumber
Indicates the exit threshold.
Signal/Events

levelChanged

Description
Indicates the LS signal for memory level change. The signal is always sent whenever memory level is changed.
Returns

Name
Required
Type
DescriptionpreviousRequiredString
Indicates the previous memory level.currentRequiredString
Indicates the current memory level.
API Error Codes Reference

Error Code
Error Text
Error Description1Unknown Error
Unknown Error2Wrong Json Format Error
Wrong Json Format Error3No Required Parameters Error
No Required Parameters Error4Invalid Parameters Error
Invalid Parameters Error5LS2 Internal Error
LS2 Internal Error6Unsupported API
Unsupported API

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 and sample code is licensed under the Apache License 2.0.

Contents