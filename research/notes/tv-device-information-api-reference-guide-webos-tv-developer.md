---
title: TV Device Information API Reference Guide | webOS TV Developer
id: tv-device-information-api-reference-guide-webos-tv-developer
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:16:54.670340Z'
source: https://webostv.developer.lge.com/develop/references/tv-device-information
source_domain: webostv.developer.lge.com
fetched_at: '2026-08-28T02:16:54.648549Z'
fetch_provider: builtin
status: draft
type: note
deprecated: false
summary: TV Device Information API Reference Guide | webOS TV Developer
---

TV Device Information API Reference Guide | webOS TV Developer

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

TV Device Information
Service URI - luna://com.webos.service.tv.systemproperty
Provides a method for retrieving TV system information. This API is used to check the version of webOS TV and its features.
Methods
MethodDescriptionSupported in EmulatorgetSystemInfoRetrieves the system information with keys.Yes
getSystemInfo
Description
Retrieves the system information with keys that are specified in an array as a parameter. Following keys are available:
Key NameDescriptionTypeUser AgreementsSupported webOS TV VersionboardTypeBoard type is used to check the chipset. The result string has the following format.
[Chipset]_[DTV Standard]_[Country Code]
Example: "H15_ATSC_US", "M14_ATSC_KR", "LM15U_ATSC_KR"
The following values are available for DTV Standard
ATSC: Advanced Television System Committee
DVB: Digital Video Broadcasting
ARIB: ISDB (Integrated Services Digital Broadcasting) maintained by the Japanese organization ARIB (Association of Radio Industries and Businesses).
Note. This property is not supported in the emulator.StringNot requiredSince webOS TV 2.0firmwareVersionFirmware versionStringRequiredSince webOS TV 1.2modelNameModel name
Example: "LB6700AKR"StringRequiredSince webOS TV 1.2sdkVersionwebOS TV SDK version
Example: "1.3.0", "2.0.0"StringNot requiredSince webOS TV 1.2UHDWhether supports Ultra HD resolution
true: Supports UHD resolution.
false: Not supported.StringNot requiredSince webOS TV 1.2_3dWhether supports 3D video
true: Supports 3D video.
false: Not supported.StringNot requiredSince webOS TV 1.2
Parameters
NameRequiredTypeDescriptionkeysRequiredString arrayAn array of key names for retrieving system information.
Example: ["boardType", "projectName"]subscribeOptionalBooleanFlag that decides whether to subscribe or not. If you enabled the subscription, you will get an event when every system information you specified is changed.
true: Subscribe

false: Do not subscribe. Call the method only once. (Default)
Call returns
NameRequiredTypeDescriptionreturnValueRequiredBooleanFlag that indicates success/failure of the request.
true: Success
false: FailureerrorCodeOptionalStringerrorCode contains the error code if the method fails. The method will return errorCode only if it fails.
See the Error Codes Reference of this method for more details.errorTextOptionalStringerrorText contains the error text if the method fails. The method will return errorText only if it fails.
See the Error Codes Reference of this method for more details.[key name]*OptionalStringIf getSystemInfo method succeeds, the paired key-value that you specified will be returned.
Remarks
If you used a wrong key or error occurs, no result data will be returned for that key.
If you subscribe more than one key, you will receive the result data for whole keys at the first return. After the first return, you will receive the result data for each key when corresponding system information is changed.
Error reference
Error CodeError MessageERROR_06Invalid argumentERROR_10Resource temporarily unavailableERROR_99JSON format error
Example
// One-time call
var request = webOS.service.request(
'luna://com.webos.service.tv.systemproperty',
{
method: 'getSystemInfo',
parameters: {
keys: ['modelName', 'firmwareVersion', 'UHD', 'sdkVersion'],
},
onComplete: function (inResponse) {
var isSucceeded = inResponse.returnValue;

if (isSucceeded) {
console.log('Result: ' + JSON.stringify(inResponse));
// To-Do something
} else {
console.log('Failed to get TV device information');
// To-Do something
return;
}
},
}
);

// Subscription
var subscriptionHandle;

subscriptionHandle = webOS.service.request(
'luna://com.webos.service.tv.systemproperty',
{
method: 'getSystemInfo',
parameters: {
keys: ['modelName', 'firmwareVersion', 'UHD', 'sdkVersion'],
subscribe: true,
},
onComplete: function (inResponse) {
var isSucceeded = inResponse.returnValue;

if (typeof inResponse.subscribed != 'undefined') {
if (!inResponse.subscribed) {
console.log('Failed to subscribe TV device information');
return;
}
}

if (isSucceeded) {
console.log('Result: ' + JSON.stringify(inResponse));
// To-Do something
} else {
console.log('Failed to TV device information');
// To-Do something
return;
}
},
}
);
...
// If you need to unsubscribe the data, use cancel() method as below
subscriptionHandle.cancel();

Return example
// Success return
{
"returnValue" : true,
"modelName" : "WEBOS1",
"firmwareVersion" : "3.00.00",
"UHD":"true",
"sdkVersion":"1.05.00"
}

// Failure return
{
"returnValue" : false,
"errorCode" : "ERROR_06",
"errorText" : "Invalid argument."
}

// Subscription example

// First response
{
"returnValue" : true,
"modelName" : "WEBOS1",
"firmwareVersion" : "3.00.00"
}

// When modelName is changed to "WEBOS2"
{
"returnValue" : true,
"modelName" : "WEBOS2"
}

// When firmwareVersion is changed to "3.02.00"
{
"returnValue": true,
"firmwareVersion" : "3.02.00"
}
See also
None

No Headings