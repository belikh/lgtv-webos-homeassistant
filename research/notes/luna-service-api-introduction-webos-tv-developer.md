---
title: Luna Service API Introduction | webOS TV Developer
id: luna-service-api-introduction-webos-tv-developer
tags:
- lgtv-webos-ha-root-1a89ff
- locus-rooted-acl-boundary-stock-vs-root-luna-matrix
- locus-credentialless-root-detection-and-consented-ipk-orchestration
created: '2026-08-28T02:16:51.138444Z'
updated: '2026-08-28T02:40:09.073900Z'
source: https://webostv.developer.lge.com/develop/references/luna-service-introduction
source_domain: webostv.developer.lge.com
fetched_at: '2026-08-28T02:16:51.136646Z'
fetch_provider: builtin
status: draft
type: note
tier: unknown
content_type: unknown
deprecated: false
---

Luna Service API Introduction | webOS TV Developer

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

Luna Service API Introduction
webOS TV provides the Luna Service that consists of essential services and features for webOS TV. Each service and feature provide application programming interface (API) and its methods for you. With these Luna service APIs, you can request data from the proper service and use the response information to your apps.
Supported Luna Service APIs
webOS TV currently provides the following APIs. More services and APIs are on their way.
API NameDescriptionActivity ManagerThe Activity Manager is responsible for coordinating work in the system. This includes work currently being done, and work that is scheduled to be done at some point in the future.Application ManagerProvides following methods to implicitly launch a resident application based on the requested command and resource types, or to explicitly launch a specified applicationAudioProvides methods for volume control.BLE GATTProvides methods for BLE GATT.CameraProvides methods that return the information of a camera and microphone.Connection ManagerProvides the status of available Internet connections.DatabaseEnables apps to store persistent data.Device Unique IDProvides a method for device identification.DRMProvides methods for managing DRM clients, sending DRM message, and subscribing to DRM rights error information.Keymanager3Provides methods for for generation and deletion of keys, encryption and decryption, generation and verification of signature, etc.Media DatabaseEnables apps to store large media-related datasets persistently.Magic RemoteProvides functions related to the magic remote such as sensor and pairing.Settings ServiceProvides a method for retrieving system setting value.System ServiceProvides information about the system time.TV Device InformationProvides a method for retrieving TV system information.
API compatibility on webOS TV device
The following table shows the support for each API on webOS TV platform.
API NameSupported in webOS TV1.x2.x3.x4.x5.x6.x22232425Activity ManagerYesYesYesYesYesYesYesYesYesYesApplication ManagerYesYesYesYesYesYesYesYesYesYesAudioYesYesYesYesYesYesYesYesYesYesBLE GATTNoNoNoNoNoNoNoNoYesYesCameraYesYesYesDeprecatedDeprecatedDeprecatedDeprecatedDeprecatedDeprecatedDeprecatedConnection ManagerYesYesYesYesYesYesYesYesYesYesDatabaseYesYesYesYesYesYesYesYesYesYesDevice Unique IDNoNoYesYesYesYesYesYesYesYesDRMYesYesYesYesYesYesYesYesYesYesKeymanager3NoNoNoNoNoNoNoNoYesYesMedia DatabaseYesYesYesYesYesYesYesYesYesYesMagic RemotePartiallyPartiallyPartiallyPartiallyPartiallyPartiallyPartiallyPartiallyYesYesSettings ServiceYesYesYesYesYesYesYesYesYesYesSystem ServiceYesYesYesYesYesYesYesYesYesYesTV Device InformationPartiallyYesYesYesYesYesYesYesYesYes
API compatibility on webOS TV simulator
The following table shows the current support for each API on the simulator.
API NameSupported in webOS TV SimulatorActivity ManagerYesApplication ManagerYesAudioNoBLE GATTNoCameraNoConnection ManagerYesDatabaseYesDevice Unique IDYesDRMNoKeymanager3NoMedia DatabaseYesMagic RemotePartially (only getSensorData)Settings ServiceYesSystem ServiceYesTV Device InformationYes
API compatibility on webOS TV emulator
The following table shows the current support for each API on the emulator.
API NameSupported in webOS TV Emulator1.22.x3.x4.x5.x6.xActivity ManagerYesYesYesYesYesYesApplication ManagerYesYesYesYesYesYesAudioYesYesYesYesYesYesBLE GATTNoNoNoNoNoNoCameraNoNoNoNoNoNoConnection Manager
Partially
Partially
Partially
PartiallyPartiallyPartiallyDatabaseYesYesYesYesYesYesDevice Unique IDNoNoNoYesYesYesDRMNoNoNoNoNoNoKeymanager3NoNoNoNoNoNoMedia DatabaseYesYesYesYesYesYesMagic RemoteNoNoNoNoNoNoSettings ServiceYesYesYesYesYesPartiallySystem ServiceYesYesYesYesYesYesTV Device InformationPartiallyPartiallyPartiallyPartiallyPartiallyYes
Essentials of an API Service Call
Service URI
The Service URI is the URI to the service, in the form:
luna://service name
For example,
luna://com.webos.mediadb
Parameters
Parameters are service request options and are passed as a JSON object. These consist of properties required for the service request as well as a few reserved properties that are common to all service requests.
Method name
The API service method that is called. The method name can be passed as part of the URI or could be passed separately as a property of the parameters object.
Subscribe property
The 'subscribe' property is a reserved property of the parameter object and can be sent to services that allow subscriptions. If the subscribe property is set to true, the method remains in memory and return responses either at periodic intervals or when its data is updated.
Resubscribe property
The 'resubscribe' property is a reserved property of the parameter object and Is used along with the 'subscribe' property. If resubscribe is set to true, it resubscribes to a method after a failure has occurred.
Success callback
The 'onSuccess' property is a reserved property of the parameter object and is used to set a callback function that is called when a request has been successful. This function receives a JSON object containing the service's response data.
Failure callback
The 'onFailure' property is a reserved property of the parameter object and is used to set a function that is called when a request has failed. This function receives a JSON object containing the service's error details.
Complete callback
The 'onComplete' property is a reserved property of the parameter object and is used to set a function that is called when a request is complete (regardless of its success or failure).
Request object
The object returned by a service request call. It can be used to cancel the service request and any associated subscription.
Response object
The JSON object containing the service's response data. It has a reserved property 'returnValue' to indicate the success or failure of a call.
If returnValue is set to false, it means the call failed, and the response object may contain further properties such as the errorCode and errorText that give more information about the error.
If 'returnValue' is true, the call is a success, and the response object may have additional properties depending on the API call being made. If the subscribe property in the parameters was set to true, the response object returns a property subscribed to indicate the success of the subscription. A value of true in subscribed indicates that the subscription was a success.
Calling webOS services from any web application
webOSTV.js is a portable library specialized in webOS TV. Any application can include webOSTV.js, and you can make webOS service calls using the webOS.service.request API.
From webOS TV 4.0, we provide the webOSTV.js library instead of the webOS.js library.  Bootplate-web templates contain the webOSTV.js library in its webOSTVjs-x.x.x directory. You can add this library to your app as below:
<script type="text/javascript" src="webOSTVjs-1.1.1/webOSTV.js"></script>
For more details about webOSTV.js, see the webOSTV.js guide. The following code snippet shows how you can call a webOS service using webOSTV.js.
var request = webOS.service.request("luna://com.mycom.helloworld.service", {
method:"hello",
parameters: {"input": inputMessage},

onSuccess: function (args) {
//TO-DO
},

onFailure: function(inError) {
//TO-DO
},

onComplete: function(inResponse) {
//....
},

subscribe: subscribeStatus ,
resubscribe: resubscribeStatus
});

ImportantImplicit objects, used for the Luna API call, might be removed by garbage collection (GC) before you get the return data. Therefore, we recommend using a variable to call or subscribe to Luna APIsas the above code example.
Calling webOS services using Enact
To call webOS services using the Enact framework, see the following documents.
DocURLwebOS Support Modulehttp://enactjs.com/docs/developer-guide/webos/
webOS Library
http://enactjs.com/docs/modules/webos/LS2Request/

No Headings