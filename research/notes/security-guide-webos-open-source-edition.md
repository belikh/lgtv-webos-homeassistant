---
title: Security Guide | webOS Open Source Edition
id: security-guide-webos-open-source-edition
tags:
- lgtv-webos-ha-root-1a89ff
- locus-rooted-acl-boundary-stock-vs-root-luna-matrix
- locus-companion-lifecycle-enact-vs-js-service-vs-systemd-persistence
created: '2026-08-28T02:12:47.925697Z'
updated: '2026-08-28T02:34:42.169477Z'
source: https://www.webosose.org/docs/guides/development/configuration-files/security-guide/
source_domain: www.webosose.org
fetched_at: '2026-08-28T02:12:47.923615Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: docs
deprecated: false
---

Security Guide | webOS Open Source Edition

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

Security Guide
This guide describes the security policy of webOS OSE and how to set it up correctly.
Overview
First you need to know about webOS OSE’s communication system, Luna Bus.
Luna Bus
Luna Bus, also called LS2, is the bus communication system of webOS OSE platform. Processes running on the platform communicate with each other through Luna Bus.

Note

If you already familiar with the following concepts, you can skip this section and go to Security Policy of webOS OSE.
Luna Bus
Service provider and client
The following figure shows the basic concept of Luna Bus. Processes (such as web apps, QML apps, and JavaScript services) send messages to Luna Bus, then Luna Bus forwards these messages to the target recipient.
Components can be classified into service provider and service client:
Service provider: A process that is registered to Luna Bus system. This process provides methods for other processes.
Service client: A process that implements functions using service provider’s methods.
Communication between processes is established using LS2 API. LS2 API is an interface to access webOS system services via Luna Bus. Using LS2 API, each process can access any other processes registered on Luna Bus. To prevent unauthorized access, LS2 API introduces Access Control Group (ACG) and Trust Level.
Security Policy of webOS OSE
A security policy of webOS OSE consists of two values: ACG and Trust Level.
Service providers and clients have their own ACG and Trust Level values. When a client sends a request to a provider, Luna Bus examines the values of both the provider and the client. If the client’s ACG or Trust Level values don’t match with the provider’s values, Luna Bus rejects the request.
The following figure shows this process.
In the above figure, the client has acg_a for ACG and trust_level_a for its Trust Level.
Let’s suppose that the client sends a request for calling Method A. Method A belongs to acg_a, and acg_a belongs to trust_level_a. So Method A’s values are as follows:
ACG: acg_a
Trust Level: trust_level_a
Which match with those of the client. So the client can call Method A.
But in the case of Method B, the Trust Level is trust_level_a, but the ACG value is acg_b. So the client cannot to call Method B.
Trust Levels
Trust Level defines an access level of each ACG. Below are the trust levels supported in webOS OSE:
dev: APIs belonging to this trust level can be accessed by all trust levels.
part: APIs belonging to this trust level can be accessed by part and oem.
oem: APIs belonging to this trust level can only be accessed by oem.
The following table summarizes this access limitation.Trust level of your serviceAccess to dev APIsAccess to part APIsAccess to oem APIsdevAllowedNot AllowedNot AllowedpartAllowedAllowedNot AllowedoemAllowedAllowedAllowed
Suppose your service has dev trust level (the trustLevel attribute of the role file is set to dev). Your service cannot access APIs of other services belonging to the part or oem group.
How to Set Up
The following table shows the files related to ACG and trust level.

Type
For ACG
For Trust Level
App
Set up the requiredPermissions property in appinfo.json.
No need to set up. Trust level is set to OEM automatically.
Downloadable Service
Set up the requiredPermissions property in appinfo.json of the app packaged with the downloadable service.
Built-in Service
Set up Configuration files.
For Apps and Downloadable Services
If you develop apps or downloadable services, all you need to do is set up the appinfo.json file.
Make a list of services — which can be LS2 APIs or custom services.
Find ACG values for each service. See Appendix. How to Find ACG Values of APIs.
Add the ACG values to the requiredPermissions property in appinfo.json. In case of downloadable services, use the appinfo.json file of the app packaged together with the service.
Then app installer service automatically generates the configuration files during installation of your app or service.
The following example shows how to set up an ACG value at the appinfo.json file. This app can access to services whose ACG value is acg3.
Sample appinfo.json
{
"id":"com.webos.exampleapp",

...

"requiredPermissions":[
"acg3"
]
}

For Built-In Services
If you develop built-in services, you need to set up your own configuration files. A list of required files can vary depending on the service you want to develop.
For service provider
Role file
API permission file
Groups file
Service file
For service client
Client permission file
For more details on how to set up each file, see to Configuration Files.

Note
See also, LS2 Configuration Files for native services and LS2 Configuration Files for JS services
Configuration Files
Components of webOS OSE need a certain types of files to operate properly on the Luna Bus. These files are called LS2 configuration files.
The following table shows the types of configuration files and :Configuration FileStored DirectoryRole file/var/luna-service2/roles.d/Service file/var/luna-service2/services.d/API permission file/var/luna-service2/api-permissions.d/Client permission file/var/luna-service2/client-permissions.d/Groups file/var/luna-service2/groups.d/

