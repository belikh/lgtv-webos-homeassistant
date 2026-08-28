---
title: Activity Manager API Reference Guide | webOS TV Developer
id: activity-manager-api-reference-guide-webos-tv-developer
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:15:26.382677Z'
source: https://webostv.developer.lge.com/develop/references/activity-manager
source_domain: webostv.developer.lge.com
fetched_at: '2026-08-28T02:15:26.381080Z'
fetch_provider: builtin
status: draft
type: note
tier: unknown
content_type: unknown
deprecated: false
---

Activity Manager API Reference Guide | webOS TV Developer

Search
Open menu

SearchSign In

webOS News

Flutter for webOS TV is Now Available for Developers!
Flutter for webOS TV is now officially available, enabling developers to build, package, and run Flutter apps directly on webOS TV devices using the flutter-webOS SDK.

LG Gallery+ Turns LG TVs Into Design Elements That Personalize Your Living Space
LG announced the availability of LG Gallery+, a new visual curation service that enriches living spaces to reflect the unique style and mood of each user.

Search
Close menu

References

Activity Manager
Service URI - luna://com.palm.activitymanager
Monitors various parts of the system, and launches services when the corresponding events happen. Activities can also be used to schedule work, periodically, or at particular times.
The Activity Manager is responsible for coordinating work in the system. This includes work currently being done, and work that is scheduled to be done at some point in the future. The primary unit of control is the Activity, which represents some specific item of work in the system - such as syncing an email account, or a game that is being played. The Activity Manager tracks what Apps, Services, and other system resources are associated with particular Activities. The Activity Manager dynamically alters operating system priorities on those resources. This is to give preference to Activities the user is currently directly interacting with, while lowering the priority of resources associated with background Activities. This is to improve the perceived performance of the system as a whole.
Methods
MethodDescriptionSupported in EmulatoradoptRegisters an app's or service's willingness to take over as the Activity's parent.YescancelTerminates the specified Activity and sends acancel event to all subscribers.YescompleteAn Activity's parent can use this method to end the Activity and optionally restart it with new attributesYescreateCreates a new Activity and returns its ID.YesreleaseAllows a parent to free an Activity and notify other subscribers.YesstartAttempts to start the specified ActivityYesstopStops an Activity and sends a stop event to all Activity subscribers.Yes
adopt
Description
Register an app's or service's willingness to take over as the Activity's parent.
If your app can wait for an unavailable, not released Activity to become available, then set the "wait" flag to true. If it is, and the Activity is valid, which means Activity exists and is not exiting, the call should succeed. If it cannot wait, and the Activity is valid but cannot be adopted, then the call fails. The adopted return flag indicates a successful or failed adoption.
If not immediately adopted and waiting is requested, theorphan event informs the adopter that they are the new Activity parent.
An example where adoption makes sense is an app that allocates a separate Activity for sync and passes that Activity to a service to use. The service should adopt the Activity and be ready to take over in the event the app exits before the service is done syncing. Otherwise, it receives acancel event and should exit immediately. The service should wait until the adopt() call returns successfully before beginning Activity work. If adoption fails, it indicates the caller has quit or closed the Activity, and the request should not be processed. The Service should continue to process incoming events on their subscription to the Activity.
If the service did not call adopt() to indicate to the Activity Manager its willingness to take over as the parent, it should be prepared to stop work for the Activity and unsubscribe if it receives a cancel event. Otherwise, if it receives the orphan event indicating the parent has unsubscribed, and the service is now the parent, then it should use complete() when finished to inform the Activity Manager before unsubscribing.
Parameters
NameRequiredTypeDescriptionactivityIdRequiredNumberActivity ID. Either this or "activityName" is required.activityNameRequiredStringActivity name. Either this or "activityId" is required.waitRequiredBooleanThe flag to wait for Activity to be released.subscribeRequiredBooleanThe flag that decides whether to subscribe or not.
true: Subscribe.
false: Do not subscribe. Call the method only once. (Default)detailedEventsOptionalBooleanThe flag to have the Activity Manager generateupdate events when the state of an Activity's requirement changes.
Call returns
NameRequiredTypeDescriptionreturnValueRequiredBooleanThe flag that indicates the success/failure of the request.
true: Success
false: FailureerrorCodeOptionalNumbererrorCode contains the error code if the method fails. The method returns errorCode only if it fails.
See the Error Codes Reference of this method for more details.errorTextOptionalStringerrorText contains the error text if the method fails. The method returns errorText only if it fails. See the Error Codes Reference of this method for more details.adoptedOptionalBooleanTrue if the Activity was adopted.
Error reference
Error CodeError Message2No such file or directory11Operation blocked12Out of memory13Permission denied17File already exists22Invalid argument38Function not implemented-1000Internal error
Subscription returns
NameRequiredTypeDescriptionreturnValueRequiredBooleanThe flag that indicates the success/failure of the request.
true: Success
false: FailureactivityIdRequiredNumberCreated Activity ID. You could get a subscription when there are status updates.eventRequiredStringWhat this activity did. The Activity Manager generates either astart event if the requirements are met, and then return this result to subscribes. It is the same when the activity is canceled or stopped as "cancel" or "stop."
Example:

