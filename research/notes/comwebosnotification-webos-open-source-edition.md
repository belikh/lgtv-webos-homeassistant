---
title: com.webos.notification | webOS Open Source Edition
id: comwebosnotification-webos-open-source-edition
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:16:49.994218Z'
source: https://www.webosose.org/docs/reference/ls2-api/com-webos-notification/
source_domain: www.webosose.org
fetched_at: '2026-08-28T02:16:49.983219Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: docs
deprecated: false
---

com.webos.notification | webOS Open Source Edition

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

com.webos.notification

Note
This API has been supported since API level 11.
API Summary

Manages the system notifications.
Overview of the API

Enables apps or services to manage system notifications. The main types of notifications supported are:
Toast: This is an info alert that displays the message and title. It gets dismissed automatically after a few seconds. When creating the toast, it can be decided if it must be persisted in the Notification Center App.
Alert: This is a dialog message with at least one action button. It can be a modal or non-modal alert. For a modal alert, all interaction with the UI will be blocked until the alert is dismissed.
Methods

closeAlert

ACG: notification.management

Added: API level 11
Description
Closes the currently displayed alert notification.
Parameters

Name
Required
Type
DescriptionalertIdRequiredString
The ID of the alert notification to close.
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
Error DescriptionNoneMessage is not parsed
This message implies that a JSON message parsing error occured. One of the following situations can cause the parsing error:
The Request object was not formatted correctly.
One or more of the required fields are missing.
One or more of the values provided were not the expected data type, for example a string was expected, however the app passed a number instead.NoneAlert ID can't be empty
This message implies that the alertId field in the message is empty or missing.NoneAlert ID parse error
This message implies that the alertId is not formatted properly.
Examples

Example

# luna-send -n 1 -f -a com.webos.surfacemanager luna://com.webos.notification/closeAlert '{"alertId":"com.webos.surfacemanager-1582876366095"}'
Response:
{
"returnValue": true
}
closeAllAlerts

ACG: notification.management

Added: API level 12
Description
Closes all the open alerts.
Note: This method is for internal use. It must only be used by com.webos.service.battest during BAT test. If the caller is not com.webos.service.battest, the method will fail.
Parameters
None
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
Error DescriptionNoneUnknown Source
This message implies that the system was unable to retrieve the app source ID from the system bus message.NoneMessage is not parsed
This message implies that a JSON message parsing error occured. One of the following situations can cause the parsing error:
The Request object was not formatted correctly.
One ore more of the required fields are missing.
One or more of the values provided were not the expected data type, for example a string was expected, however the app passed a number instead.NoneInvalid source ID specified
If call is not from com.webos.service.battest, notification refuses API request with this error.
Examples

Example

# luna-send -n 1 -f -a com.webos.service.battest luna://com.webos.notification/closeAllAlerts '{}'
Response:
{
"returnValue":true
}

Example

# luna-send -n 1 -f luna://com.webos.notification/closeAllAlerts '{}'
Response:
{
"returnValue":false,
"errorText":"Unknown Source"
}
closeToast

ACG: notification.management

Added: API level 11
Description
Removes a toast notification from the database.
Parameters

Name
Required
Type
DescriptiontoastIdOptionalString
ID of the toast notification to remove from the database.
Note: Either toastId or sourceId is required.sourceIdOptionalString
ID of the app/service to remove from the database.
Note: Either toastId or sourceId is required.
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
Error DescriptionNoneToast ID parse error
Indicates that the toastId is not formatted properly. NoneBoth Toast ID and Source ID can't be empty
Indicates that neither toastId or sourceId field in the message is empty or missing.NoneMessage is not parsed
Indicates that a JSON message parsing error occured.
Possible situations that can cause the parsing error:
The Request object was not formatted correctly.
One or more of the required fields are missing.
One or more of the values provided were not the expected data type, for example a string was expected, however the app passed a number instead.
Examples

Example : With toast ID

# luna-send -n 1 -f -a com.webos.app.test luna://com.webos.notification/closeToast '{"toastId":"com.webos.app.test-1433221930402"}'
Response:
{
"returnValue":true
}

Example : With source ID

# luna-send -n 1 -f -a com.webos.app.test luna://com.webos.notification/closeToast '{"sourceId":"com.webos.app.test"}'
Response:
{
"returnValue":true
}
createAlert

ACG: notification.operation

