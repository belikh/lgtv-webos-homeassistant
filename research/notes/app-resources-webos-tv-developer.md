---
title: App Resources | webOS TV Developer
id: app-resources-webos-tv-developer
tags:
- lgtv-webos-ha-root-1a89ff
- locus-ultimate-edge-node-cec-ambient-voice-dashboard-soc-limits
created: '2026-08-28T03:02:16.485010Z'
source: https://webostv.developer.lge.com/develop/getting-started/app-resources
source_domain: webostv.developer.lge.com
fetched_at: '2026-08-28T03:02:16.483665Z'
fetch_provider: builtin
status: draft
type: note
tier: unknown
content_type: unknown
deprecated: false
---

App Resources | webOS TV Developer

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

Getting Started

App Resources

The following table presents some common app resources and explains where you should locate them for your webOS TV apps. Do not count on the TV device’s Internet connectivity for core functionalities of your app, and keep frequently-accessed assets local to the app - in other words, package them with the app, rather than load them every time they are needed through the Internet.

Resource type
Recommended location
Do’s and Don’ts
Image
Included with the packaged app
DO use image compression tools to reduce the size and decrease load times.
Audio
Usually included with the packaged app. If it is large and infrequently accessed, you can place it online.
DO pick a bit rate that produces acceptable audio quality.
Video
Remote. If it is small or required for app functionality, video resources can be included with the packaged app. Even in that case, they should be loaded when needed only.
DO pre-process video resources to have the appropriate resolution and bit rate required for use in your app.
Font
Included with the packaged app
DO make sure fonts are properly licensed for distribution.
Text
Included with the packaged app
DO place a small amount of text directly into your app source.
DO load larger files by performing local Ajax requests if needed.

Caution
The path to each asset should be specified relative to the index.html file.
For example, it will look like `assets/my_image.png`, not start with `/media/developer/`. The latter may work in the Developer Mode app but will not when the app is released through LG Seller Lounge.
Or you can use webOSTV.js library’s `webOS.fetchAppRootPath()` method. For details, see fetchAppRootPath.
Icon, background, and description
To run your app on webOS TV, you must include the assets listed below in your app. These assets ensure that your app is branded correctly in the design perspective while maintaining the consistency with the system UI and other 3rd party apps.
App icons
Insert app icon files into your app and specify names in the appinfo.json file.

Asset
Description
Small app icon
• Required
• Specification: 80 x 80 px, PNG
• Property name in appinfo.json: icon
• Displayed on system notifications
• On webOS TV 1.0, this icon is displayed in 100 x 100 px.
Large app icon
• Required
• Specification: 130 x 130 px, PNG
• Property name in appinfo.json: largeIcon
• Displayed on the top left corner of the screen, when the user hovers over an app tile on the Launcher
• On webOS TV 2.0, this large icon is displayed in 115 x 115 px.
These icon files are required for app submission but used only for app testing. In LG Apps, instead of these files, the icon file of 400x400 pixels that you upload separately at LG Seller Lounge is used after being auto-resized.
Here are the design guidelines for app icons.

It is recommended that small and large app icons be identical, except the size, to each other. This makes it easier for users to identify the app.

The app color should be the same for small and large app icons. They both are always displayed on the app tile.
Background image
Insert a background image file into your app and specify the name in the appinfo.json file.

Asset
Description
Splash screen background image
• Required
• Specification: 1920 x 1080 px, PNG
• Property name in appinfo.json: splashBackground
• Displayed on the screen, the app is being loaded
From webOS TV 2015 models, the PVR format is not available for launcher background image and splash screen background image.  If you already have submitted an app using PVR-format images to LG Seller Lounge, you need to repackage the app using PNG-format images and resubmit it.
Here are the design guidelines for app splash image.

It should NOT be a black screen.

Use a minimal amount of text possible to avoid localization issues.
App color
App color is the background color of the app tile that is displayed on the Home screen. Specify an app tile color in the appinfo.json file.

Asset
Description
App tile color
• Required
• Specification: HEX VALUE
• Property name in appinfo.json: iconColor
• The background color of the app tile. App tiles are displayed on the Home screen.
App description
App name, app secondary description, and view title are available descriptions of an app. Specify them in the appinfo.json file.

Asset
Description
App name
• Required
• Specification: <= 20 characters
• Property name in appinfo.json: title
• Displayed on system notifications
• Displayed the top left corner of the screen, to the right of the app icon, when the user hovers over an app tile on the Launcher
App secondary description
• Optional
• Specification: <= 60 characters
• Property name in appinfo.json: appDescription
• Displayed the top left corner of the screen, below the app name, when the user hovers over an app tile on the Launcher
View title
• Specification: <= 60 characters
• The View title is dynamically provided by the app. There is no appinfo.json property for it. If the app does not provide aView Title, it is left blank.
• Displayed the top left corner of the Home screen
App secondary description vs View title

The app description provides brief information about the app; think of it as a tagline for the app. For example, the app description for Netflix could be Watch millions of movies and TV shows anytime, anywhere.

The view title provides information about the user’s current action or the on-screen content of the app. For example, the view title for Netflix could be the name of a movie that the viewer is currently watching (e.g., Kung-fu Panda 2).

The app description and view title should NEVER be the same.
Fonts
webOS TV do not restrict the font of apps to the system fonts. You can use any fonts in your app, although our recommendations are WOFF and TTF. When using fonts, keep in mind that you take the full responsibility for any license and distribution requirements.
You can also package font assets with your app. Fonts are referred to relative to the location of the index.html file.
The following sample specifies a font resource for h2 tags:
@font-face {
font-family: AlexBrush;
src: url('assets/AlexBrush-regular.ttf');
}
h2 {
font-family: AlexBrush;
}
Package assets
You should package the assets with your app for deployment to webOS TV.

For Enyo projects, place assets in the assets directory. Since webOS TV 4.5, we do not support the Enyo framework. For more information about Enyo support, see Enyo/Enact Guides.

For other projects, choose a directory within your app and place the assets there. You can create sub-directories to group assets as needed.
Access image, audio, and video assets
You can access image, audio, and video assets relative to the location of the index.html file within your package structure, except for CSS assets. CSS assets are referenced relative to the location of the CSS file.
From the index.html file, refer to an image in the assets directory as follows:
<body style='background-image: url("assets/my_image.png")'>
The same path applies to JavaScript files, regardless of where they are in your project.
myImage.setSrc("assets/my_image.png");
From a CSS file located in source/css:
.my-background {
background-image: url("../../assets/my_image.png");
}
See also

You must provide information about the key assets of your app in its metadata file (appinfo.json). To learn more, see appinfo.json.

No Headings