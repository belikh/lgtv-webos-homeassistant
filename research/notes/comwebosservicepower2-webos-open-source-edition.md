---
title: com.webos.service.power2 | webOS Open Source Edition
id: comwebosservicepower2-webos-open-source-edition
tags:
- lgtv-webos-ha-root-1a89ff
- locus-rooted-acl-boundary-stock-vs-root-luna-matrix
created: '2026-08-28T02:28:29.844069Z'
source: https://www.webosose.org/docs/reference/ls2-api/com-webos-service-power2/
source_domain: www.webosose.org
fetched_at: '2026-08-28T02:28:29.842061Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: docs
deprecated: false
---

com.webos.service.power2 | webOS Open Source Edition

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

com.webos.service.power2

Note
This API has been supported since API level 12.
API Summary

Allows client applications to power-on, power-off, and perform other power-related operations on the device.
Overview of the API

By using this service, a client application can control the power state of the device.
Note: Power states are device-specific, and these states will be added in further revisions to this document.
Using the APIs provided by this service, client application do the following:
Set the device in different power states:
setState(), getState()
reboot()
shutdown()
Register for state change transitions and confirm the transitions where applicable:
registerStateTransition()
respondStateTransitionAck()
Set a wake lock on the device
acquireWakeLock ()
releaseWakeLock()
Specify power-on reason
setPowerOnReason()
getPowerOnReason()
Check descriptions of specific methods to get relevant details.
Methods

acquireWakeLock

ACG: power.operation

Added: API level 12
Description
Allows the device to remain powered on for a specific time period, after which the lock is released.
Note: No other state change operation can be executed during this time period.
Parameters

Name
Required
Type
DescriptionclientIdRequiredString
Identity of the client.timeoutRequiredNumber
The duration (in seconds) to hold the lock.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true - Indicates that the operation was successful.
false - Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the API Error Codes Reference for more details.
Examples

Example: Acquire lock for 60 seconds

# luna-send -n 1 luna://com.webos.service.power2/acquireWakeLock '{
"clientId":"com.webos.lunasend-5726",
"timeout":60
}'
Response:
{
"returnValue": true
}
getPowerOnReason

ACG: power.operation

Added: API level 12
Description
Gets the last reason set for powering-on the device.
Parameters

Name
Required
Type
DescriptionsubscribeRequiredBoolean
Subscribe for notifications on any changes.
true - Subscribe to be notified on any changes to the power on reason.
false - Get the latest reason (one-time only).
Call Returns

Name
Required
Type
DescriptionsubscribedRequiredBoolean
Indicates whether subscribed to get notifications.reasonRequiredString
Indicates the power on reason.returnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true - Indicates that the operation was successful.
false - Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the API Error Codes Reference for more details.
Subscription Returns

Name
Required
Type
DescriptionreasonRequiredString
Power-on reason.
Examples

Example: Subscribe for new device power-on reasons

# luna-send -n 1 luna://com.webos.service.power2/getPowerOnReason '{
"subscribe":true
}'
Response:
{
"reason": "remoteKey",
"subscribed": true,
"returnValue": true
}
getState

ACG: power.operation

Added: API level 12
Description
Obtains the currently set state.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Subscribe for notifications on state changes.
true - Subscribe to be notified on state changes.
false - Get the latest state (one-time only).
Call Returns

Name
Required
Type
DescriptionstateRequiredString
Current state.subscribedRequiredBoolean
Indicates whether subscribed.returnValueRequiredBoolean
Indicates the status of operation. Possible values are:
true - Indicates that the operation was successful.
false - Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the API Error Codes Reference for more details.
Subscription Returns

Name
Required
Type
DescriptionstateRequiredString
Current state.
Examples

Example: Subscribe for state change

# luna-send -n i luna://com.webos.service.power2/getState '{
"subscribe":true
}'
Response:
{
"state": "ActiveState",
"subscribed": true,
"returnValue": true
}
notifyAlarmExpiry

ACG: None

Added: API level 29
Description
Notifies about the alarm expiry.
Parameters

