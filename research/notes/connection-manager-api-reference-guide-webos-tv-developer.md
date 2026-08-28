---
title: Connection Manager API Reference Guide | webOS TV Developer
id: connection-manager-api-reference-guide-webos-tv-developer
tags:
- lgtv-webos-ha-root-1a89ff
- locus-transport-discovery-security-pairing-ws-mqtt-hybrid
created: '2026-08-28T02:44:11.468079Z'
source: https://webostv.developer.lge.com/develop/references/connection-manager
source_domain: webostv.developer.lge.com
fetched_at: '2026-08-28T02:44:11.466794Z'
fetch_provider: builtin
status: draft
type: note
tier: unknown
content_type: unknown
deprecated: false
---

Connection Manager API Reference Guide | webOS TV Developer

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

Connection Manager
Service URI - luna://com.palm.connectionmanager
Provides the status of available Internet connections.
Connection manager provides methods for managing Internet connections. It enables apps to get the status of connections.
Methods
MethodDescriptionSupported in EmulatorgetStatusGets the current status of network connections (both WiFi and wired) on the system.Partially
(Only Wired)
getStatus
Description
Gets the current status of network connections (both Wi-Fi and wired) on the system. Apps can subscribe to it so that they are notified whenever the network status changes.
Parameters
NameRequiredTypeDescriptionsubscribeOptionalBooleanFlag that decides whether to subscribe or not.
true: Subscribe.
false: Do not subscribe. Call the method only once. (Default)
Call returns
NameRequiredTypeDescriptionreturnValueRequiredBooleanFlag that indicates success/failure of the request.
true: Success
false: FailureerrorTextOptionalStringerrorText contains the error text if the method fails. The method will return errorText only if it fails. See the Error Codes Reference of this method for more details.subscribedOptionalBooleanFlag that indicates whether the subscription is enabled or not.
true: Enabled
false: Not enabled.isInternetConnectionAvailableRequiredBooleanFlag that indicates whether internet connection is available or not.
true: Any internet connection is available.
false: No internet connections are available.wiredRequiredObjectObject that contains information about the state of the wired connection.wifiRequiredObjectObject that contains information about the state of the Wi-Fi connection.wifiDirectRequiredObjectObject that contains information about the state of the Wi-Fi direct connection.
Subscription Return
NameRequiredTypeDescriptionisInternetConnectionAvailableRequiredBooleanFlag that indicates whether internet connection is available or not.
true: Any internet connection is available.
false: No internet connections are available.wiredRequiredObjectObject that contains information about the state of the wired connection.wifiRequiredObjectObject that contains information about the state of the Wi-Fi connection.wifiDirectRequiredObjectObject that contains information about the state of the Wi-Fi direct connection.

Note
In webOS TV 3.X, the subscription feature of getStatus() is not working correctly. In this case, use the following service URI for subscription: luna://com.webos.service.connectionmanager
Regardless of the webOS TV version, you can easily monitor the network status using the following method in webOSTV.js: connection.getStatus
Error reference
Error MessageError DescriptionConnman manager is not availableTheConnection Manager(connman) process is not running, and the network status is not available at this time.
Example
// One-time call
var request = webOS.service.request('luna://com.palm.connectionmanager', {
method: 'getStatus',
onSuccess: function (inResponse) {
console.log('Result: ' + JSON.stringify(inResponse));
// To-Do something
},
onFailure: function (inError) {
console.log('Failed to get network state');
console.log('[' + inError.errorCode + ']: ' + inError.errorText);
// To-Do something
return;
},
});

// Subscription
var subscriptionHandle;

subscriptionHandle = webOS.service.request(
'luna://com.palm.connectionmanager',
{
method: 'getStatus',
parameters: { subscribe: true },
onSuccess: function (inResponse) {
if (typeof inResponse.subscribed != 'undefined') {
if (!inResponse.subscribed) {
console.log('Failed to subscribe network state');
return;
}
}

console.log('Result: ' + JSON.stringify(inResponse));
// To-Do something
},
onFailure: function (inError) {
console.log('Failed to get network state');
console.log('[' + inError.errorCode + ']: ' + inError.errorText);
// To-Do something
return;
},
}
);
...
// If you need to unsubscribe the data, use cancel() method as below
subscriptionHandle.cancel();

