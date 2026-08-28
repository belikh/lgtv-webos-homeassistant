---
title: com.webos.service.config | webOS Open Source Edition
id: comwebosserviceconfig-webos-open-source-edition
tags:
- lgtv-webos-ha-root-1a89ff
- locus-rooted-acl-boundary-stock-vs-root-luna-matrix
created: '2026-08-28T02:27:16.882517Z'
source: https://www.webosose.org/docs/reference/ls2-api/com-webos-service-config/
source_domain: www.webosose.org
fetched_at: '2026-08-28T02:27:16.880871Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: docs
deprecated: false
---

com.webos.service.config | webOS Open Source Edition

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

com.webos.service.config

Note
This API has been supported since API level 11.
API Summary

A static service in the system that provides product specific configurations to webOS components.
This service provides simple get/set interfaces to access the configurations.
[Terminology]
config : It consists of 'key' and 'value'. Following is an example of config.
{ 'language' : 'KOR' } // configName is 'language'. configValue is 'KOR'
configs & configs.json : 'configs' is a set of configs. We called a file which describes the set as 'configs.json'. Normally, the file name is url name
com.webos.service.surfacemanager.json : configs.json file for lsm(luna surface manager)
layer & selector & selection : 'layer' is a set of 'configs.json' files. It means layer is same with directory.
basedir in layer :It is a parent dir of others. Basically directories could be there.
selection in layer :It is leaf dir name. All 'configs.json' files should be in 'basedir' + 'selection'. If the layer type is "none" and there is no selection, configs.json files would be in basedir.
selector in layer : It is a method to get right selection. There are many types of selector in configd.
configuration & reconfiguration
configuration is a set of layer. Actually, higher layer can overwrite lower layer's configs.
reconfiguration is a process to make configuration again. If selector can be changed, reconfiguration process is needed. Please refer below sections for more information.
Overview of the API

Between webOS platform being built and its reaching the customer, it goes through various configs. For example, configs based on country, provider, language and etc. Making and maintaining separate builds for each of the variants is not practical.
At the moment, there are various non-uniform ways to customize the behavior of various components. Some depend on json config files stored on the root file system and some depend on the file system flags. Such disparity makes it impossible to provide the mechanism or tools to customize the product as a whole.
By specifying a common way to represent various flags and features, config service can provide a streamlined mechanism to our customers to customize the product.
[config & configs.json]
config name : Configd sets config name as CONFIGS_JSON_FILENAME.NAME.
If there is a key-value like "compositorGeometry": "1920x1080+0+0r0" in com.webos.surfacemanager.json
User can get configs as "com.webos.surfacemanager.compositorGeometry" or "com.webos.surfacemanager.*".
As config name contains file name, key should be added in related feature file, and it is recommended that users add feature file same as service name.
configs.json file structure : Both types of structures are supported for webOS
Just define key:value pair

com.webos.surfacemanager.json
{
"compositorGeometry": "1920x1080+0+0r0"
}
Define under "configs" category as array

{
"configs" : [
{
"data": {
"compositorGeometry" : "1920x1080+0+0r0"
}
}
]
}
[Restriction of getConfig values]
ACG is enabled on Configd and registered services can get configs via private or public bus. But for some cases, configs should be opened for only privileged services. To support this feature, configd allows to define permission by describing service name as array type at feature.json.
To define permission, config values should be described as new format of feature.json like explained above. Permission field would be fetched same way as configs are fetched, and it means that permission would be replaced while fetching upper layers' feature.json.
Configd checks if requester is in the permitted service list, before returning getConfig and configd support servicename ended with asterisk.
Below example shows that only app3, app4 can get com.webos.component1.fileKey1, com.webos.component1.multiLayerKey.

#cat com.webos.component1.json
{
"configs": {
"data": {
"fileKey1": true,
"multiLayerKey": true
},
"permissions": {
"read": [
"app3",
"app4"
]
}
}
}
Methods

dump

ACG: systemconfig.devutility
Retired

Added: API level 27
Deprecated: API level 27
Retired: API level 28
Description
It is useful for debugging. It returns the list of all configs and current values.
Parameters
None
Call Returns

Name
Required
Type
DescriptionconfigsRequiredObject
Lists all configs and current values as a JSON objectreturnValueRequiredBoolean
Indicates whether the execution succeeded.
true: Success
false: FailureerrorCodeOptionalNumber (int32_t)
Identifies the error. The method will return errorCode only if it fails. See the Error Codes Reference for more details.errorTextOptionalString
Describes the error. The method will return errorText only if it fails and errorCode is -1. See the Error Codes Reference for more details.
Examples