Added: API level 11
Description
Creates a system alert notification.
Parameters

Name
Required
Type
DescriptioniconUrlOptionalString
The file path of the alert icon. The file path must be local to the device.
titleOptionalString
A brief title for the alert notification. messageRequiredString
A detailed message for the alert notification.modalOptionalBoolean
Indicates whether to display a modal or non-modal alert notification.
Possible values are:
true: Display a modal alert notification.
false (Default): Display a non-modal alert notification.buttonsRequiredObject array: button
Defines the button label, and onclick action. Button specification is given in an array. An example is:
"buttons":[
{"label":"button1", "onclick":"luna://com.webos.service.applicationmanager/launch", "params":{"id":"com.webos.app.settings"}},
{"label":"button2", "focus":true},
{"label":"button3"}
]oncloseOptionalObject: onclose
Defines the close action to be performed when an alert is closed.typeOptionalString
Defines the button type in the alert.
Possible values are:
confirm (Default)
warningisSysReqOptionalBoolean
Indicates whether the notification has come from an app or system​.
Possible values are:
true: Notification comes from system.
false: Notification comes from an app.onfailOptionalObject: onfail
Action to be performed on failure to create an alert.
Call Returns

Name
Required
Type
DescriptionalertIdRequiredString
The ID of the created alert notification. This would be sourceId + "-" + Timestamp.returnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Successful.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).
Error Codes Reference

Error Code
Error Text
Error Description100, 110-
See the 'API Error Codes Reference' table for detailed information on relevant error code.
Examples

Example

# luna-send -n 1 -f -a com.webos.surfacemanager luna://com.webos.notification/createAlert '{
"message":"hello world",
"buttons":[
{
"label":"launch",
"params":{
"id":"youtube.leanback.v4"
}
}
]
}'
Response:
{
"alertId":"com.webos.surfacemanager-1582247038454",
"returnValue":true
}
createToast

ACG: notification.operation

Added: API level 11
Description
Creates a toast notification.
Parameters

Name
Required
Type
DescriptionsourceIdOptionalString
The ID of the application or service that creates the toast notification.iconUrlOptionalString
The file path of the alert icon. The file path must be local to the device.
NOTE: The icon must be 80 x 80 and in PNG format.messageRequiredString
The detailed message to be displayed as part of the toast notification.
The maximum length is 60.onclickOptionalObject: onclick
Defines the toast action. An example is:
{"appId":"com.webos.app.test"}noactionOptionalBoolean
Indicates no action is required.
Possible values are:
true: If no action is required.
false (Default): If action is defined.staleOptionalBoolean
Indicates whether the notification is old or current.
Possible values are:
true: Toast notification is old and does not need to be displayed.
false (Default): Toast notification is current and should be displayed.persistentOptionalBoolean
Indicates whether the toast message should be saved in the database.
Possible values are:
true: Toast message will be saved in the database.
false: Not saved in database.isSysReqOptionalBoolean
Defines notification comes from app or system.
Possible values are:
true: Notification comes from system.
false: Notification comes from app.scheduleOptionalObject: schedule
Creates a toast notification as a persistent message and defines its schedule.typeOptionalString
Defines the toast type.
Possible values are:
standard (Default)
lightextraOptionalObject array: image
Defines extra toast resource.onlyToastOptionalBoolean
Indicates if notification to be created is just a simple toast.
Possible values are:
true (Default): Shows simple information.
false: Calls createNotification API and notiInfo is added in notification list.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Successful.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).toastIdRequiredString
The id of the created toast notification. This would be sourceId + "-" + Timestamp.
Error Codes Reference

Error Code
Error Text
Error Description100Message is not parsed
Indicates that the JSON message parsing error occured.
Possible situations that can cause the parsing error:
Request object was not formatted correctly.
One ore more of the required fields are missing.
One or more of the values provided were not the expected data type, for example a string was expected, however the app passed a number instead.103Unknown Source
Indicates that the system was unable to retrieve the app source id from the System Bus message.105Message can't be empty
Indicates that the message field in the requested message is empty.111Invalid source id specified
Indicates that the app Id given in the requested message does not match with the system bus caller Id.
Examples

Example

# luna-send -n 1 -f -a com.webos.app.test luna://com.webos.notification/createToast '{
"sourceId":"com.webos.app.test",
"onclick": {"appId":"com.webos.app.test"},
"message":"hello world",
"noaction": false,
"persistent":true
}'
Response:
{
"toastId": "com.webos.app.test-1435192659892",
"returnValue": true
}
disable