{
"activityId": 10813,
"event": "start",
"returnValue": true
}activityRequiredObjectActivity object.
Example
// Adopt an activity
var request = webOS.service.request('luna://com.palm.activitymanager', {
method: 'adopt',
parameters: {
activityId: 90,
wait: true,
subscribe: true,
detailedEvents: false,
},
onSuccess: function (inResponse) {
if (inResponse.event == 'orphan') {
console.log('The activity has been adopted to current app or service');
// To-Do something
} else if (inResponse.adopted) {
console.log(
'The activity has been transferred from current app or service to another adopter'
);
// To-Do something
} else if (!inResponse.adopted) {
console.log(
'The succeeded to request a activity adoption and start subscription'
);
}
},
onFailure: function (inError) {
console.log('Failed to request a activity adoption');
console.log('[' + inError.errorCode + ']: ' + inError.errorText);
// To-Do something
return;
},
});
Return example
// Subscription return: If the parent of the activity did not release the activity.
// Mostly your app or service will receive this result at first time return.
{
"adopted": false,
"returnValue": true
}

// Subscription return: When the activity is released and current app or service adopts the activity.
// Only one adopter receives this result and it becomes the parent of the activity.
// Other adopter candidates remain as adopter continuously. (First in, First out)
{
"event": "orphan",
"activityId": 90,
"returnValue": true
}

// Subscription return: When the activity is transferred to another adopter.
{
"adopted": true,
"returnValue": true
}

// Error return
{
"errorCode": 2,
"returnValue": false,
"errorText": "activityId not found"
}
See also
complete
create
release
cancel
Description
Terminates the specified Activity and sends acancel event to all subscribers. This call should succeed if the Activity exists and is not already exiting. This is different from the stop method in that the Activity should take little or no time to clean up. On acancel, it should immediately abort the processing task, clean up, and exit, On a stop, it should finish processing tasks in some reasonable amount of time (10-15 seconds).
Parameters
NameRequiredTypeDescriptionactivityIdRequiredNumberActivity ID. Either this or "activityName" is required.activityNameRequiredStringActivity name. Either this or "activityId" is required.
Call returns
NameRequiredTypeDescriptionreturnValueRequiredBooleanThe flag that indicates the success/failure of the request.
true: Success
false: FailureerrorCodeOptionalNumbererrorCode contains the error code if the method fails. The method returns errorCode only if it fails.
See the Error Codes Reference of this method for more details.errorTextOptionalStringerrorText contains the error text if the method fails. The method returns errorText only if it fails.
See the Error Codes Reference of this method for more details.
Error reference
Error CodeError Message2No such file or directory11Operation blocked12Out of memory13Permission denied17File already exists22Invalid argument38Function not implemented-1000Internal error
Example
var request = webOS.service.request('luna://com.palm.activitymanager', {
method: 'cancel',
parameters: {
activityId: 93,
},
onSuccess: function (inResponse) {
console.log('The Activity is canceled');
// To-Do something
},
onFailure: function (inError) {
console.log('Failed to cancel the Activity');
console.log('[' + inError.errorCode + ']: ' + inError.errorText);
// To-Do something
return;
},
});
Return example
// Success return
{
"returnValue": true
}