Note
If you install components in the developer mode, stored directories will be changed like /var/luna-service2-dev/~.
Role File
Naming convention: <service-name>.role.json.in
If a component (either a service client or a service provider) wants to register itself to Luna Bus, the component must provide its logical name to the Luna Bus system. The role file contains this logical name and information about permissions. Luna Bus determines whether to accept or deny the registration request based on the information given in the role file.
A role file has the following attributes:AttributeDescriptionexeNameAbsolute path of the binary executable for the component. Script-based components such as JS services, web apps, and QML apps, do not have a unique executable name. Such components use appId instead of exeName.typeService type (regular / privileged / devmode). Only privileged services are allowed to change ID during execution.trustLevelTrust level of the service.allowedNamesNames to register to Luna Bus. It can be an array of any valid service name strings.permissions
List of inbound and outbound policies for the specified service name. Different permissions can be assigned to different service names.
service: The name of the service this policy applies to. This service name should be one of the service names listed allowedNames.
inbound: List of services that service is allowed to receive requests from.
outbound: List of services that service is allowed to send requests to.
Note that inbound and outbound list can include strings of any valid service names. Use * for all, empty array [] for none. It is possible to use a wildcard (*) at the end of a string.
The following code shows an example of role file:
com.example.service.native.role.json.in
{
"exeName": "/usr/bin/com.example.service.native",
"type": "regular",
"trustLevel": "dev",
"allowedNames": [
"com.example.service.native"
],
"permissions": [
{
"service": "com.example.service.native",
"inbound": ["*"],
"outbound": ["*"]
}
]
}

The following code shows an example of role file for script-based components:
An example role file for script-based components
{
"appId": "com.webos.app.enactbrowser",
"type": "privileged",
"trustLevel" : "oem",
"allowedNames": [
"com.webos.app.enactbrowser-*"
],
"permissions": [
{
"service": "com.webos.app.enactbrowser-*",
"outbound": [
"*"
]
}
]
}

If you need to register a component during runtime, use the ls-control command to send the request to the Luna Bus system to update its policy.
$ ls-control scan-services

You can use ls-control to inform the hub to rescan directories only when the component was installed by using the opkg command.
API Permission File
naming convention: <service-name>.api.json
This file defines ACG values for each methods in the service. Every LS2 API mehods has an ACG value. Typically, the same ACG value is given to the methods with similar functionality.
The following example shows how to define ACG values for multiple methods of the com.example.service.native service:
com.example.service.native.api.json
{
"exampleservice.acgvalue1": [
"com.example.service.native/hello",
"com.example.service.native/greetings",
],
"exampleservice.acgvalue2": [
"com.example.service.native/goodbye",
"com.example.service.native/seeyou",
],
...
}

Note
One method can belong to multiple ACGs. Conversely, one ACG can contain multiple methods.
If a client wants to call the com.example.service.native/hello method, the client must contain exampleservice.acgvalue1 in its ACG values.
Groups File
Naming convention: <service-name>.groups.json
This file defines the trust levels of each ACG value. The following example shows an example group file.
com.example.service.native.group.json
{
"allowedNames": [ "com.example.service.native" ],
"exampleservice.acgvalue1": [ "dev" ],
"exampleservice.acgvalue2": [ "oem" ]
}

In the above example, a trust level, dev, is assigned to the ACG value, exampleservice.acgvalue1. So the APIs in exampleservice.acgvalue1 have the dev trust level.
Service File
Naming convention: <service-name>.service
A service file, also called a service configuration file, contains descriptions of the service type and launch command.

Note
Only service provider needs this file. Clients don’t need the service file.
webOS OSE has two service types: static and dynamic.

Static service
Most static services are launched at boot time by systemd — the init process.
If the service crashes, Luna Bus will store current requests to the service and deliver them to the service after it has restarted (assuming it is re-spawned by systemd).
The static service always runs in the background. So if your service doesn’t need to be run all time, the dynamic service might be a solution to save system resources.

Dynamic service
Dynamic services are launched on demand. For example, if you create a dynamic service, it will be launched when someone attempts to send a request to the service. This “lazy launching” makes only necessary services are launched at boot time, and this leads to shorter booting time.
If a dynamic service doesn’t work for a certain period of time, webOS OSE system shuts down the service automatically.
A service file has the following attributes:AttributeDescriptionNameService nameExecExecutable path for serviceTypeType of service
The following code shows an example service file:
com.example.service.native.service[D-BUS Service]
Name=com.example.service.native
Exec=@WEBOS_INSTALL_SBINDIR@/com.example.service.native
Type=static

Client Permission File
Naming convention: <service-name>.perm.json
All clients (services and applications that use other services) must have a client permission file. You have to check what ACG values are needed and add them to the client permission file. This process is very similar to setting up requiredPermissions in appinfo.json.
Suppose that you want to use the launch method of com.webos.service.applicationmanager.

Check the ACG value of the method — applications.launch.

Add it to the client permission file.
com.example.service.perm.json
{
"com.webos.service.applicationmanager": [
"applications.launch"
]
}

Appendix. How to Find ACG Values of APIs
The easiest way to find the ACG value is to check LS2 API Reference documents.
Every method in the API reference shows its own ACG value. For example, an ACG value for the createToast method is notification.opration as shown in the below figure.
An ACG value for the createToast method
The other way is to use the ls-monitor -i command.
root@raspberrypi4-64:/# ls-monitor -i com.webos.notification | grep "createToast"
"createToast": {"provides":["all","notification.operation"]}

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 and sample code is licensed under the Apache License 2.0.

Contents