ACG: notification.management

Added: API level 21
Description
Disables all notification features (Toast, Alert, Input Alert, Pin Prompt).
Note: Only a privileged application or service can call this method.
Parameters
None
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).
Error Codes Reference

Error Code
Error Text
Error Description100, 124-
See the 'API Error Codes Reference' table for detailed information on relevant error code.
Examples

Example

# luna-send -n 1 -f -a com.webos.app.test luna://com.webos.notification/disable '{}'
Response:
{
"returnValue": true
}
enable

ACG: notification.management

Added: API level 21
Description
Enables all notification features (Toast, Alert, Input Alert, Pin Prompt).
Note: Only a privileged app/service can call this method.
Parameters
None
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
Error DescriptionNoneUnknown Source
Indicates that the system was unable to retrieve the app/service's source id from the system bus message.NonePermission Denied
Indicates that the app/service does not have permission to enable notifications.
Examples

Example

# luna-send -n 1 -f -a com.webos.app.test luna://com.webos.notification/enable '{}'
Response:
{
"returnValue": true
}
getAlertNotification

ACG: notification.management

Added: API level 12
Description
Subscribe to create alert notifications.
Note: This method should only be used by the Surface Manager.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribed.
false (Default): Not subscribed.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Successful. This method always returns returnValue as true.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).subscribedOptionalBoolean
Indicates if subscribed to get notifications.
Note: No explicit error message will be sent out when the subscription fails because this method is intended for one specific client that is the Surface Manager.
Possible values are:
true: Subscribed.
false: Not subscribed.
Subscription Returns

Name
Required
Type
DescriptionalertInfoRequiredObject: alertInfo
Contains alert info.timestampOptionalString
Indicates epoch time as milliseconds.returnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Successful. This method always returns returnValue as true.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).alertActionRequiredString
Indicates the action that the subscriber should take.
Possible values are:
open: Indicates that the SystemUI should show the alert.
close: Indicates that the SystemUI should close the currently open alert.
Examples

Example : Subscription shows when youtube is launched

# luna-send -i -f -a com.webos.surfacemanager luna://com.webos.notification/getAlertNotification '{"subscribe":true}'
Response:
{
"subscribed": true,
"returnValue": true
}
Subscription Response:
{
"returnValue":true,
"alertAction":"open",
"alertInfo":{
"iconPath":"/usr/share/asm/130x130 usb-port2.png",
"sourceId":"com.webos.surfacemanager",
"displayId":0,
"buttons":[
{
"action":{
"launchParams":{
"id":"youtube.leanback.v4"
},
"serviceURI":"luna://com.webos.service.applicationmanager/",
"serviceMethod":"launch"
},
"focus":false,
"label":"launch"
}
],
"message":"hello world",
"isNotiSave":false,
"iconUrl":" [file:///usr/share/asm/130x130]  usb-port2.png",
"modal":false,
"onCloseAction":{

},
"progress":0,
"alertId":"com.webos.surfacemanager-1690213268617",
"type":"progress",
"title":"this is to get alertInfo",
"isSysReq":false,
"onFailAction":{

}
},
"timestamp":"1690213268617"
}
getToastCount

ACG: notification.management

Added: API level 12
Description
Queries the toast notification details of the stored messages and provides the read/unread count of the toast notifications.
Note: Only "com.webos.surfacemanager" and "com.webos.app.notification" have permission to monitor the notification status change.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribed.
false: Not subscribed.displayIdOptionalNumber
Identifier of the display where the notification is to be displayed.
Possible values are:
0
1
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.subscribedRequiredBoolean
Indicates if subscribed to get notifications (check 'subscribe' parameter).
Subscription Returns

Name
Required
Type
DescriptionreadCountRequiredNumber
Indicates the count of toast notifications read by a specific user.unreadCountRequiredNumber
Indicates the count of toast notifications unread by the user.totalCountRequiredNumber
Indicates the total count of toast notifications respective to a user.returnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.
Examples

Example: Get toast count form a specific displayId

# luna-send -i -f -a com.webos.app.notification luna://com.webos.notification/getToastCount '{"subscribe":true, "displayId": 0}'
Response:
{
"returnValue" : true,
"subscribed" : true
}
Subscription Response:
{
"unreadCount": 2,
"totalCount": 3,
"readCount": 1,
"returnValue": true
}
getToastList