// Error return
{
"errorCode": 2,
"returnValue": false,
"errorText": "activityId not found"
}
See also
create
stop
complete
Description
An Activity's parent can use this method to end the Activity and optionally restart it with new attributes.
If there are other subscribers, they receive acomplete event. If a restart is requested, the Activity is optionally updated with any new Callback, Schedule, or Trigger data and returned to the queued state. Specifying false for any of those properties removes the property completely. For any properties not specified, current properties are used. If the Activity is persistent (specified with the persist flag in the Type object), the db8 database is updated before the Call returns.
Parameters
NameRequiredTypeDescriptionactivityIdRequiredNumberActivity ID. Either this or "activityName" is required.activityNameRequiredStringActivity name. Either this or "activityId" is required.restartOptionalBooleanRestart Activity flag. The default is false.callbackOptionalObjectCallback to use if Activity is restarted.scheduleOptionalObjectTo use if Activity is restarted or just set as false.triggerOptionalObjectTrigger to use if Activity is restarted.metadataOptionalObjectIf Metadata is provided or just set as false.
Call returns
NameRequiredTypeDescriptionreturnValueRequiredBooleanThe flag that indicates the success/failure of the request.
true: Success
false: FailureerrorCodeOptionalNumbererrorCode contains the error code if the method fails. The method returns errorCode only if it fails.
See the Error Codes Reference of this method for more details.errorTextOptionalStringerrorText contains the error text if the method fails. The method returns errorText only if it fails.
See the Error Codes Reference of this method for more details.
Error reference
Error CodeError Message2No such file or directory11Operation blocked12Out of memory13Permission denied17File already exists22Invalid argument38Function not implemented-1000Internal error
Subscription returns
NameRequiredTypeDescriptionreturnValueRequiredBooleanThe flag that indicates the success/failure of the request.
true: Success
false: FailureactivityIdRequiredNumberCreated Activity ID. You could get a subscription when there are status updates.eventRequiredStringWhat this activity did. The Activity Manager generates either astart event if the requirements are met, and then return this result to subscribers. It is the same when the activity is canceled or stopped as cancel or stop.
Example:
{
"activityId": 10813,
"event": "start",
"returnValue": true
}activityRequiredObjectAcitivity object.
Example
var request = webOS.service.request('luna://com.palm.activitymanager', {
method: 'complete',
parameters: {
activityId: 94,
},
onSuccess: function (inResponse) {
console.log('The Activity is completed');
// To-Do something
},
onFailure: function (inError) {
console.log('Failed to complete the Activity');
console.log('[' + inError.errorCode + ']: ' + inError.errorText);
// To-Do something
return;
},
});
Return example
// Success return
{
"returnValue": true
}

// Error return
{
"errorCode": 2,
"returnValue": false,
"errorText": "activityId not found"
}
See also
create
create
Description
Creates a new Activity and returns its ID.
You can create either a foreground or background Activity. A foreground Activity is run as soon as its specified prerequisites are met. After a background Activity's prerequisites are met, it is moved into a ready queue, and a limited number are allowed to run depending on system resources. The foreground is the default.
Activities can be scheduled to run at a specific time or when certain conditions are met, or events occur. Each of your created and owned Activities must have a unique name. To replace one of your existing Activities, set the "replace" flag to true. This cancels the original Activity and replaces it with the new Activity.
To keep an Activity alive and receive status updates, the parent (and adopters, if any) must set the "subscribe" flag to true. Activities with a callback and "subscribe=false", the Activity must be adopted immediately after the callback is invoked for the Activity to continue.
To indicate the Activity is fully-initialized and ready to launch, set the "start" flag to true. Activities with a callback should be started when created - the callback is invoked when the prerequisites have been met and, in the case of a background, non-immediate Activity, it has been cleared to run.
If the creator of the Activity also specifies "subscribe":true, and detailed events are enabled for that subscription, then the Activity Manager generates either an immediate start event if the requirements are met, or an update event if the Activity is not yet ready to start due to missing requirements, schedule, or trigger objects. This allows the creating Service to determine if it should continue executing while waiting for the callback, or exit to free memory if it may be a while before the Activity is ready to run.
Parameters
NameRequiredTypeDescriptionactivityRequiredObjectActivity objectsubscribeOptionalBooleanThe flag that enables whether to subscribe or not.
true: Enable the subscription
false: Do not enable the subscription (Default).detailedEventsOptionalBooleanFlag to have the Activity Manager generateupdate events when the state of one of this Activity's requirements changes.startOptionalBooleanStart Activity immediately. This flag should be set true when subscribe is false.replaceOptionalBooleanCancel Activity and replace with Activity of same name flag.
Call returns
NameRequiredTypeDescriptionreturnValueRequiredBooleanThe flag that indicates the success/failure of the request.
true: Success
false: FailureerrorCodeOptionalNumbererrorCode contains the error code if the method fails. The method returns errorCode only if it fails.
See the Error Codes Reference of this method for more details.errorTextOptionalStringerrorText contains the error text if the method fails. The method returns errorText only if it fails.
See the Error Codes Reference of this method for more details.activityIdOptionalNumberActivity ID
Error reference
Error CodeError Message2No such file or directory11Operation blocked12Out of memory13Permission denied17File already exists22Invalid argument38Function not implemented-1000Internal error
Subscription returns
NameRequiredTypeDescriptionreturnValueRequiredBooleanThe flag that indicates the success/failure of the request.
true: Success
false: FailureactivityIdRequiredNumberCreated Activity ID. You could get a subscription when there are status updates.eventRequiredStringWhat this activity did. The Activity Manager generates either astart event if the requirements are met, and then return this result to subscribers. It is the same when the activity is canceled or stopped as cancel or stop.
Example:
{
"activityId": 10813,
"event": "start",
"returnValue": true
}activityRequiredObjectAcitivity object
Example
// Create a basic activity
var request = webOS.service.request('luna://com.palm.activitymanager', {
method: 'create',
parameters: {
activity: {
name: 'basicactivity',
description: 'Test create',
type: {
foreground: true,
},
},
start: true,
subscribe: true,
},
onSuccess: function (inResponse) {
if (!inResponse.event) {
console.log('The Activity is created');
// To-Do something
} else {
console.log('Received event: ' + inResponse.event);
// To-Do something
}
},
onFailure: function (inError) {
console.log('Failed to create the Activity');
console.log('[' + inError.errorCode + ']: ' + inError.errorText);
// To-Do something
return;
},
});

