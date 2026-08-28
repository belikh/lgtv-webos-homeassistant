---
title: App Lifecycle Management | webOS TV Developer
id: app-lifecycle-management-webos-tv-developer
tags:
- lgtv-webos-ha-root-1a89ff
- locus-companion-lifecycle-enact-vs-js-service-vs-systemd-persistence
created: '2026-08-28T02:15:12.102100Z'
updated: '2026-08-28T02:33:57.971055Z'
source: https://webostv.developer.lge.com/develop/guides/app-lifecycle-management
source_domain: webostv.developer.lge.com
fetched_at: '2026-08-28T02:15:12.100930Z'
fetch_provider: builtin
status: draft
type: note
tier: unknown
content_type: unknown
deprecated: false
---

App Lifecycle Management | webOS TV Developer

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

Guides

App Lifecycle Management
Based on the app lifecycle, your app needs to manage its state when a relevant event is raised by the system or user. This session briefs how the app state transitions from one to another and what makes that transition happen.
Launch an app
A web app is launched by the Application Manager service (com.webos.applicationManager). The Application Manager service can be invoked by one of the following:
The Launcher
Any webOS TV app
A webOS TV service or a custom JavaScript service running on webOS TV
CLI command ares-launch
App Manager on the Emulator
Handle app launch
webOS TV raises a webOSLaunch event to launch an app. A webOSLaunch event is raised by one of the following:
Click on the app icon
CLI command ares-launch
Calling of the launch() method of Application Manager on Luna Service API
Click on LAUNCH in App Manager on the Emulator
When a webOSLaunch event is raised, the app is launched and running in the foreground.
Handle app re-launch
If an app receives a webOSLaunch or visibilityChange event while it is already running, webOS TV raises a webOSRelaunch event, instead of starting the launch process from the beginning, to avoid unnecessary workloads.
A webOSRelaunch event can be raised by one of the following:
Using the CLI commandares-launch
Calling of launch() method of Application Manager on Luna Service API
Click on LAUNCH in App Manager on the Emulator
There is a property called handlesRelaunch in the appinfo.json file, which contains the app metada, that defines whether the app handles a webOSRelaunch event on its own or not. With this property, you can make your app to do something in the background before it is re-launched to the foreground. When app re-launch is needed, webOS TV raises a webOSRelaunch event, irrespective of the value of this handlesRelaunch property, but depending on the value of this property, your app's next move varies.
If the handlesRelaunch property of an app is set to:
false, the app does not handle relaunch and launch parameters on its own. It means that webOS TV displays the app in the full-screen mode in the foreground immediately after the webOSRelaunch event occurs.
true, the app handles the webOSRelaunch event in some way in the background before it becomes visible in the foreground. webOS TV displays the app in the full-screen mode in the foreground after PalmSystem.activate() is called.

NoteIn webOS TV 4.x or lower, only PalmSystem is supported, and in webOS TV 5.0 or higher, both PalmSystem and webOSSystem are supported. Although PalmSystem is still supported for backward compatibility, future support is not guaranteed so it is strongly recommended that you use webOSSystem in webOS TV 5.0 or higher.
Examples of apps handling the webOSRelaunch event are:
A browser that receives the webOSRelaunch event with a URL as its parameter and opens the URL in a new tab.
A download client that receives the webOSRelaunch event with a filename as a parameter and adds the file to its download queue.
An app that receives the webOSRelaunch event and launches the UI for its own in-app settings.
Add an event listener
An app can have an event listener to handle the webOSLaunch or webOSRelaunch event. When a specified event occurs, the event listener receives a notification and handle the event. Moreover, the added event listener receives an event parameter that holds launch parameters.
// webOSLaunch event
document.addEventListener('webOSLaunch', function(inData) {
// Check the received parameters
console.log(JSON.stringify(inData.detail));

// Do something in the foreground
...
}, true);

// webOSRelaunch event
document.addEventListener('webOSRelaunch', function(inData) {
// Check the received parameters
console.log(JSON.stringify(inData.detail);

// Do something in the background
...

PalmSystem.activate();

// Do something in the foreground
...
}, true);

Manage app visibility
After an app is launched, it can be either visible or hidden depending on user interactions and system events. When a launched app receives a visibilityChange event (hidden) , its state becomes suspended and its visbility becomes hidden.
An app's visibility can be changed to hidden by one of the following actions:
Another app is launched by the current app.
Another app is selected from the App Manager.
On the other hand, the visibility can be changed to visible by one of the following actions:
The app icon is clicked.
The app is selected on Recents.
A visibilityChange event is raised when the visibility of an app changes from visible to hidden or vice versa, and webOS TV sends an onwebkitvisibilitychange event to the app. The app can have an event listener to take actions when its visibility changes.
The below sample code shows how to add an event handler.
document.addEventListener(
'visibilitychange',
function () {
if (document.hidden) doHiddenCleanup();
else doShowingTasks();
},
true
);
The next sample code shows how to add an event handler for each standard web engine. For the backward compatibility, it is recommended you add an event listener for the standard web engine.
var hidden, visibilityChange;

if (typeof document.hidden !== 'undefined') {
// To support the standard web browser engine
hidden = 'hidden';
visibilityChange = 'visibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
// To support the webkit engine
hidden = 'webkitHidden';
visibilityChange = 'webkitvisibilitychange';
}

document.addEventListener(
visibilityChange,
function () {
if (document[hidden]) doHiddenCleanup();
else doShowingTasks();
},
true
);

Terminate an app
An app in the launched or suspended state can be terminated by one of the following:
Click on X (close) button on the system UI
Apps are not allowed to have its own close button, so users can shall click the X (close) button to terminate an app. See Closing apps under System UI.
CLI command ares-launch --close
Click on TERMINATE of App Manager on the Emulator
See also
Check out the sample app about app lifecycle.
For information about webOSLaunch, webOSRelaunch, and other events, see webOS Events.

No Headings