ACG: notification.management

Added: API level 12
Description
Lists the toasts created for the app/client based on the user logged into the particular session.
Parameters

Name
Required
Type
DescriptiondisplayIdOptionalNumber
Identifier of the display where the notification is to be displayed.
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
false: Not successful. For details, see the 'Error Codes' table.toastInfoRequiredObject array: toastInfo
Contains information of the stored toasts.
Error Codes Reference

Error Code
Error Text
Error DescriptionNoneUnknown Source
Indicates that the system was unable to retrieve the app/service's source id from the system bus message.NonePermission Denied
Indicates that the app/service does not have permission to query toast list.NoneMessage is not parsed
Indicates that the required parameters were not passed to API.NoneCan't get the notification info from db
Failed to fetch the toast list from the database.
Examples

Example

# luna-send -n 1 -f -a com.webos.app.notification luna://com.webos.notification/getToastList '{"displayId": 0}'
Response:
{
"returnValue": true
"toastInfo" : [
{
"sourceId" : "com.webos.app.notification",
"toastId" : "com.webos.app.notification-1584349101435",
"timestamp" : "1584349101435",
"iconUrl" : "file:///usr/palm/notificationmgr/images/toast-notification-icon.png",
"iconPath" : "/usr/palm/notificationmgr/images/toast-notification-icon.png",
"title" : "",
"message" : "hello world",
"isSysReq" : false,
"user" : "guest",
"schedule" : {
"expire": 1590207128
},
"type" : "standard",
"action" : {
"launchParams": {
"id": "com.webos.app.notification"
},
"serviceMethod": "launch",
"serviceURI": "luna://com.webos.service.applicationmanager/"
}
"readStatus" : false
},
],
"displayId": 0
}
getToastNotification

ACG: notification.management

Added: API level 12
Description
Subscribe to created toast notification.
Note: This method should only be used by Surface Manager only.
Parameters

Name
Required
Type
DescriptionsubscribeOptionalBoolean
Indicates if subscribed to get notifications.
Possible values are:
true: Subscribed.
false (Default): Not subscribed.
Call Returns

Name
Required
Type
DescriptionsubscribedOptionalBoolean
Indicates if subscribed to get notifications (check 'subscribe' parameter).
Note: No explicit error message will be sent out when subscription fails because this method is intended for one speicific client that is the Surface Manager.returnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful. Always returns true.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).
Subscription Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Indicates that the operation was successful.
false: Indicates that the operation failed.
Note: This method always returns returnValue as true.messageRequiredString
Contains the message to be displayed.typeOptionalString
Indicates the type of the toast message.
Note: This is optional parameter and currently not used. This is reserved for future purpose.titleOptionalString
Contains the title information to be displayed for the toast.isCradleReqOptionalBoolean
Indicates if this is a Cradle Request or not. Cradle Request is used for Battery Notifications only. So, it will be set to false for all other cases.
Note:
A Cradle is used for charging the watch wirelessly. When a watch is put on an inductive charger, it sends a notification indicating the current battery level.
A Cradle Request is used for showing that notification.sourceIdRequiredString
Contains the source Id of the requester. timestampRequiredString
Indicates the time stamp string. It indicates epoch time as milliseconds.isSysReqRequiredBoolean
Indicates if the notification comes from an app or system.
Possible values are:
true: Notification comes from system.
false: Notification comes from app.iconUrlRequiredString
Contains the file path to icon to be displayed.actionOptionalObject: action
Contains the action parameter.scheduleOptionalObject: schedule
Describes the toast schedule.iconPathRequiredString
Specifies the path of the icon. It should be absolute local file system path.userOptionalString
Indicates the names of the user logged in to the corresponding session. If the user is logged in as guest user, the value will be "guest"._kindOptionalString
Displays the db kind in which the toast is stored.
Note: It is an internal parameter.onlyToastRequiredBoolean
Indicates if notification is created as a simple toast.
Note: It is set when creating the toast.readStatusRequiredBoolean
Indicates the status of a toast to be set by the user.
Possible values are:
true: toast is read.
false: toast is unread.timesourceOptionalString
Denotes the time source.
Example: system, manual, ntp, sdp.displayIdOptionalNumber
ID of the display where the notification is displayed.
Possible values are 0 and 1.
Examples