Example code

# luna-send -f -n 1 luna://com.webos.service.config/dump '{}'
{
"configs": {
"system": {
"country": "KR7",
"smartServiceCountry": "KR7",
"enable_smart_service": true
},
"com.webos.service.config": {
"selection": {
"smartservicecountry": "KR7",
"devicename": "m14tv",
"country": "KR7",
"buildtype": "DV",
"displaytype": "OTHERS"
}
}
},
"returnValue": true
}
fullDump

ACG: systemconfig.devutility
Retired

Added: API level 27
Deprecated: API level 27
Retired: API level 28
Description
It is useful for debugging. It returns the list of all configs including overridden values from all layers.
Parameters
None
Call Returns

Name
Required
Type
DescriptionconfigsRequiredObject array
Array of JSON objects with configName and valuereturnValueRequiredBoolean
Indicates whether the execution succeeded.
true: Success
false: Failure
Examples

Example code

# luna-send -f -n 1 luna://com.webos.service.config/fullDump '{}'
{
"configs": [
{
"/etc/configd-service/layers/base": {
"system": {
"country": "Others",
"smartServiceCountry": "Others",
"enable_smart_service": false
},
"com.webos.surfacemanager": {
"volumeOSD": true
},
"com.webos.service.applicationmanager": {
"applications_smartservice": [
"com.webos.app.discovery",
"youtube.leanback.v4"
],
"applications_broadcast": [
"com.webos.app.livetv",
"com.webos.app.livemenuplayer",
"com.webos.app.browser",
"com.webos.app.tvuserguide",
"com.webos.app.smartshare",
"com.webos.app.connectionwizard",
"com.webos.app.miracast",
"com.webos.app.capturetv",
"com.webos.app.camera",
"com.webos.app.notificationcenter"
],
"applications": [
],
"applications_exclude": [
"com.webos.app.egallery"
]
}
}
},
{
"/etc/configd-service/layers/country/KOR": {
"system": {
"country": "KOR"
},
"com.webos.service.applicationmanager": {
"applications_broadcast": [
"com.webos.app.livetv",
"com.webos.app.livemenuplayer",
"com.webos.app.browser",
"com.webos.app.tvuserguide",
"com.webos.app.connectionwizard",
"com.webos.app.egallery",
"com.webos.app.smartshare",
"com.webos.app.scheduler",
"com.webos.app.miracast",
"com.webos.app.tvguide",
"com.webos.app.capturetv",
"com.webos.app.camera",
"com.webos.app.discovery",
"com.webos.app.notificationcenter"
]
}
}
},
{
"/etc/configd-service/layers/smartservicecountry/KOR": {
"system": {
"smartServiceCountry": "KOR"
},
"com.webos.service.applicationmanager": {
"applications_smartservice": [
"com.webos.app.today",
"pooq",
"cj.eandm",
"ocncatchon",
"cine21",
"bugs",
"youtube.leanback.v4"
]
}
}
},
{
"/etc/configd-service/layers/displaytype/OTHERS": {
"com.webos.service.applicationmanager": {
"applications_exclude": [
"com.webos.app.egallery"
]
}
}
},
{
"/etc/configd-service/layers/buildtype/PV": {
"com.webos.service.applicationmanager": {
"applications_append": [
"com.lge.app.viewster",
"com.palm.app.bugreport",
"com.palm.app.enyo2sampler",
"com.webos.app.erossampler"
]
}
}
},
{
"/etc/configd-service/layers/devicename/m14tv": {
"com.webos.service.applicationmanager": {
}
}
}
],
"returnValue": true
}
getConfigs

ACG: systemconfig.query

Added: API level 11
Description
It returns the requested configs which is the pairs of key-value as a JSON object and also supports a subscription.
configd provides asterisk but configNames should starts feature file name. For example, to get all configs for com.webos.surfacemanager, configNames should be "com.webos.surfacemanager.*". Note that "com.webos.*" or "com.webos.surfacemanager*" is not supported.
If subscribe is true and multiple configs are requested, configd only returns changed config. ( from the second return)
(But missingConfigs would be returned everytime even missingConfigs is not changed)
If a config is limited for defined services, only permitted services can get Configs, if the requester doesn't  have rights, the configd would be in missingConfigs
Parameters