// Create a scheduled activity
var request = webOS.service.request('luna://com.palm.activitymanager', {
method: 'create',
parameters: {
activity: {
name: 'ScheduledActivity',
description: 'Test create of scheduled activity',
type: {
foreground: true,
},
schedule: {
start: '2015-02-15 13:22:00',
},
},
start: true,
subscribe: true,
},
onSuccess: function (inResponse) {
if (!inResponse.event) {
console.log('The scheduled Activity is created');
// To-Do something
} else {
console.log('Received event: ' + inResponse.event);
// To-Do something
}
},
onFailure: function (inError) {
console.log('Failed to create the Activity');
console.log('[' + inError.errorCode + ']: ' + inError.errorText);
// To-Do something
return;
},
});

// Create a scheduled activity with callback
var request = webOS.service.request('luna://com.palm.activitymanager', {
method: 'create',
parameters: {
activity: {
name: 'ScheduledActivityWithCallback',
description: 'Test create of scheduled activity with callback',
type: {
foreground: true,
},
schedule: {
start: '2015-02-15 00:05:00',
},
callback: {
method: 'luna://com.webos.audio/setMuted',
params: {
muted: 'true',
},
},
},
start: true,
subscribe: true,
},
onSuccess: function (inResponse) {
if (!inResponse.event) {
console.log('The scheduled Activity is created');
// To-Do something
} else {
console.log('Received event: ' + inResponse.event);
console.log('Audio will be muted');
// To-Do something
}
},
onFailure: function (inError) {
console.log('Failed to create the Activity');
console.log('[' + inError.errorCode + ']: ' + inError.errorText);
// To-Do something
return;
},
});

// Create a triggered activity with callback
var request = webOS.service.request('luna://com.palm.activitymanager', {
method: 'create',
parameters: {
activity: {
name: 'triggeredActivity',
description: 'Test create Activity with Trigger',
type: {
background: true,
},
trigger: {
method: 'luna://com.palm.connectionmanager/getStatus',
params: { subscribe: true },
},
callback: {
method: 'luna://com.webos.applicationManager/launch',
params: {
id: 'com.yourdomain.app.downloader',
},
},
},
start: true,
subscribe: true,
},
onSuccess: function (inResponse) {
if (!inResponse.event) {
console.log('The scheduled Activity is created');
// To-Do something
} else {
console.log('Received event: ' + inResponse.event);
console.log('Audio will be muted');
// To-Do something
}
},
onFailure: function (inError) {
console.log('Failed to create the Activity');
console.log('[' + inError.errorCode + ']: ' + inError.errorText);
// To-Do something
return;
},
});

Return example
// Success return - First return (When activity is created)
{
"activityId": 83,
"returnValue": true
}