Example scenario

# luna-send -i -f -a com.webos.surfacemanager luna://com.webos.notification/getToastNotification '{"subscribe":true}
Response:
{
"subscribed": true,
"returnValue": true
}
Subscription response:
{
"iconUrl":" [file:///usr/palm/notificationmgr/images/toast-notification-icon.png] ",
"onlyToast":true,
"iconPath":"/usr/palm/notificationmgr/images/toast-notification-icon.png",
"readStatus":false,
"isSysReq":false,
"message":"hello world",
"sourceId":"com.webos.app.test",
"isCradleReq":false,
"_kind":"com.webos.notificationhistory:1",
"schedule":{
"expire":1692788497
},
"type":"standard",
"title":"",
"user":"guest",
"timesource":"ntp",
"displayId":0,
"timestamp":"1690196497182",
"returnValue":true,
"action":{
"launchParams":{
"id":"com.webos.app.test"
},
"serviceURI":"palm://com.webos.applicationManager/",
"serviceMethod":"launch"
}
}
removeAllNotification

ACG: notification.management

Added: API level 12
Description
Removes all notifications that are currently being displayed.
Parameters

Name
Required
Type
DescriptiondisplayIdOptionalNumber
Identifier of the display where the notification is to be displayed.
Possible values are:
0
1
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Successful.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).removeAllNotiIdOptionalBoolean
Indicates whether all notifications were removed successfully.
Possible values are:
true: Notifications were removed successfully.
false: Notification removal failed.displayIdOptionalNumber
Identifier of the display where the notification is to be displayed.
Possible values are:
0
1
Error Codes Reference

Error Code
Error Text
Error DescriptionNonePermission Denied
This error message implies that calling App or source is not previleged source for this method. Only SystemUI component is allowed to call this method.
Examples

Example scenario

# luna-send -a com.webos.surfacemanager -n 1 luna://com.webos.notification/removeAllNotification '{"displayId": 0}'
Response:
{
"removeAllNotiId":true,
"returnValue":true
}
removeNotification

ACG: notification.management

Added: API level 21
Description
Deletes the given notification(s) from DB. We can remove given set of notifications or remove all notifications from a given sourceId.
Parameters

Name
Required
Type
DescriptionremoveNotiIdOptionalString array
A list of IDs of the notifications to be deleted. Notification ID is composed of the URI of the notification source, a dash, and the timestamp of the time when the notification was issued.
Format: "Source URI-Timestamp"
Example "com.webos.surfacemanager-1393548223764"
Note: Either one of "removeNotiId" or "sourceId" is mandatory to be provided.sourceIdOptionalString
Identifies the app or service that created the notification to be deleted.
Format: URI
Note: Either one of "removeNotiId" or "sourceId" is mandatory to be provided.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of operation.
Possible values are:
true: Successful.
false: Not successful. Check the method's 'Error Codes' section for failure details (errorCode and/or errorText).removeNotiIdOptionalString array
A list of IDs of the notification that has been deleted.
Format: "Source URI-Timestamp"
Example: "com.webos.surfacemanager-1393548223764"
Note: Returned when "removeNotiId" is passed as input parametersourceIdOptionalString
The app or service that created the notification that are deleted.
Format: URI
Example: "com.webos.surfacemanager"
Note: Returned when "sourceId" is passed as input parameter
Error Codes Reference

Error Code
Error Text
Error DescriptionNoneMessage is not parsed
This message implies that a JSON message parsing error occured. One of the following situations can cause the parsing error:
The Request object was not formatted correctly.
One ore more of the required fields are missing.
One or more of the values provided were not the expected data type, for example a string was expected, however the app passed a number instead.Noneinput sourceId or removeNotiId parameter
This message implies that both sourceId and removeNotiId parameters are missing. At least one should be present.NonesourceId can't be empty
This message implies that given sourceId parameter does not have any value. It cannot be empty. NoneNoti Id can't be Empty
This message implies that given NotiId is empty.
Examples

Example : WIth removeNotiId provided

# luna-send -a com.webos.surfacemanager -n 1 -f luna://com.webos.notification/removeNotification '{"removeNotiId": ["com.sloy.jbnotif-1393548393417"]}'
Response:
{
"removeNotiId": [
"com.sloy.jbnotif-1393548393417"
],
"returnValue": true
}