Name
Required
Type
DescriptionclientIdRequiredString
ID of the client which called the acquirewakelock method.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Operation is successful.
false: Operation has failed. Check the 'errorCode' and 'errorText' fields.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
The reason for the failure of the operation. See the 'Error Codes' section of this method for details.clientIdOptionalString
ID of the client.
Error Codes Reference

Error Code
Error Text
Error Description2Invalid JSON format
Invalid Json Format error
Examples

Example scenario

# luna-send -n 1 -f luna://com.webos.service.power2/notifyAlarmExpiry '{"clientId" : "/var/run/ls2/yUGYsP.4"}'
Response:
{
"clientId": "/var/run/ls2/yUGYsP.4",
"returnValue": true
}
reboot

ACG: power.management

Added: API level 12
Description
Reboots the device with in timeout after acknowledged from registered client. LunaInterfacePMSRoot:TimeOut is configured in /var/PMS/pms.conf file as 15mins by default. Timeout is in HH:MM:SS format
Note: Client will be prompted for acknowledgement if registered for state change notifications.
Parameters

Name
Required
Type
DescriptionreasonRequiredString
The event that caused the device to be reboot.
Possible values are:
reset - Reboot after device was reset
ota - Reboot after OTA update completion
SwDownload - Reboot after software download
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true - Indicates that the operation was successful.
false - Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the API Error Codes Reference for more details.
Examples

Example: Reboot the device after OTA update

# luna-send -n 1 luna://com.webos.service.power2/reboot '{
"reason" : "ota"
}'
Response:
{
"returnValue": true
}
registerStateTransition

ACG: power.operation

Added: API level 12
Description
Clients can register to get notified when the state changes from a specified state. For example, if registered to get notifications on state “ACTIVE”, you will get notified when state changes from “ACTIVE” to any other state.
Some transitions require acceptance (acknowledgement) from all clients who register to this state. For this check the respondStateTransitionAck() method.
Note: It is a subscription method. Subscription is notified when specified state change happens. setState method can be used for state change forcefully.
Parameters

Name
Required
Type
DescriptionstateRequiredString
State for which to register.
Call Returns

Name
Required
Type
DescriptionclientIdRequiredString
Identity of the client.subscribedOptionalBoolean
Always returns true.stateRequiredString
Current state of the device.returnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true - Indicates that the operation was successful.
false - Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the API Error Codes Reference for more details.
Subscription Returns

Name
Required
Type
DescriptionstateRequiredString
Registered state.nextStateRequiredString
Processing possible next state.tokenRequiredString
Session token.
Examples

Example: Register for transitions of the ACTIVE state

# luna-send -n i luna://com.webos.service.power2/registerStateTransition '{
"state":"ActiveState"
}'
Response:
{
"clientId":"com.webos.lunasend-954",
"subscribed":true,
"state":"ActiveState",
"returnValue":true
}
Subscription:
{
"state":"ActiveState",
"nextState":"PowerOffState",
"token":"6UixZdy.4"
}
releaseWakeLock

ACG: power.operation

Added: API level 12
Description
Instantly releases the wake lock for the client.
Parameters

Name
Required
Type
DescriptionclientIdRequiredString
Identity of the client who has acquired the lock.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true - Indicates that the operation was successful.
false - Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the API Error Codes Reference for more details.
Examples

Example: Release the wake lock

# luna-send -n 1 luna://com.webos.service.power2/releaseWakeLock '{
"clientId" : "com.webos.lunasend-1110"
}'
Response:
{
"returnValue": true
}
respondStateTransitionAck

ACG: power.operation

Added: API level 12
Description
For clients that have registered for state change notifications, some state transitions require acceptance (acknowledgement) of all clients who register for this state :
If all subscribers approve (ACK), the state change occurs.
If even one subscriber rejects (NACK), the state does not change.
Clients who have not subscribed to that state are not required to vote.
No user input is considered as acceptance of the state change.
Parameters

