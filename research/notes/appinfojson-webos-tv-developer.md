---
title: appinfo.json | webOS TV Developer
id: appinfojson-webos-tv-developer
tags:
- lgtv-webos-ha-root-1a89ff
- locus-companion-lifecycle-enact-vs-js-service-vs-systemd-persistence
- locus-credentialless-root-detection-and-consented-ipk-orchestration
created: '2026-08-28T02:33:25.669809Z'
updated: '2026-08-28T02:40:08.542844Z'
source: https://webostv.developer.lge.com/develop/references/appinfo-json
source_domain: webostv.developer.lge.com
fetched_at: '2026-08-28T02:33:25.668201Z'
fetch_provider: builtin
status: draft
type: note
tier: unknown
content_type: unknown
deprecated: false
---

appinfo.json | webOS TV Developer

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

appinfo.json

The webOS TV Platform uses app metadata to identify an app and acquire other information required to install and run the app. So, before packaging your app, you must write metadata of the app in a file called appinfo.json. The appinfo.json file is located in your app's root directory and contains a single JSON object.

Tip: JSON syntax
Here are a few tips that might help you with JSON syntax.

Do not include any comments (`/*` or `//`).

Use double quotes, not single quotes, around properties.

appinfo.json reference
The properties consist of mandatory properties and optional properties. The following properties listed below are especially required for submitting your app to LG Apps. Make sure you specify these properties properly.

id

title

type

main

icon

version
The following example shows the appinfo.json file that consists of the various properties.
{
"id": "com.mycompany.app.appname",
"title": "AppName",
"main": "index.html",
"icon": "AppName_80x80.png",
"largeIcon": "AppName_130x130.png",
"type": "web",
"vendor": "My Company",
"version": "1.0.0",
"appDescription": "This's an app tagline",
"resolution": "1920x1080",
"bgColor": "red",
"iconColor": "red",
"bgImage": "AppName_Preview.png",
"closeOnRotation": false
"disableBackHistoryAPI": false,
"handlesRelaunch": false,
"splashBackground": "AppName_Splash.png",
"splashColor": "#111111",
"splashFitModeOnPortrait": "width",
"requiredMemory": 20,
"supportPortraitMode": true,
"supportTouchMode": "virtual",
"transparent": false,
"virtualTouch": {
"verticalThreshold": 20,
"horizontalThreshold": 50,
"positionEventOnPress": true,
"shortTouchThreshold": 30
},
"accessibility": {
"supportsAudioGuidance": true
}
"screenSaverProperties": {
"preferredType": 3
},
"useGalleryMode": true
}
icon
This property is mandatory and the String type. Specify the small icon file of your app, 80x80 pixels in PNG format. The file path must be relative to the appinfo.json file. This icon file is required for app submission and used for app testing only. In LG Apps, another icon file of 400x400 pixels that you upload separately at LG Seller Lounge is used, instead of this icon, after being auto-resized.
id
This property is mandatory and the String type. Specify your app ID. For example, `com.newcompany.app.myapp`. Every app MUST have a unique ID, formed according to the reverse DNS naming conventions. The Launcher uses this ID to identify your app and displays it with the title. The app ID cannot be changed once the app is published.

Must create an ID only with lowercase letters (a-z), digits (0-9), minus signs, and periods. It must start with an alphanumeric character and be at least two characters long.

Caution
If you are to add JS services into your app, do not include minus signs (-) or .(period)+number (for example, `abc-1.0`) in your app ID, because Luna Service does not allow them in a JS service name and the service name must begin with the app ID.

Must not start with the following reserved domain names:`com.palm`, `com.webos`, `com.lge`, `com.palmdts`

Start the ID with a reverse domain of the company/institution. (Recommended)

Finish the ID with the subdomain `app.app-name`. (Recommended)
largeIcon
This property is optional and the String type. Specify your large icon file of your app, 130x130 pixels in PNG format. The file path must be relative to the appinfo.json file. This large icon file is required for app submission and used for app testing only. In LG Apps, another icon file of 400x400 pixels that you upload separately at LG Seller Lounge is used, instead of this large icon, after being auto-resized.
main
This property is mandatory and the String type. Specify the launch point for your app. The file path must be relative to the appinfo.json file and needs to point to an HTML file. The default is `index.html`.
title
This property is mandatory and the String type. Specify the app title to be shown on the Launcher and the app window.

Tip: HTML <title> element
You can use the HTML <title> element for a subtitle in your app. The app version or vendor name is recommended for the subtitle.
type
This property is mandatory and the String type. Specify your app type. Only `web` is allowed currently.
vendor
This property is optional and the String type. Specify your app owner to be used in the launcher and deviceinfo dialogs.
version
This property is mandatory and the String type. Specify your app version number, comprised of three non-negative integers separated by period. The default value is `1.0.0`.