Example : With sourceId provided

# luna-send -n 1 -f -a com.webos.surfacemanager luna://com.webos.notification/removeNotification '{"sourceId": "com.sloy.jbnotif"}'
Response:
{
"sourceId": "com.sloy.jbnotif",
"returnValue": true
}
setToastStatus

ACG: notification.management

Added: API level 12
Description
Specifies whether the toast is to be marked as read or unread.
Parameters

Name
Required
Type
DescriptiontoastIdRequiredString
Indicates the unique ID of the toast created.readStatusRequiredBoolean
Indicates the status of a toast to be set by the user.
Possible values are:
true: toast is read.
false: toast is unread.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates the status of the operation.
Possible values are:
true: Successful.
false: Not successful. For details, see the 'Error Codes' table.toastIdOptionalString
Contains the unique ID of the toast created.readStatusOptionalBoolean
Indicates the status of a toast set by the user.
Error Codes Reference

Error Code
Error Text
Error DescriptionNoneFailed to set status
Failed to set the read / unread status of the toast.
Examples

Example

# luna-send -i -f -a com.webos.app.notification luna://com.webos.notification/setToastStatus '{
"toastId" : "com.webos.app.notification-1584349101435",
"readStatus" : true
}'
Response:
{
"returnValue" : true,
"toastId" : "com.webos.app.notification-1584349101435",
"readStatus" : true
}
Objects

$activity

Added: API level 29
Description
Contains detailed information of an activity which is fired by the Actvity Manager. This object is returned from the Activity Manager. For more details, see com.webos.service.activitymanager.
Properties

Name
Required
Type
DescriptionactivityIdRequiredNumber (uint64_t)
Activity Id that is fired.
action

Added: API level 29
Description
Describes the action parameter for the toast.
Properties

Name
Required
Type
DescriptionlaunchParamsRequiredObject
launchParams must be passed in the format below where "appid" is a string that contains the id of the app to be launched.
{
"id": "appid"
}serviceMethodRequiredString
Contains the LS2 service method name.serviceURIRequiredString
Contains LS2 Service URI.
alertInfo

Added: API level 29
Description
Contains the alert information.
Properties

Name
Required
Type
DescriptionappIdOptionalString
App ID related to this alert.timeoutOptionalNumber
Indicates milliseconds in time that the caller waits to dismiss an alert when the user does nothing.portTypeOptionalString
Indicates port type.portNameOptionalString
Indicates port name.portIconOptionalString
Indicates port icon path.deviceNameOptionalString
Indicates device name.paramsOptionalObject
Contains parameters when appId is launched.inputsOptionalObject: input
Contains information about an input alert.onFailActionOptionalObject
"onFailAction": { "launchParams": { "id": "com.webos.app.browser" }, "serviceMethod": "launch", "serviceURI": "com.webos.service.applicationmanager/" }sourceIdOptionalString
ID the application or service that created the alert notification.
Format: URI
Example: "com.webos.surfacemanager"displayIdOptionalNumber
ID of the display where the notification is to be displayed.
Possible values are:
0
1titleOptionalString
Title information to be displayed for the alert.messageOptionalString
Message to be displayed.iconUrlOptionalString
File path to icon to be displayed.modalOptionalBoolean
Indicates whether the alert is a modal or non-modal notification.
Possible values are:
true: modal alert notification
false: non-modal alert notificationtypeOptionalString
Defines the button type in the alert.
Possible values are:
confirm
warning
progressisSysReqOptionalBoolean
Indicates whether the notification comes from an app or a system.​
Possible values are:
true: Notification comes from a system
false: Notification comes from an appisNotiSaveOptionalBoolean
Indicate whether the notification saved or not.
Possible values are:
true: Notification saved.
false: Notification not savedonCloseActionOptionalObject: onclose
Indicates the action to be performed when close an alert. buttonsOptionalObject array: button
Defines the button label, and onclick action. Button specification is given in an array.
An example is:
"buttons":[
{"label":"button1", "onclick":"luna://com.webos.service.applicationmanager/launch", "params":{"id":"com.webos.app.settings"}},
{"label":"button2", "focus":true},
{"label":"button3"}
]alertIdOptionalString
The ID of the created alert notification. The ID is composed of the URI of the notification source, a dash, and the timestamp of the time when the notification was issued.
Format: "Source URI-Timestamp"
Example: "com.webos.surfacemanager-1393548223764"timestampOptionalString
Timestamp of the time when the notification was issued.
It indicates epoch time as milliseconds. deviceIconOptionalString
Connected device icon file name.
button