// Success return - When activity starts
{
"event": "start",
"activityId": 83,
"returnValue": true
}

// Error return
{
"errorCode": 22,
"returnValue": false,
"errorText": "invalid parameters: caller=' error='required property not found - 'activity'"
}
See also
adopt
release
Description
Allows a parent to free an Activity and notify other subscribers. The Activity is canceled unless one of its non-parent subscribers adopts it and becomes the new parent. The Activity is canceled immediately. For a completely safe transfer, a subscribing app or service, prior to the release, should already have called the adopt method, indicating its willingness to take over as the parent.
Syntax
release(Number activityId, String activityName)
Parameters
NameRequiredTypeDescriptionactivityIdRequiredNumberActivity ID. Either this or "activityName" is required.activityNameRequiredStringActivity name. Either this or "activityId" is required.
Call returns
NameRequiredTypeDescriptionreturnValueRequiredBooleanThe flag that indicates the success/failure of the request.
true: Success
false: FailureerrorCodeOptionalNumbererrorCode contains the error code if the method fails. The method returns errorCode only if it fails.
See the Error Codes Reference of this method for more details.errorTextOptionalStringerrorText contains the error text if the method fails. The method returns errorText only if it fails.
See the Error Codes Reference of this method for more details.
Error reference
Error CodeError Message2No such file or directory11Operation blocked12Out of memory13Permission denied17File already exists22Invalid argument38Function not implemented-1000Internal error
Example
var request = webOS.service.request('luna://com.palm.activitymanager', {
method: 'release',
parameters: {
activityId: 98,
},
onSuccess: function (inResponse) {
console.log('The Activity is released');
// To-Do something
},
onFailure: function (inError) {
console.log('Failed to release the Activity');
console.log('[' + inError.errorCode + ']: ' + inError.errorText);
// To-Do something
return;
},
});

Return example
// Success return
{
"returnValue": true
}

// Error return
{
"errorCode": 2,
"returnValue": false,
"errorText": "activityId not found"
}
See also
adopt
create
start
Description
Attempts to start the specified Activity, either moving it from the "init" state to be eligible to run or resuming it if it is currently paused. This sends start events to any subscribed listeners once the Activity is cleared to begin. If the "force" parameter is present (and true), other Activities could be canceled to free resources the Activity needs to run.
Parameters
NameRequiredTypeDescriptionactivityIdRequiredNumberActivity ID. Either this or "activityName" is required.activityNameRequiredStringActivity name. Either this or "activityId" is required.
Call returns
NameRequiredTypeDescriptionreturnValueRequiredBooleanThe flag that indicates the success/failure of the request.
true: Success
false: FailureerrorCodeOptionalNumbererrorCode contains the error code if the method fails. The method returns errorCode only if it fails.
See the Error Codes Reference of this method for more details.errorTextOptionalStringerrorText contains the error text if the method fails. The method returns errorText only if it fails.
See the Error Codes Reference of this method for more details.
Error reference
Error CodeError Message2No such file or directory11Operation blocked12Out of memory13Permission denied17File already exists22Invalid argument38Function not implemented-1000Internal error
Example
var request = webOS.service.request('luna://com.palm.activitymanager', {
method: 'start',
parameters: {
activityId: 93,
},
onSuccess: function (inResponse) {
console.log('The Activity is started');
// To-Do something
},
onFailure: function (inError) {
console.log('Failed to start the Activity');
console.log('[' + inError.errorCode + ']: ' + inError.errorText);
// To-Do something
return;
},
});

Return example
// Success return
{
"returnValue": true
}

// Error return
{
"errorCode": 2,
"returnValue": false,
"errorText": "activityId not found"
}
See also
create
stop
Description
Stops an Activity and sends a stop event to all Activity subscribers. This succeeds unless the Activity is already canceled.
This is different from the cancel method in that more time is allowed for the Activity to clean up. On acancel, it should immediately abort the processing task, clean up, and exit. On a stop, it should finish processing the task in some reasonable amount of time (10-15 seconds).
Parameters
NameRequiredTypeDescriptionactivityIdRequiredNumberActivity ID. Either this or "activityName" is required.activityNameRequiredStringActivity name. Either this or "activityId" is required.
Call returns
NameRequiredTypeDescriptionreturnValueRequiredBooleanThe flag that indicates the success/failure of the request.
true: Success
false: FailureerrorCodeOptionalNumbererrorCode contains the error code if the method fails. The method returns errorCode only if it fails.
See the Error Codes Reference of this method for more details.errorTextOptionalStringerrorText contains the error text if the method fails. The method returns errorText only if it fails.
See the Error Codes Reference of this method for more details.
Error reference
Error CodeError Message2No such file or directory11Operation blocked12Out of memory13Permission denied17File already exists22Invalid argument38Function not implemented-1000Internal error
Example
var request = webOS.service.request('luna://com.palm.activitymanager', {
method: 'stop',
parameters: {
activityId: 93,
},
onSuccess: function (inResponse) {
console.log('The Activity is stopped');
// To-Do something
},
onFailure: function (inError) {
console.log('Failed to stop the Activity');
console.log('[' + inError.errorCode + ']: ' + inError.errorText);
// To-Do something
return;
},
});