Return example
{
"wired": {
"netmask": "255.255.254.0",
"dns1": "123.456.789.180",
"ipAddress": "123.456.789.12",
"onInternet": "yes",
"method": "manual",
"state": "connected",
"gateway": "123.456.789.1",
"interfaceName": "eth0"
},
"isInternetConnectionAvailable": true,
"wifi": {
"state": "disconnected"
},
"returnValue": true,
"wifiDirect": {
"state": "disconnected"
}
}
See also
None
Object
wired object
The wired object provides details on the status of the wired connections.
Only if the wired connection is available will all the fields of this object contain the relevant information. If the wired connection is not available, the state field of this object will be set to disconnected and is the only value that is returned to the calling app.
{
"state": String,
"interfaceName": String,
"ipAddress": String,
"netmaks": String,
"gateway": String,
"dns1": String,
"dns2": String,
"dns2": String,
"method": String,
"onInternet": String
}
NameRequiredTypeDescriptionstateRequiredStringIf the wired connection is available it will be set to connected. If the wired connection is not available, it will be set to disconnected.interfaceNameOptionalStringName of the wired Interface name in use. For example, ppp0.ipAddressOptionalStringThe IP address associated with the wired connection.netmaskOptionalStringThe netmask value for the wired connection.gatewayOptionalStringThe IP address of the network gateway.dns1OptionalStringPrimary DNS address for the wired connectiondns2OptionalStringSecondary DNS address for the wired connectiondns3OptionalStringTertiary DNS address for the wired connectionmethodOptionalStringIf the IP address was assigned using the manual mode, method will contain Manual.If the IP Address was assigned through DHCP, method will contain dhcp.onInternetOptionalStringThe captive portal technique forces an HTTP client on a network to see a special web page (usually for authentication purposes) before using the Internet normally. Captive portals are used at most Wi-Fi hotspots. TheonInternetwill contain one of the following values:
yes: Indicating the WiFi connection is connected to the Internet.
no: Indicating the WiFi connection is not connected to the Internet.
wifi object
The wifi object provides details on the status of the WiFi connection. Only if the WiFi connection is available all the fields of this object will contain the relevant information. If the WiFi connection is not available, only the state field of this object will be set to disconnected, and is the only value that is returned to the calling app.
{
"state": String,
"interfaceName": String,
"ipAddress": String,
"netmaks": String,
"gateway": String,
"dns1": String,
"dns2": String,
"dns3": String,
"method": String,
"ssid": String,
"isWakeOnWiFiEnabled": String,
"onInternet": String
}
NameRequiredTypeDescriptionstateRequiredStringIf the Wi-Fi connection is available it will be set to connected.If the Wi-Fi connection is not available, it will be set to disconnected .interfaceNameOptionalStringName of the Wi-Fi Interface name in use. For example, eth0.ipAddressOptionalStringThe IP address associated with the Wi-Fi connection.netmaskOptionalStringThe netmask value for the Wi-Fi connection.gatewayOptionalStringThe IP address of the network gateway.dns1OptionalStringPrimary DNS address for the Wi-Fi connectiondns2OptionalStringSecondary DNS address for the Wi-Fi connectiondns3OptionalStringTertiary DNS address for the Wi-Fi connectionmethodOptionalStringIf the IP address was assigned using the manual mode, method will contain Manual. If the IP Address was assigned through DHCP, method will contain dhcp.ssidOptionalStringThe SSID of the connected service (if known).isWakeOnWiFiEnabledOptionalBooleanIf the Wi-Fi interface was set to stay up even when suspended, isWakeOnWiFiEnabled will contain true. If the Wi-Fi interface was not set to stay up when suspended, isWakeOnWiFiEnabled will contain false.onInternetOptionalStringThe captive portal technique forces an HTTP client on a network to see a special web page (usually for authentication purposes) before using the Internet normally. Captive portals are used at most Wi-Fi hotspots. The onInternet will contain one of the following values:
yes: Indicating the Wi-Fi connection is connected to the Internet.
no: Indicating the Wi-Fi connection is not connected to the Internet.
wifiDirect object
The wifidirect object provides details on the status of the Wi-Fi direct connection.Only if the Wi-Fi direct connection is available all the fields of this object will contain the relevant information. If the Wi-Fi direct connection is not available,only the state field of this object will be set to disconnected, and is the only value that is returned to the calling app.
{
"state": String,
"connectedPeers": WifiPeerInfo Object,
"localIp": String,
}
NameRequiredTypeDescriptionstateRequiredStringIf the Wi-Fi connection is available it will be set to connected. If the Wi-Fi connection is not available, it will be set to disconnected.connectedPeersOptionalObject ArrayA list of objects that provides information about connected peers.localIpOptionalStringThe IP address of the local connection endpoint.
WifiPeerInfo object
This object contains information on a peer-to-peer client.
{
"deviceName": String,
"deviceAddress": String,
"groupOwner": Boolean,
"configMethod": Number,
"signalLevel": Number,
"wfdInfo": WifiWfdInfo Object,
"connected": Boolean,
"peerIp": String,
"invited": String,
"serviceDiscoveryResponse": String
}
NameRequiredTypeDescriptiondeviceNameRequiredStringDevice namedeviceAddressOptionalStringDevice addressgroupOwnerRequiredBooleanGroup ownerconfigMethodOptionalNumberConfiguration methodsignalLevelRequiredNumberSignal levelwfdInfoOptionalObjectWFD informationconnectedRequiredBooleanConnection statuspeerIpOptionalStringIPv4 addressinvitedOptionalStringIf the connection is available, this property will be set to true. if the connection is not available, this property will be set to false.serviceDiscoveryResponseOptionalStringService discovery response. Only sent on the first inquiry and never again.
WifiWfdInfo object (Wi-Fi Direct Info object)
This object contains information on the Wi-Fi Direct settings of a Wi-Fi Peer connection. It is used in Wi-Fi Peer Info and is only present when the connection uses Wi-Fi Direct.
{
"wfdCpSupport": Boolean,
"wfdDeviceType": String,
"wfdRtspPort": Number,
"wfdSessionAvail": Boolean,
}
NameRequiredTypeDescriptionwfdCpSupportRequiredBooleanThe flag that indicates whether the Wi-Fi Direct content protection is supported:
true: Supported
false: Not supported.wfdDeviceTypeRequiredStringWi-Fi Direct device type, one of:
source
primary-sink
secondary-sinkwfdRtspPortRequiredNumberControl port forWi-Fi Direct session managementwfdSessionAvailRequiredBooleanThe flag that indicates whether the session is available:
true: Available
false: Not available

No Headings