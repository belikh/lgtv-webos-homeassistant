---
title: JS Service Usage | webOS TV Developer
id: js-service-usage-webos-tv-developer
tags:
- lgtv-webos-ha-root-1a89ff
- locus-companion-lifecycle-enact-vs-js-service-vs-systemd-persistence
created: '2026-08-28T02:13:26.977298Z'
updated: '2026-08-28T02:34:41.281435Z'
source: https://webostv.developer.lge.com/develop/guides/js-service-usage
source_domain: webostv.developer.lge.com
fetched_at: '2026-08-28T02:13:26.973475Z'
fetch_provider: builtin
status: draft
type: note
tier: unknown
content_type: unknown
deprecated: false
---

JS Service Usage | webOS TV Developer

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

JS Service Usage
Creating JavaScript service
To create a JS service, you can use the ares-generate command that generates a JS service project from the template.
If you do not have an app project where you call the service, you should create an app project before creating a JS Service.
Note that JS Services cannot be packaged alone.

Important

The service name must begin with the app ID. If you do not follow this naming rule, the service packaging does not work correctly. For example,

App ID: com.example.myapplication

Service name: com.example.myapplication.myservice

Luna Service does not allow minus signs (-) and .(period)+number (for example, abc-1.0) in a JS service name. Therefore, if you are to add JS services into your app,
do not include minus signs (-) or .(period)+number in your app ID, because the service name must begin with the app ID as explained above.

The usage of ares-generate command and options are as below.
Depending on the app type, specify the -t option with the appropriate template.
Here are some examples of different uses:
Create a dummy web app from a template with CLI
ares-generate -t basic -p "id=com.yourdomain.myapp" samplePrj
After you have created an app project, create a JS service project with a service name beginning with the app name.
Create a JS service from a template with CLI
ares-generate -t js_service -s com.yourdomain.myapp.service samplePrjService
For usage of ares-generate command and options, see ares-generate.
Packaging JS service
Once you generated the JS service project, you should configure the JS service directory as below.
​

APP_DIR: Directory of the application

SERVICE_DIR: Directory of the service where a subfolder named with the service name and JS Service files are located. You can locate multiple service folders in SERVICE_DIR.

For the description of the service sub-directory files, see the next section.
Registering JS service
A JS service is made up of the following files:

package.json: Configures the service metadata and points to the main service file.
This file is used for packaging (Related with Node.js).

services.json: Defines the services and their methods.
This file is used for registering JS service on the Luna bus.

JavaScript service source files: Service implementation files provide the various use case of JS service.

package.json file
As a service program is a Node.js module, the service must have a package.json file. The minimal package.json looks like this:
{
"name": "com.mycom.helloworld.service",
"main": "helloworld_webos_service.js"
}

In the name property, write your service name.

In the main property, write your main service JavaScript file name.