Return example
// Success return
{
"returnValue": true
}

// Error return
{
"errorCode": 2,
"returnValue": false,
"errorText": "activityId not found"
}
See also
cancel
create
Object
Activity object
Represents everything about an Activity-name, type, state, requirements, schedule, trigger, callback, id, creator, adopters, processes, flows, and associations.
{
//**The following are Activity creator specified attributes.
"name" : string,
"description" : string,
"type" : Type object,
"schedule" : Schedule object,
"trigger" : Trigger object,
"callback" : Callback object,

//**The following are AM maintained read-only attributes.
"metadata" : any object,
"activityId" : int,
"creator" : Parent object,
"parent" : Parent object,
"adopters" : Parent object array,
"state" : State object,
"focused" : boolean
}
NameRequiredTypeDescriptionnameRequiredStringActivity name. It must be unique for a creator. Applies to both persistent and non-persistent Activities. The create call fails if this field is not unique unless the "replace" field is true.descriptionRequiredStringActivity description.typeRequiredObjectIndicates how the Activity is handled. Principally, it is used to denote the Activity as either foreground or background, and whether it can be paused or canceled.scheduleOptionalObjectTime-based requirements for Activity.triggerOptionalObjectThe event that must occur for Activity to run.callbackOptionalObjectCall to invoke when Activity runs. This object should be defined when Activity is needed to start immediately.metadataOptionalObjectOpaque object the Activity Manager stores and returns in the callback parameters.activityIdOptionalNumberActivity IDcreatorOptionalObjectActivity creator (parent object)parentOptionalObjectActivity parentadoptersOptionalObject arrayActivity adopters (parent object array)stateOptionalStringActivity state. Property that represents the current activity state with the following strings:
init: Activity has been created and is waiting for Activity's associations and initial app and service subscriptions to be in place.
waiting: Activity is waiting for a trigger to fire or its scheduled time to begin running.
blocked: Activity is waiting for its specified Requirements to be met.
queued: The Activity is queued and ready to run.
running: The Activity is running.
pause: The Activity is paused.
canceling: The Activity has been canceled and waiting for potential adopters to take over as the parent.
canceled: The Activity is canceled.
stopping: The Activity is in the process of stopping.
stopped: The Activity has been stopped.
complete: The Activity is complete and has stopped.focusedOptionalBooleanThe flag that indicates whether Activity has focused or not.
Callback object
Callbacks allow a service to stop running and consuming resources while it waits for an Activity to start at a set time or for a trigger to fire. When the Activity begins, the callback is invoked, and the service can resume. A callback specification consists of a method and arguments. Activities with a callback should be started immediately. The Activity Manager invokes the callback when the prerequisites are met and, in the case of a background/non-immediate Activity, it is cleared to run.
{
"method" : string,
"params" : any
}
NameRequiredTypeDescriptionmethodRequiredStringCallback URI.paramsOptionalAnyAny parameters to pass to the callback.
Schedule object
The Schedule object defines an Activity's time-based requirements. The time an Activity is scheduled to run can be either absolute or local. If local time is specified, the Activity Manager watches for time zone changes and automatically adjusts the UTC.
Smart Intervals, specified with the interval field, allow tasks to be scheduled in evenly aligned batches, optimizing battery power and efficiency. Smart intervals are specified with the interval string field as "##d##h##m##s". Days (d), hours (h), minutes (m), and seconds (s) must be specified in the order, but any can be left out. The 24h Activity slot is aligned at a random point between midnight and 2 am local time (determined each time the device boots) to avoid excessive server access at midnight. It is recommended you use this if a precise interval is not required. Smart intervals must be specified as an even multiple of days, 1, 3, 6, or 12-hour intervals and 5, 10, or 15-minute intervals. All tasks on the interval are aligned at approximately the same time.
Starting can be delayed if additional Requirements are specified, or if a Trigger has yet to fire.
Most scheduled Activities should be background Activities.