Added: API level 29
Description
Contains alert button information
Properties

Name
Required
Type
DescriptionlabelRequiredString
The text on the button.onclickOptionalString
Luna API to be called when a button is clicked.onClickOptionalString
Same as onclick. paramsOptionalObject
Parameters for a service call.buttonTypeOptionalString
The type of the button. It can be either ok or cancel.focusOptionalBoolean
Set to true if button has default focus.
image

Added: API level 29
Description
Defines extra toast image.
Properties

Name
Required
Type
DescriptionuriOptionalString
Image resource URI.
input

Added: API level 32
Description
Contain information about an input alert.
Properties

Name
Required
Type
DescriptionappIdRequiredString
The id of the input applicationportTypeRequiredString
Input port typeportNameRequiredString
Input port nameportIconRequiredString
Input port icon file namedeviceNameOptionalString
Connected device namedeviceIconOptionalString
Connected device icon file nameparamsOptionalObject
Parameters to be passed to the application
onFailAction

Added: API level 29
Description
Action to be performed on failure to create alert.
Properties

Name
Required
Type
DescriptionserviceURIRequiredString
URI to be called on failure to create alert.serviceMethodRequiredString
Method to be called on failure to create alert.launchParamsRequiredObject
Parameters to be passed when URI (specified above) is called.
onclick

Added: API level 29
Description
Contains action information when a user clicks the toast
Properties

Name
Required
Type
DescriptionappIdOptionalString
Application Id to be launchedparamsOptionalObject
Contains parameters when appId is launched.
onclose

Added: API level 29
Description
Contains close action when alert is closed with close button or automatically
Properties

Name
Required
Type
DescriptionuriOptionalString
Luna API to be called when an alert window is closed.paramsOptionalObject
Contains parameters to be passed when uri is called.
onfail

Added: API level 29
Description
Action to be performed on failure to create alert from view side (LSM).
Properties

Name
Required
Type
DescriptionuriRequiredString
Luna API to be called when an alert window is closed.paramsRequiredObject
Parameters for the above URI.
schedule

Added: API level 29
Description
Creates a toast notification as a persistent message and define its schedule.
Properties

Name
Required
Type
DescriptionexpireOptionalNumber (int64_t)
If this field is set, the created persistent message will be automatically removed after the specified amount of time has passed.
The value should be the number of seconds that have elapsed since 00:00:00 UTC, 1 Jan 1970.
toastInfo

Added: API level 29
Description
Contains information about the stored toasts
Properties

Name
Required
Type
DescriptiondisplayIdRequiredNumber
Identifier of the display where the notification is displayed. Possible values are 0 and 1sourceIdRequiredString
Contains the source Id of the requestertoastIdRequiredString
Contains the unique ID of the toast createdtimestampRequiredString
Time stamp string. It indicates epoch time as millisecondsiconUrlRequiredString
Contains the file path to icon to be displayediconPathRequiredString
Describe icon path. It should be absoulte local file system pathtitleRequiredString
Contains the title information to be displayed for the toastmessageRequiredString
Indicates the toast message.isSysReqRequiredBoolean
Indicates whether the notification comes from an app or system
true: notification from system
false: notification from appscheduleRequiredObject: schedule
Describe toast schedule.typeRequiredString
Indicates the type of the toast messagereadStatusRequiredBoolean
Indicates whether the toast is read by the user or still unread
true: toast is read
false: toast is unreadactionRequiredObject: action
Contains the on-click action parameter.
API Error Codes Reference

Error Code
Error Text
Error Description100Message is not parsed
This message implies that a JSON message parsing error occurred. One of the following situations can cause the parsing error:
The Request object was not formatted correctly.
One ore more of the required fields are missing.
One or more of the values provided were not the expected data type, for example a string was expected, however the app passed a number instead.103Unknown Source
This message implies that the system was unable to retrieve the app's sourceId from the system bus message.104Permission Denied
This message implies that the app does not have permission to create system alerts.105Message can't be empty
This message implies that the field message in the request message is empty.106Invalid Service Uri in the onclick
This message implies that the service URI given in the onclick object is invalid.

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 and sample code is licensed under the Apache License 2.0.

Contents