DO NOT contain leading zeroes. Example: `2.1.0` (not `002.1.0`)

The major, minor, and revision numbers are all mandatory; if any is missing, the app may not be installed. Example: `2.1.0` (not `2.1`)

Each number can have up to nine digits. In other words, the maximum version possible is `999999999.999999999.999999999`.

The major, minor, and revision numbers are discrete. For example,`1.5.3` is a lower version than `1.15.3`.

Once you upload a certain version of your app on LG Apps, you cannot upload the same version again. To upload the app, you must increase the version number.
appDescription
This property is optional and the String type. Specify brief information about your app. Think of this as a short tagline for the app. It cannot exceed 60 characters.
bgColor
This property is optional and the String type. This property is available only in webOS TV 1.x and 2.x. In later versions, this property is ignored. Specify the background color of your app to be displayed on the Launcher. This property is used if the `bgImage` is not provided or unavailable. You can specify the color in a hex value or with an HTML color name. For example, "bgColor":"#5e70a2", "bgColor":"#ffffff".
bgImage
This property is optional and the String type. This property is available only in webOS TV 1.x and 2.x. In later versions, this property is ignored. Specify the background image of your app to be displayed when activated on the Launcher. The image must be in PNG format, and the image size must be 1920 x 1080 pixels. The file path must be relative to the appinfo.json file. For example, image/myappbgimage.png.
closeOnRotation
This property is optional and the Boolean type. Set whether to close your app when the screen is rotated vertically. This property is applied to the StanbyME model only.

false (default) – Your app runs regardless of whether the screen is rotated.

true - Your app is closed with a notice when the screen is rotated vertically.
cloudgame_active
This property is optional and the Boolean type. Indicate whether the gaming pad HID device is supported by the app.

false (default) – Your app never reads input events directly from the gamepad device. When a user controls a gamepad device that is linked to a TV, the webOS platform provides the relevant keyboard events to the apps. It is not necessary for your app to check whether the gamepad device is connected.

true - Your app needs to directly handle input events from the gamepad device. Not every event from a gamepad device is handled by the webOS platform.

Note
This property is supported on webOS TV 23 and webOS TV 24 if they are updated to the latest.
disableBackHistoryAPI
This property is optional and the Boolean type. Set whether your app receives the back button event when the back button is pressed on Magic Remote. For more information about this property, see Back Button.

false (default) - Your app does not receive the back button event. Instead, the webOS TV Platform manages the history using standard HTML history API such as `history.pushState(),history.back()`, and `popState` event.

true - Your app receives the back button event. You should implement how to process the back button event in your app.
enablePigScreenSaver
This property is optional and the Boolean type. Set whether to launch PIG Screensaver while video is being played not in full screen.

true (default) - PIG Screensaver will be launched if the video is being played not in full screen.

false - Full Screensaver will be launched even if the video is being played not in full screen.

Note
PIG Screensaver is the screensaver that appears while the video is being played not in full screen in the area where the video is not being played. It is applied by default on webOS TV 3.0 or higher.
handlesRelaunch
This property is optional and the Boolean type. Set whether your app handles the `webOSRelaunch` event.
When your app is re-launched, a `webOSRelaunch` event occurs, and the webOS TV Platform passes the `webOSRelaunch` event to your app. Then, depending on the value of this `handlesRelaunch` property, your app either handles the event on its own or not.

false (default) - Your app does not handle the `webOSRelaunch` event. The webOS TV Platform automatically displays your app in the full-screen mode.

true - Your app handles the `webOSRelaunch` event in the background for a while and then, comes to the foreground by calling the `PalmSystem.activate()` method. See App Lifecycle for more details.
iconColor
This property is optional and the String type. Specify the background color for your app tile. The default value is `white`.
requiredMemory
This property is optional and the Number type. Set the minimum amount of memory in megabytes required to run your app. This value does not need to be the same as the maximum memory usage consumed by your app.
resolution
This property is optional and the String type. Specify the screen resolution for graphics display of your app. webOS TV does not support UHD resolution for web apps. Supported resolutions are as follows:

"1920x1080" (default) - FHD resolution

"1280x720" - HD resolution
To get the app resolution for graphics display, use `window.innerWidth` and `window.innerHeight` properties.
screenSaverProperties
This property is optional. Add this property to use the Type 2 or Type 3 screensaver, which lowers the brightness gradually and extend the screensaver timeout. For how to determine which type to use, see  How to Determine Which Type to Use.
screenSaverProperties object
preferredType
This property is optional and the Number type.

"2" - The screensaver timeout is extended to 30 minutes, and the brightness of the on-screen display (OSD) area decreases gradually. For more details, see  Type 2 Screensaver.