ImportantAll fields are optional through you must specify either "start" or "interval". UTC strings not ending in Z are interpreted as local time.
{
"precise" : boolean,
"start" : string,
"interval" : string,
"skip" : boolean,
"local" : boolean,
"end" : string,
"relative" : boolean,
"lastFinished" : string
}
NameRequiredTypeDescriptionpreciseRequiredBooleanIndicates the interval occurs at the precisely specified start time, and every given interval thereafter.startRequiredStringLaunch time. The time format is a subset of ISO 8601 "YYYY-MM-DD HH:MM:SS"(for local) or "YYYY-MM-DD HH:MM:SSZ" for UTC. This field is required for basic scheduled items, and optional for intervals.intervalOptionalStringSpecifies the number of days, hours, minutes, and seconds-"##d##h##m##s"-between Activity execution. If set, then after an Activity is marked Complete, it is re-queued with a new start time. Days, hours, minutes and seconds must be specified in the order, but any can be left out.skipOptionalBooleanIf an interval Activity is not able to run, i.e., the device was off when scheduled to start, it runs(by default) at the first opportunity. However, if the skip is true, it waits for the next scheduled interval time to occur before running.localOptionalBooleanIndicates that a date/time NOT ending in 'Z' is local. This becomes unnecessary once times not ending in 'Z' are interpreted as local by default.endOptionalStringEnd date/time for the interval.relativeOptionalBooleanIndicates the interval occurs at the finished time of the last activity. The finished time of the last activity is set as the base time for the interval. Start time is needed for initialization. Therefore this property is available when the precise property is true.lastFinishedOptionalBooleanLast finished time. The time format is a subset of ISO 8601 "YYYY-MM-DD HH:MM:SS"(for local) or "YYYY-MM-DD HH:MM:SSZ" for UTC.
Trigger object
Activities with Triggers do not become runnable until an event occurs on a subscribed method. In addition, other requirements or scheduling constraints may also need to be met before the Activity is runnable. When the Activity starts, the specified method is called with "subscribe=true", and any additional arguments the Activity creator provides. If another Activity has previously been created and started with an identical Trigger, with the same method and arguments, then the Activity Manager may utilize its existing subscription to monitor the Triggering event, unless "unique" is true in the Trigger specification.
If the Trigger specification includes a "key" property, the Activity Manager looks for responses to the Trigger method call that includes the named "key" property. The Trigger fires when a response with that property is seen (including the initial response). The Trigger also fires if the Trigger method returns an error result-either the initial call result or any subsequent results. If a "key" property is not specified the Trigger fires on the first response after the initial successful response.
An example of a "key" property would be the "fired" property that db8 returns in a notification that watched query results have changed.
Triggers are not "persistent subscriptions". The Trigger is unsubscribed after the response which causes it to fire is seen.
The Trigger fires on any error return result. Once it fires, the Trigger is unsubscribed. If a new Trigger is desired, your app should create a new Activity.

