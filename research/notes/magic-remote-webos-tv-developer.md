---
title: Magic Remote | webOS TV Developer
id: magic-remote-webos-tv-developer
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:17:16.899665Z'
source: https://webostv.developer.lge.com/develop/guides/magic-remote
source_domain: webostv.developer.lge.com
fetched_at: '2026-08-28T02:17:16.417425Z'
fetch_provider: builtin
status: draft
type: note
deprecated: false
summary: Magic Remote | webOS TV Developer
---

Magic Remote | webOS TV Developer

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

Magic Remote

The LG Smart TV is boxed with one of the two following remote control units:

Magic Remote Control Unit allows for free pointing and clicking, as well as standard 5-way controls. AI(Voice) input and universal remote functionality are also provided.

Conventional Remote Control Unit allows for standard 5-way controls, with additional physical keys as shortcuts to commonly used actions.
Magic Remote control unit

Button
App Usage
Power, Volume, Mute(MR26GB), AI
General system functions
Channel +/-
N/A
Smart Home ()
Returns to Home Screen
OK
Select/Enter
Wheel
Scrolls content on hover
Navigation - Up
Moves focus to up
Navigation - Right
Moves focus to the right
Navigation - Down
Moves focus to down
Navigation - Left
Moves focus to the left
BACK ()
•  Short press: Returns to the previous page. If there is no previous page,on webOS TV 6.0 or higher, a popup asking whether to exit the app is displayed.
•  on webOS TV 5.0 or lower, the Home launcher is launched.
•  Long press: Exit to Home.
Color Buttons(MR26GB):
Red, Green, Yellow, Blue
Customizable by the app
The following remote keys are available:

Button
Keycode
Left
37
Up
38
Right
39
Down
40
OK
13
Back
461
Red(MR26GB)
403
Green(MR26GB)
404
Yellow(MR26GB)
405
Blue(MR26GB)
406
Media playback keys on a conventional remote control unit
On a conventional remote control unit, there are additional media playback keys listed in the following table, which do not exist on Magic Remote.

Button
Keycode
Play
415
Pause
19
Fast-forward
417
Rewind
412
Stop
413
Basic pointer actions

Pressing Up, Down, Left, or Right key, while a pointer is active, will switch remote into 5-way modes.

In a 5-way input, the pointer function will be disabled.
Basic key actions

Action
Description
Press
Performs the function mapped to the key.
•  OK: Select an on-screen UI element.
•  Back: Returns to the previous page or the system Home.
•  Numbers: Enter a character (numbers or letters).
•  Arrows: Move left, right, up or down.
Press and hold
•  The alternate key function is performed.
•  e.g. Pressing the arrow keys in a list will accelerate the scrolling speed.
Roll
Scroll up or down the content.
Back behavior
Web apps can control the behavior of the remote's Back button. You can map the Back button to navigate the previous webpages or go to Home UI. Once the app is done handling the Back button, webOS TV will take over the behavior of the Back button. For more details, see  Back Button.
Remote control & apps
As described at the top of this article, remote controls have two navigation modes, pointer, and 5-way modes.

Pointer mode:
The remote control works similarly to a mouse (or, we prefer to refer to a wand). You can point or select items, or scroll up or down using the wheel. You can use the standard JavaScript events for the mouse, such as theonmouseover event and theonclick event.

5-way mode:
The arrow (Up, Down, Left, and Right) and the Enter keys are the major function keys in this mode. The scroll wheel is also active.
Here are additional tips and information about the navigation modes:

Pressing any of the arrow keys (Up, Down, Left, or Right) while using pointer mode will switch the navigation mode to 5-way mode.

Shaking the Magic Remote while in 5-way mode will switch the navigation mode to Pointer mode.

When the Magic Remote is in 5-way mode, the cursor will not be displayed on the screen. In Pointer mode, the cursor is displayed on the screen. You can check the cursor visibility with the cursorStateChange  event.

The LG Smart+TV's primary input mode is Pointer mode but all apps MUST also support 5-way mode. Developing functions that do not support the "5-way" input should be avoided.

The Moonstone and Sandstone libraries support both Pointer mode and 5-way modes of LG remote control.

While the overlay type system UI such as Launcher or Settings menu is displayed on the screen, apps cannot receive the pointer events. You can check it using the onblur event and theonfocus event from your app.

On touch-enabled TV devices, the Touch Remote interface is provided. For details, see   Touch Remote interface.

No Headings