"3" - The screensaver timeout is extended to 30 minutes. If you are to use this Type 3 screensaver, you MUST set `useGallerymode` to `true` as well. For more details, see  Type 3 Screensaver.
splashBackground
This property is optional and the String type. Specify the background image to be displayed while your app is being loaded. The path must be relative to the appinfo.json file. The image file must have 1920 x 1080 resolution in PNG format.
splashColor
This property is optional and the String type. This property is applied to the StanbyME model only. Specify the background color (RGB) of the splash image. The default value is `gray`.
You can set the color by specifying a hexadecimal (hex) value or an HTML color name. For example, the following values are acceptable:`#000000` and `black`.
splashFitModeOnPortrait
This property is optional and the String type. This property is applied to the StanbyME model only. Specify the fit mode for the splash image in portrait mode. It works only if your app supports portrait mode.

“none” (default) - The splash image is displayed in its original size.

“width” - The splash image is resized to fit the width of the screen.
supportPortraitMode
This property is optional and the String type. This property is applied to the StanbyME model only. Specify whether your app supports portrait mode.

"false" (default) - Your app does not support portrait mode.

"true" – Your app supports portrait mode. The splash image is displayed with the background color set by the `splashColor` property.
supportTouchMode
This property is optional and the String type. This property is applied to the StanbyME model only. Specify how to handle touch events.

“none” (default) – Your app does not handle touch inputs.

“full” - Your app handles touch input. You can implement event handlers for touch inputs using the standard web API.

“virtual” - If a touch event occurs, the webOS TV Platform sends it to your app as a keyboard or mouse event.
transparent
This property is optional and the Boolean type. Set the transparency of your app's background. If you do not set the background color or background image, the system background, which is black, is displayed.

false (default) - The transparency rate of the app background is decreased and the system background is shown as a little grey color.

true - The system background is displayed clearly.
useGalleryMode

Caution
If you set  screenSaverProperties object,  preferredType, to 3, this property MUST be set to true.
This property is optional and the Boolean type. Set whether to change the picture setting to the Gallery mode. For gallery-type apps, set this property to `true`.
virtualTouch
This property is optional and the `virtualTouch` object type. This property is applied only when the `supportTouchMode` property is set to `virtual` in the StanbyME model. Set detail values for touch inputs. The object consists of values for the detail thresholds of converting touch inputs into keyboard or mouse events.
virtualTouch object
verticalThreshold
This property is optional and the Number type. You can set the threshold (10-100 px) that triggers an event for touch and drag in the vertical direction.
If a user touches the screen and moves over the threshold value, it is considered a drag operation, and a key event occurs. This is, if you set the threshold value small, a key event in the vertical direction (up, down) occurs even with a short swipe. Therefore, the smaller you set the threshold, the more key events occur when a user swipes the screen at the same length.

The default value is 40.

When smaller than 10, it is set to 10.

When bigger than 100, it is set to 100.
horizontalThreshold
This property is optional and the Number type. You can set the threshold (10-100 px) that triggers an event for touch and drag in the horizontal direction.
If a user touches the screen and moves over the threshold value, it is considered a drag operation, and a key event occurs. This is, if you set the threshold value small, a key event in the horizontal direction (left, right) occurs even with a short swipe. Therefore, the smaller you set the threshold, the more key events occur when a user swipes the screen at the same length.

The default value is 40.

When smaller than 10, it is set to 10.

When bigger than 100, it is set to 100.
positionEventOnPress
This property is optional and the Boolean type. You can set whether to send a touch press (shorter than 200ms) event as a mouse position event.

false (default) - A touch press event is not sent to your app, but a touch release event is sent to your app as a key or mouse event.

true - A touch press event is sent to your app as a mouse position event, and a touch release event is sent to your app as a key or mouse event.
shortTouchThreshold
This property is optional and the Number type. You can set the click threshold (10-50 px) to be recognized as short touch (like a click).
It is considered a click if a dragging distance is less than the shortTouchThreshold value. Swiping more than the shortTouchThreshold value will not send a click event to your app.

The default value is 10.

When smaller than 10, it is set to 10.

When bigger than 50, it is set to 50.
accessibility
This property is optional and the `accessibility` object type. This object is for supporting accessibility functions.
accessibility object
supportsAudioGuidance
This property is optional and the Boolean type. You can set whether to support audio guidance in your app.

false (default) - Your app does not support audio guidance.

true - Your app supports audio guidance.

Note
To support audio guidance, your app should use ARIA tag. It is supported on webOS TV 3.0 or higher but not fully supported on webOS TV 3.x. For more information about ARIA, see https://www.w3.org/TR/wai-aria/.

No Headings