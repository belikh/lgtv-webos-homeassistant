---
title: 'GitHub - belikh/ha-lg-webos-tv: vibe coded.. untested until later tonight
  · GitHub'
id: github-belikhha-lg-webos-tv-vibe-coded-untested-until-later-tonight-github
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:14:30.114754Z'
source: https://github.com/belikh/ha-lg-webos-tv
source_domain: github.com
fetched_at: '2026-08-28T02:14:30.113313Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: code
deprecated: false
---

GitHub - belikh/ha-lg-webos-tv: vibe coded.. untested until later tonight · GitHub

Skip to content

Search/

Sign inSign up
Appearance settings

You signed in with another tab or window. Reload to refresh your session.
You signed out in another tab or window. Reload to refresh your session.
You switched accounts on another tab or window. Reload to refresh your session.

Dismiss alert

{{ message }}

belikh

/

ha-lg-webos-tv

Public

Notifications
You must be signed in to change notification settings

Fork
1

Star
3

bscpylgtv-integration

BranchesTags

Go to fileCode
Open more actions menu

Latest commit

History17 Commits

17 Commits
Folders and filesNameName
Last commit message
Last commit date

.github/workflows

.github/workflows

custom_components/bscpylgtv

custom_components/bscpylgtv

.gitignore

.gitignore

CHANGELOG.md

CHANGELOG.md

README.md

README.md

hacs.json

hacs.json

View all files

Repository files navigation

LG WebOS TV (bscpylgtv) Home Assistant Integration

This is a custom component for Home Assistant that provides a fully-fledged integration for LG WebOS TVs using the bscpylgtv library.

It is designed to "expose everything" possible from the library, including advanced calibration features, system settings, and comprehensive control.

Features

Config Flow: Easy setup via the UI with auto-discovery (SSDP) and pairing guidance.

Media Player:

Power (On/Off), Volume, Mute.

Source selection (Inputs and Apps).

Play/Pause/Stop/Next/Previous.

play_media support for launching apps.

Remote:

Full remote control support (Up, Down, Left, Right, Select, Back, Home, Menu, etc.).

Notify:

Send toast notifications to the TV screen.

Entities:

Buttons:

Standard: Turn Screen Off/On, Screensaver, Screenshot.

Advanced (Disabled by default): Reboot, Soft Reboot, TPC/GSR toggles (OLED protection).

Numbers:

Advanced (Disabled by default): Backlight, Contrast, Brightness, Color, Sharpness, OLED Light.

Selects: Picture Mode, Sound Output.

Sensors: Current App, Volume, Power State, Software Info (Model, Version, Device ID).

Switches: AI Picture Pro (experimental).

Services:

launch_app: Launch an app by ID.

launch_app_with_params: Launch an app with JSON parameters.

command: Execute any method available in the WebOsClient library.

set_settings: Update system or picture settings.

Installation

HACS (Recommended)

Open HACS in Home Assistant.

Go to "Integrations".

Click the 3 dots in the top right corner and select "Custom repositories".

Add the URL of this repository.

Select "Integration" as the category.

Click "Add".

Find "LG WebOS TV (bscpylgtv)" in the list and install it.

Restart Home Assistant.

Manual Installation

Download the custom_components/bscpylgtv folder from this repository.

Copy it to your Home Assistant custom_components directory.

Restart Home Assistant.

Configuration

Go to Settings > Devices & Services.

Click Add Integration.

Search for LG WebOS TV (bscpylgtv).

Enter the IP address of your TV.

Follow the instructions to pair (accept the prompt on your TV).

Entities & Options

Dangerous/Advanced Options

Some entities are disabled by default to prevent accidental changes that could affect picture quality or device stability. To enable them:

Go to the Device page for your TV in Home Assistant.

Click on "Entities" or the specific disabled entity.

Click the "Settings" (gear) icon.

Toggle "Enabled" and update.

Disabled Entities:

Reboot / Soft Reboot: Restarts the TV.

TPC / GSR: Temporal Peak Luminance Control and Global Sticky Reduction. These are OLED protection mechanisms. Disabling them might void warranties or cause burn-in. Use with caution.

Picture Settings (Numbers): Direct control over Backlight, Contrast, etc.

Services

media_player.play_media

You can launch apps using standard media player calls:

service: media_player.play_media
target:
entity_id: media_player.lg_webos_tv
data:
media_content_type: app
media_content_id: com.webos.app.youtube

bscpylgtv.command

Send raw commands to the library.

service: bscpylgtv.command
target:
entity_id: media_player.lg_webos_tv
data:
command: system_info

notify.notify

Send a toast notification.

service: notify.lg_webos_tv_notify
data:
message: "Hello World!"

Credits

Based on the bscpylgtv library by chros73.

About
vibe coded.. untested until later tonight
Resources
Readme
Activity
Stars
3 stars
Watchers
1 watching
Forks
1 fork
Report repository

Releases

Packages

Contributors

Languages

You can’t perform that action at this time.