Name
Required
Type
DescriptionstateRequiredString
Registered state.ackRequiredBoolean
Client vote.
Possible values are:
true - positive acknowledgement (ACK) confirming the state transition.
false - negative acknowledgement (NACK) to reject the state transition.tokenRequiredString
Session token generated in response to the registerStateTransition() method.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true - Indicates that the operation was successful.
false - Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the API Error Codes Reference for more details.
Examples

Example: Accept the state transition

# luna-send -n 1 luna://com.webos.service.power2/respondStateTransitionAck '{
"ack":true,
"state":"ActiveState",
"token":"6UixZdy.4"
}'
Response:
{
"returnValue": true
}
setPowerOnReason

ACG: power.management

Added: API level 12
Description
Specify the reason that caused the device to be powered on.
Parameters

Name
Required
Type
DescriptionreasonRequiredString
The event that caused the device to be powered.
Possible values are:
remoteKey - Powered on using the remote control
onTimer - Powered on using ON timer
SwDownload - Powered on after software download
ota - Powered on after OTA update completion
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true - Indicates that the operation was successful.
false - Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the API Error Codes Reference for more details.
Examples

Example: Set the reason to power-on the device

# luna-send -n 1 luna://com.webos.service.power2/setPowerOnReason '{
"reason":"remoteKey"
}'
Response:
{
"returnValue": true
}
setState

ACG: power.management

Added: API level 12
Description
Sets the state of the device.
This method forcefully sets the state and ignores the sequential flow of power states. This means that the client is not prompted for acknowledgement, even if you have registered for state change notifications (using registerStateTransition() method).
Note: This method can also reboot or shutdown the device. However, it is advisable to use the specific methods provided for these purposes.
Parameters

Name
Required
Type
DescriptionstateRequiredString
State to be set.reasonRequiredNumber
The event that caused the state change.
Possible values are:
0 - wake on LAN via external device network
1 - wake on WiFi via external device network
2 - power on/off by remote
3 - power on by on timer
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation. Possible values are:
true - Indicates that the operation was successful.
false - Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the API Error Codes Reference for more details.
Examples

Example: Set the state to ACTIVE due to wake on LAN via external device network

# luna-send -n 1 luna://com.webos.service.power2/setState '{
"state":"ActiveState",
"reason":1
}'
Response:
{
"returnValue": true
}
shutdown

ACG: power.management

Added: API level 12
Description
Shuts down the device.
Note: Client will be prompted for acknowledgement if registered for state change notifications.
This shutdown API will work differently for ose. If it is in ActiveState, it may go garage state base if it met preconditions i.e wifi on and SSID. (garageSSID can be configured in /var/PMS/pms.conf). Shuts down the device with in timeout after acknowledged from connection manager service(Precondition not met). LunaInterfacePMSRoot:TimeOut is configured in /var/PMS/pms.conf file as 15mins by default. Timeout is in HH:MM:SS format
Parameters

Name
Required
Type
DescriptionreasonRequiredString
The event that causes the device to be shutdown.
Possible values are:
remoteKey - Power off using remote control
offTimer - Power off using OFF timer
localKey - Power off using using the devices hardware power on/off key
diagnosticsDone - Power off device when diagnostics operation done
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true - Indicates that the operation was successful.
false - Indicates that the operation failed. Check the "errorCode" and "errorText" fields for details.errorCodeOptionalNumber
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the API Error Codes Reference for more details.
Examples

Example: Shutdown the device using the remote control

# luna-send -n 1 luna://com.webos.service.power2/shutdown '{
"reason" : "remoteKey"
}'
Response:
{
"returnValue": true
}
API Error Codes Reference

Error Code
Error Text
Error Description1errorPower2Busy
com.webos.service.power2 is busy2Invalid JSON format
Invalid Json Format error 3errorClientNotRegistered
The client is not registered4errorCleintAlreadyRegistered
The client is already registered5errorResponseTooLate
The response is too late6errorTimerNotRunning
The timer is not running7errorUnknown
Unknown error

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 and sample code is licensed under the Apache License 2.0.

Contents