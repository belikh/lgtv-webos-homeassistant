---
title: Audio API Reference Guide | webOS TV Developer
id: audio-api-reference-guide-webos-tv-developer
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:16:54.665596Z'
source: https://webostv.developer.lge.com/develop/references/audio
source_domain: webostv.developer.lge.com
fetched_at: '2026-08-28T02:16:54.108810Z'
fetch_provider: builtin
status: draft
type: note
deprecated: false
summary: Audio API Reference Guide | webOS TV Developer
---

Audio API Reference Guide | webOS TV Developer

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

Audio
Service URI - luna://com.webos.audio
Provides methods for volume control.
The Audio Setting service enables apps to control volume, with the following methods.
Methods
MethodDescriptionSupported in EmulatorsetMutedMutes or unmutes the volume.YesvolumeDownDecreases the volume by 1.YesvolumeUpIncreases the volume by 1.Yes
setMuted
Description
Mutes or unmutes the volume.
Parameters
NameRequiredTypeDescriptionmutedRequiredBooleanThe flag that indicates whether to mute the volume or unmute the volume.
true: mute the volume
false: unmute the volume
Call returns
NameRequiredTypeDescriptionreturnValueRequiredBoolean The flag that indicates the success/failure of the request.
true: Success
false: FailureerrorCodeOptionalNumbererrorCode contains the error code if the method fails. The method returns errorCode only if it fails.
See the Error Codes Reference of this method for more details.errorTextOptionalStringerrorText contains the error text if the method fails. The method returns errorText only if it fails.
See the Error Codes Reference of this method for more details.
Error reference
Error CodeError Message1Not a valid JSON message
Example
// One-time call
var request = webOS.service.request('luna://com.webos.audio', {
method: 'setMuted',
parameters: { muted: true },
onSuccess: function (inResponse) {
console.log('TV is muted');
// To-Do something
},
onFailure: function (inError) {
console.log('Failed to set muted');
console.log('[' + inError.errorCode + ']: ' + inError.errorText);
// To-Do something
return;
},
});
Return example
{
'returnValue': true
}
See also
volumeDown
volumeUp
volumeDown
Description
Decreases the volume by 1.
Parameters
None
Call returns
NameRequiredTypeDescriptionreturnValueRequiredBoolean The flag that indicates the success/failure of the request.
true: Success
false: FailureerrorCodeOptionalNumbererrorCode contains the error code if the method fails. The method returns errorCode only if it fails.
See the Error Codes Reference of this method for more details.errorTextOptionalStringerrorText contains the error text if the method fails. The method returns errorText only if it fails.
See the Error Codes Reference of this method for more details.
Error reference
Error CodeError MessageERROR_3Parameters should be empty
Example
// One-time call
var request = webOS.service.request('luna://com.webos.audio', {
method: 'volumeDown',
onSuccess: function (inResponse) {
console.log('The volume is decreased by 1.');
// To-Do something
},
onFailure: function (inError) {
console.log('Failed to decrease volume by 1.');
console.log('[' + inError.errorCode + ']: ' + inError.errorText);
// To-Do something
return;
}
});
Return example
{
'returnValue': true
}
See also
setMuted
volumeUp
volumeUp
Description
Increases the volume by 1.
Parameters
None
Call returns
NameRequiredTypeDescriptionreturnValueRequiredBoolean The flag that indicates the success/failure of the request.
true: Success
false: FailureerrorCodeOptionalNumbererrorCode contains the error code if the method fails. The method returns errorCode only if it fails.
See the Error Codes Reference of this method for more details.errorTextOptionalStringerrorText contains the error text if the method fails. The method returns errorText only if it fails.
See the Error Codes Reference of this method for more details.
Error reference
Error CodeError MessageERROR_3Parameters should be empty
Example
// One-time call
var request = webOS.service.request('luna://com.webos.audio', {
method: 'volumeUp',
onComplete: function (inResponse) {
console.log('The volume is increased by 1.');
// To-Do something
},
onFailure: function (inError) {
console.log('Failed to increase volume by 1.');
console.log('[' + inError.errorCode + ']: ' + inError.errorText);
// To-Do something
return;
},
});
Return example
{
'returnValue': true
}
See also
setMuted
volumeDown

No Headings