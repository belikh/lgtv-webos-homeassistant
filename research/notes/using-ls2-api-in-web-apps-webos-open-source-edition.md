---
title: Using LS2 API in Web Apps | webOS Open Source Edition
id: using-ls2-api-in-web-apps-webos-open-source-edition
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:13:05.895139Z'
source: https://www.webosose.org/docs/guides/development/web-apps/using-ls2-api-in-web-apps/
source_domain: www.webosose.org
fetched_at: '2026-08-28T02:13:05.893891Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: docs
deprecated: false
---

Using LS2 API in Web Apps | webOS Open Source Edition

Overview
Guides
Tutorials
Reference
Tools
IoT

Menu

Guides
Getting Started
Hello, webOS OSE!
Introduction to LS2 API
webOS OSE UI Guide
Video Call Usage Guide
Setup
System Requirements
Building webOS OSE
Flashing webOS OSE
Network Setup
Dual Display Setup
Google Assistant Setup
Firmware-Over-the-Air Setup
GDB Debugging Setup
Native Development Kit Setup
Bring-Up Guide
Bring-Up Overview
Tutorial - Jetson Nano
Development
Web Apps
Overview
Web App Development Workflow
Using LS2 API in Web Apps
Launching Web Apps for Dual Display
JS Services
Overview
JS Service Development Workflow
Calling JS Services
Requesting Subscription
Using Node.js Modules
FAQ on JS Services
QML Apps
Overview
QML App Development Workflow
Native Apps
Overview
Native App Development Workflow
Native Services
Overview
Native Service Development Workflow
Configuration Files
appinfo.json
packageinfo.json
services.json
Security Guide
Localization
Localization Guide
Applying Internationalization
Applying Localization
Logging
Overview
Formatting Logs
PmLogLib Overview
Using PmLogLib in C/C++
Using PmLogLib in JavaScript
Using PmLogLib in Node.js
Using PmLogLib in QML
Setting the Logging Context and Level
Logging Configuration for pmlogd
Viewing Logs
Introduction to Viewing Logs
Viewing Logs when journald is Enabled
Viewing Logs when pmlogd is Enabled
Enabling and Disabling pmlogd
Connectivity
Bluetooth Guide
Multimedia
Speech Enhancement Guide
Core Topics
Architecture Overview
Architecture Overview
Application Management
Web App Lifecycle
Graphics and Input
Graphics and Input

Using LS2 API in Web Apps
To utilize the platform capabilities in your web app, you can use LS2 API.
This page describes how to use LS2 API in your web app, with an example of the following dummy service and method:
Service name: com.webos.service.<required_service>
Method name: <method_to_call>
Call LS2 API Methods
Depending on the platform version, a different API or library is used in order to call LS2 API.
This section describes how you can call LS2 API methods by platform version.
webOS OSE 2.0 or higher
webOS OSE 1.x

Note
The Enact framework includes a webOS support module for interfacing with LS2. To call LS2 API in the Enact framework, please refer to the Luna Service API in the Enact documentation.
webOS OSE 2.0 or higher
webOS OSE 2.0 or higher provides WebOSServiceBridge, a built-in JavaScript API for web apps to access Luna Bus.
You can use the WebOSServiceBridge API to call LS2 API methods in your web app.
For detailed information on how to use the API, see the WebOSServiceBridge API reference.
webOS OSE 1.x
On webOS OSE 1.x, using the webOS library lets you call LS2 API methods in your web app.
For details on how to prepare the webOS library, see the Appendix.
After including the webOS library, use the webOS.service.request method as below in order to call LS2 API.
var subscriptionStatus = true; //change this to false to disable subscription

var request = webOS.service.request("luna://com.webos.service.<required_service>/", {
method:"<method_to_call>",
parameters: {
foo:"bar"
},
onSuccess: function(inResponse) {
//....
},
onFailure: function(inError) {
//....
},
subscribe: subscriptionStatus
});

Identify the ACG Group of the Methods
You need to identify the ACG (Access Control Groups) information for the methods being used.
Find out the ACG information using the ls-monitor command with the -i option.
$ ls-monitor -i com.webos.service.<required_service>

METHODS AND SIGNALS REGISTERED BY SERVICE 'com.webos.service.<required_service>' WITH UNIQUE NAME '********' AT HUB
"/":
...
"<method_to_call>": {"provides:["group1","group2"]}
...

Specify the Permissions for Using the Methods
In your web app project, add the requiredPermissions property to the appinfo.json file and specify the ACG information of the methods on the property.
appinfo.json
{
...
"requiredPermissions": ["group1", "group2"],
...
}

What’s Next
You need to iterate the steps above for each LS2 API method used in your web app.
After you finish implementing the web app, proceed with the rest of the development process to build and run your app.
Appendix: Preparing webOS libarary for webOS OSE 1.x
In webOS OSE 1.x, the webOS library (webOS.js) is required in order to call LS2 API method from a web app.

Note
If you create a web app using the “basic” template of the Command-Line Interface (CLI) tool, the web app will already contain the webOS library in its webOSjs-0.1.0 directory and have the library included in the index.html file. In this case, you don’t need to add additional code to import the library, so you can safely skip this step.
To include the library in a web app, follow the steps below:

Download the webOS library file from webOSjs-0.1.0.zip and decompress it to the project root directory. The following directory will be created:
webOSjs-0.1.0
├── LICENSE-2.0.txt
└── webOS.js

In the index.html file, include the webOS library with the following code.
index.html
<script type="text/javascript" src="webOSjs-0.1.0/webOS.js"></script>

Note
The webOS library file can be placed in any folder within your app project, but you must set the proper directory when including the library in the source code.

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 and sample code is licensed under the Apache License 2.0.

Contents