There are quite a few other values one can set in the package.json file.
For the complete specification of package.json, see NPM (node package manager).
services.json file
This service configuration file describes what commands the service provides on the webOS bus.
Define commands to be called from other apps and services. For more information, see services.json.
{
"id": "com.mycom.helloworld.service",
"description": "Sample helloworld service",
"services": [{
"name": "com.mycom.helloworld.service",
"description": "Sample helloworld service"
}]
}
Main service JavaScript file
In the main service JavaScript file,
you should define a single command assistant to execute the command defined in the services.json file.
Before registering a service into your code, you should load the webos-service module.
The webos-service module for Node.js provides an interface to the system bus, wrapped in familiar Node.js idioms.
The following example shows how to loads the webos-service module.
var Service = require('webos-service');
The following JavaScript example registers a service (luna://com.mycom.helloworld.service/hello) which responses to a request with a "Hello, World!" message.
var service = new Service("com.mycom.helloworld.service");

service.register("Hello", function(message) {
message.respond({
Response: "Hello, World " + message.payload.name + "!"
});
});
For more detail about the webos-service module, see webOS-Service API Reference.
Packaging JS service
Once you finish registering service and implementing app and service, you need to package them into an .IPK file.
For packaging JS service, usage of ares-package command and options are as below.
As mentioned in the figure above, APP_DIR and SERVICE_DIR mean app and service directories.
You can use an absolute or relative path for both APP_DIR and SERVICE_DIR.
ares-package APP_DIR SERVICE_DIR
Here are some examples of different uses:
Packaging service with an absolute path (in Windows)
ares-package c:\samples\app1 c:\samples\service1
Packaging service with an absolute path (in Linux/macOS)
ares-package ~/samples/app1 ~/samples/service1
Packaging service with a relative path (in Windows)
ares-package app1 service1
Packaging service with a relative path (in Linux/macOS)
ares-package ./app1 ./service1
Packaging multiple services an app (in Windows)
ares-package app1 service1 service2
Packaging multiple services an app (in Linux/macOS)
ares-package ./app1 ./service1 ./service2
For usage of ares-package command and options, see ares-package.
Calling JavaScript service
Importing JS file
You can call webOS services using the webOSTV.js library on the webOS TV platform.
The webOSTV.js library is basically included in the basic template of the CLI.
However, we recommend that you download and use the latest version of the library.
You can download the latest webOSTV.js library on the webOSTV.js Introduction page.
To apply the latest webOSTV.js library, follow the steps below:

Download and extract the webOSTV.js zip file.

Copy the extracted file to your app directory.

Insert the following script tag on the main file of your app, such as index.html.
Make sure that the source path corresponds to the path of your app directory.

<script type="text/javascript" src="webOSTVjs-1.2.4/webOSTV.js"></script>

For more details about the webOSTV.js library, see the webOSTV.js guide.
Calling services from web app
Any application can include webOSTV.js and make webOS service calls using the webOS.service.request method.
To call service in an app developed without Enyo, use the webOS.service.request method.
var subscribeStatus = true; //change this to false to disable subscription
var resubscribeStatus = true; //change this to false to disable resubscription

var request = webOS.service.request("luna://com.mycom.helloworld/", {
method:"someMethod",
parameters: {
foo:"bar"
},
onSuccess: function(inResponse) {
//....
},
onFailure: function(inError) {
//....
},
onComplete: function(inResponse) {
//....
},
subscribe: subscribeStatus,
resubscribe: resubscribeStatus
});
Check out the Hello World Service sample app.
Calling services from another service
Any service can include webOSTV.js and make webOS service calls using the service.call method as the following example.
var Service = require('webos-service');
var service = new Service("com.palm.service.helloworld");
service.register("hello", function(message) {
service.call("luna://com.palm.connectionmanager/getstatus", {}, function(response) {
console.log(response.payload);
if(response.payload.isInternetConnectionAvailable == true) {
// ...
message.respond({
"returnValue": true
});
}
});
});
For more detail about the webos-service module, see webOS-Service API Reference.

Important
Storing and sharing data
JavaScript services run inside a jail, or the permissions-restricted environment.
Whenever a jailed service runs, it should always have the same user ID so that it can access files it wrote the last time it ran,
but it can't access files created by other apps or services.
If a service is expected to share its data with other apps or services, it must provide methods that allow apps and other services to query and/or update its data.
Data stored by service should be saved to /media/internal.
Do Not

Services should not run for very long periods (minutes) primarily because of the cost of memory.

Don't use the synchronous API from node.js

Requesting subscription
The webos-service module supports the subscription feature.
You can send a subscription request to another service for services that support it.
For more detail about the webos-service module, see webOS-Service API Reference.
Client-side subscriptions
On the client (requester) side, subscriptions are handled by the Subscription object.
In most cases, you merely need to do something like this:
var Service = require('webos-service');
var service = new Service("com.domain.app");
var sub = service.subscribe("luna://com.palm.connection/status", {"subscribe": true});
sub.on("response", function(message) {
//do something with the subscription
});
Service-side subscriptions
The webos-service library offers some built-in support for services that would like to support subscriptions.
If a method has a cancel handler, then it's considered to be subscribable.
The library automatically tracks subscription requests, registering them with System Bus to ensure that the cancel event is delivered properly.
Your request handler for the method should check the message's isSubscription property to determine whether a subscription has been requested.
In most cases, you'll want to add subscribed messages to an array or Object hash to keep track of them when it's time to update them later.
Here's a partial example:
var subscriptions = {};

var heartbeat = service.register("heartbeat2");
heartbeat.on("request", function(message) {
message.respond({event: "beat"}); // initial response
if (message.isSubscription) {
subscriptions[message.uniqueToken] = message; //add message to "subscriptions"
if (!interval) {
createInterval(); // launch some async process
}
}
});
heartbeat.on("cancel", function(message) {
delete subscriptions[message.uniqueToken]; // remove message from "subscriptions"
var keys = Object.keys(subscriptions);
if (keys.length === 0) { // count the remaining subscriptions
console.log("no more subscriptions, canceling interval");
clearInterval(interval); // don't do work in the background when there are no subscriptions
interval = undefined;
}
});

No Headings