Name
Required
Type
DescriptionconfigNamesRequiredString array
Passes the requested configNames by the client. Can be a single config or multiple names.
Syntax:
"configNames": ["com.webos.surfacemanager.*"]
Ex:
1.com.webos.surfacemanager.compositorGeometry (return the requested value)
2. "com.webos.surfacemanager.*".* (All the pairs of "key:value" in com.webos.surfacemanager component)subscribeOptionalBoolean
Subscribe for notifications . Possible values are:
true - Receives notifications when the database changes.
false - Notifications are not received.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates whether the execution succeeded.
true: Success
false: FailureconfigsOptionalObject
Returns the pairs of current "key:value" for the requested component.
Ex:
1. input for configNames:["com.webos.surfacemanager.compositorGeometry"] - returns all the key:value pairs under "compositorGeometry" category
2. input for configNames:["com.webos.surfacemanager.*"] - returns the JSON object containing the pairs of "key:value" for the lsm componentmissingConfigsOptionalString array
Returns a string array of configs which is not found in the database when returnValue is true.
If a permission is defined at feature.json and requester has no permission to read it, the config key would be shown at missingConfigssubscribedRequiredBoolean
Indicates whether the subscription request succeedederrorCodeOptionalNumber (int32_t)
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation and errorCode is -1. See the " API Error Codes Reference"  for more details.
Subscription Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates whether the execution succeeded.
true: Success
false: FailureconfigsOptionalObject
See 'RETURN' value sectionmissingConfigsOptionalString array
See 'RETURN' value section
Examples

Example code

# luna-send -f -i luna://com.webos.service.config/getConfigs '{"configNames ":["com.webos.surfacemanager.compositorGeometry"]}'
Response:
{
"subscribed": false,
"configs": {
"com.webos.surfacemanager.compositorGeometry": "1920x1080+0+0r0"
},
"returnValue": true
}

# luna-send -f -i luna://com.webos.service.config/getConfigs '{
"configNames":["com.webos.test.missingConfigs", "com.webos.surfacemanager.missingForegroundApp"]}'
Response:
{
"missingConfigs": [
"com.webos.test.missingConfigs",
"com.webos.surfacemanager.missingForegroundApp"
],
"subscribed": false,
"returnValue": true
}
reconfigure

ACG: systemconfig.management

Added: API level 11
Description
Configd parses all configuration files again and regenerates the values of configs.
Parameters
None
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates whether the execution succeeded.
true: Success
false: FailureerrorCodeOptionalNumber (int32_t)
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the " API Error Codes Reference"  for more details.
Examples

Example code

# luna-send -n 1 luna://com.webos.service.config/reconfigure '{}'
reloadConfigs

ACG: systemconfig.devutility
Retired

Added: API level 27
Deprecated: API level 27
Retired: API level 28
Description
Configd load configd db files. This load previous config values including user defined configs(by calling setConfigs)
Parameters
None
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredString
Indicates whether the execution succeeded.
true: Success
false: Failure
Examples

Example code

# luna-send -f -n 10 luna://com.webos.service.config/reloadConfigs '{}'
{
"returnValue": true
}
setConfigs

ACG: systemconfig.management

Added: API level 11
Description
Overrides current settings of the configs.
The overridden values will be kept until rebooting or returning back in any future queries for the config. It is useful for changing configuration in factory test process.
User can set multiple configurations at once.
Parameters

Name
Required
Type
DescriptionconfigsRequiredObject: configs
JSON value with configd key full name and value pair.
Call Returns

Name
Required
Type
DescriptionreturnValueRequiredBoolean
Indicates whether the execution succeeded.
true: Success
false: FailureerrorCodeOptionalNumber (int32_t)
The error code for the failed operation.errorTextOptionalString
Indicates the reason for the failure of the operation. See the "API Error Codes Reference" section for details.
Examples

Example code

// Single config
# luna-send -n 1 -f luna://com.webos.service.config/setConfigs '{ "configs": {"com.webos.surfacemanager.testSetConfigs": true}}'
Response:
{
"returnValue": true
}

// Multiple configs
# luna-send -n 1 -f luna://com.webos.service.config/setConfigs '{
"configs": {
"com.webos.surfacemanager.testSetConfigs": true,
"com.webos.surfacemanager.testSetConfigsArray": ["com.webos.app.test1", "com.webos.app.test2"]}}'
Response:
{
"returnValue": true
}
Objects

configs

Added: API level 29
Description
It contains full name of config and value pair.
For example,

"configs": {
"com.webos.service.applicationmanager.testKey": "added"
}
Properties
None
API Error Codes Reference

Error Code
Error Text
Error Description-5Response error
Make-up response payload error-4Json parsing error
Json parsing error-3Invalid main database error
Main Database is invalid-2Invalid parameter error
Invalid Parameter Error-1\Unknown error
Unknown Error

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 and sample code is licensed under the Apache License 2.0.

Contents