ImportantDo NOT ignore the trigger information returned in a callback. If an error is returned to the method specified for a Trigger, then the Trigger fires immediately. This could happen if, for example, the parameters passed to the method were invalid or wrong. If the Trigger callback re-starts the Activity, i.e., in the case of a db8 watch, then the potential exists for an infinite loop. Check for errors.
Keep the mutual exclusion among the "key", "compare", and "where" properties. They are incompatible with each other.
{
"method" : string,
"key" : string,
"params" : object,
"where" : string or array of strings,
"compare" : {
"key": string,
"value": number or string
}
}
NameRequiredTypeDescriptionmethodRequiredStringName of the callback method.paramsOptionalObjectParameters for subscription or watch.whereOptionalObjectSingle db8 where clause or array of db8 where clauses.compareOptionalObjectThe object that holds key and value properties. The trigger query with the key and compare the old value with the specified value.keyOptionalStringKey property name. Activity Manager looks for this field in callback response, i.e., "fired" from db8 watch where query results have changed.
Type object
Indicates how the Activity is handled. Principally, it is used to denote the Activity as either foreground or background, and whether it can be paused or canceled.
Foreground or Background
Default attributes are associated with background and foreground Activities:
Foreground Activities are the high priority andimmediate- They cannot be queued and begin running when their prerequisites are met.
Background Activities are the low priority and notimmediate- They are runnable but queued until necessary resources become available.
Whether an activity is a foreground or background should only be set once. The default is foreground. If your app specifies foreground or background, do NOT set the advanced attributes like "immediate" and "priority". If you set them, the Activity Manager will NOT create the Activity. If you do not set either foreground or background, then you MUST set "immediate" and "priority".
Priority
Use "high" or "highest" priority if your Activity's performance is critical, for example: 3D games, where failing to keep up with the desired frame rate is dramatically noticeable. Normal interactive UI Activities should use "normal". If an immediate display is not critical to your app, say, for example, email sync, "low" priority is appropriate since the user does not necessarily expect email to show up immediately when they hit the 'sync' button, so a little extra time is not a problem. In addition, the delay only happens if the device has other things to do; if your Activity is the only thing running, it gets all the CPU it needs.
Probe Activity
As indicated by the "probe" flag, a probe Activity is one that does not impact resources, allowing many to run in parallel, rather than serially. You can use this in cases where more complex logic is required to determine if an Activity can proceed. Schedule the probe Activity with the Activity Manager and conclude the probe. For example, an email syncing app or service may first want to see if there is an email to sync. Let's say there are 10 email accounts. The setup, login negotiation, and waiting for the server to respond might take 15-30 seconds. If done in sequence, it would take 5 minutes to discover if there was an email to sync on all the accounts. Most of this involves waiting, so there is minimal CPU involved. It is also likely to be implemented in the same few services, so, in terms of memory use, doing five is probably as expensive as doing one. In this case, it is better to run them in parallel, find out which accounts had mail to sync, and then create new background Activities specifically to sync each account with mail.
Persistent Activity
If "persist" is true, the Activity continues across device reboots. These Activities are atomically updated and re-scheduled across version updates and device or services crashes. However, note that the Activity Manager does not have any visibility into what your activity is actually doing, so if your app is in the middle of doing something in response to a fired activity, the Activity Manager has no awareness of that. In other words, the state of an activity, such as "paused", is not saved; instead, what happens is that activity specifications are reloaded as if you had just called "create" for it.
Explicit Activity
If "explicit" is true, the Activity can only be terminated with a stop, cancel, or complete call. If the parent of an explicit Activity unsubscribes, and no other adopter is available, then, instead of being canceled (the default) the Activity is moved back to the ready state and its callback is invoked.
Schema

ImportantAll fields are optional, but if you do not set "foreground" or "background", then you must set "immediate" and "priority".
{
"foreground" : boolean | "background": boolean,
"immediate" : boolean,
"priority" : string,
"userInitiated" : boolean,
"persist" : boolean,
"explicit" : boolean,
"continutous" : boolean,
"power" : boolean,
"powerDebounce" : boolean
}
NameRequiredTypeDescriptionforegroundOptionalBooleanActivity runs in the foreground and starts running when its prerequisites are met. Set either this or background or immediate and priority.backgroundOptionalBooleanActivity runs in the background. When its prerequisites are met it's placed into a ready queue and runs as system resources allow. Set either this or foreground, or immediate and priority.immediateOptionalBooleanActivity should run immediately. Set either this and priority, or background or foreground.priorityOptionalStringIndicates Activity's priority. Must be one of the following: "highest", "high", "normal", "low", or "lowest". Set either this and immediate, or background or foreground.userInitiatedOptionalBooleanNot currently used.persistOptionalBooleanStores Activity state in DB so it can span reboots, loss of service, or updates.explicitOptionalBooleanActivity is restarted unless terminated with complete, stop, or cancel.continuousOptionalBooleanActivity does not have a well-defined ending point and could run indefinitely.powerOptionalBooleanActivity requires device remain powered while it is running.powerDebounceOptionalBooleanEvents associated with this Activity are due to complete shortly. Set this flag to keep the device from having to suspend/restart in the meantime.
Parent object
The Parent (or potential parent) of an Activity specified as an app ID or service ID. The Activity Manager automatically obtains this value when the app or service invokes the create method or adopt method.
{
"appId" : string | "serviceId" : string
}
NameRequiredTypeDescriptionappIdOptionalStringApplication ID. Either this or serviceId must be specified.serviceIdOptionalStringService ID. Either this or appId must be specified.

No Headings