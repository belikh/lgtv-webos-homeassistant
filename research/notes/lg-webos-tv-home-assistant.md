---
title: LG webOS TV - Home Assistant
id: lg-webos-tv-home-assistant
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:15:21.552147Z'
source: https://www.home-assistant.io/integrations/webostv/
source_domain: www.home-assistant.io
fetched_at: '2026-08-28T02:15:21.550752Z'
fetch_provider: builtin
status: draft
type: note
tier: unknown
content_type: unknown
deprecated: false
---

LG webOS TV - Home Assistant

On this page

Configuration

Configuration options

Supported devices

List of triggers

Turning on the TV from Home Assistant

List of actions

Notifications

Data updates

Switching source with automation

Change channel through play_media action

Next/Previous buttons

Troubleshooting

Device is not automatically detected

WakeOnLan does not work

Pairing fails when trying to add the TV

Known limitations

Removing the integration

To remove an integration instance from Home Assistant

LG webOS TV

The LG webOS TV integrationIntegrations connect and integrate Home Assistant with your devices, services, and more. [Learn more] allows you to control a LG webOS TV.

There is currently support for the following device types within Home Assistant:

Media player

Notifications

To begin with enable LG Connect Apps feature in Network settings of the TV.

Configuration

To add the LG webOS TV device to your Home Assistant instance, use this My button:

LG webOS TV can be auto-discovered by Home Assistant. If an instance was found,
it will be shown as Discovered. You can then set it up right away.

Manual configuration steps

If it wasn’t discovered automatically, don’t worry! You can set up a
manual integration entry:

Browse to your Home Assistant instance.

Go to  Settings > Devices & services.

In the bottom right corner, select the
Add Integration button.

From the list, select LG webOS TV.

Follow the instructions on screen to complete the setup.

Host

The Hostname or IP address of your TV. You can find it in your router.

Configuration options

The integration provides the following configuration options:

Sources

It is possible to select which sources will be available to the media player. When the TV is powered on press the CONFIGURE button in the integrationIntegrations connect and integrate Home Assistant with your devices, services, and more. [Learn more] card and select the sources to enable. If you don’t select any source the media player will offer all of the sources of the TV.

Supported devices

LG webOS TV devices running webOS 2.0 and above.

List of triggers

The LG webOS TV integrationIntegrations connect and integrate Home Assistant with your devices, services, and more. [Learn more] provides the following triggers. Each link below opens a dedicated page with examples, fields, and a step-by-step UI walkthrough.

Device is requested to turn on (webostv.turn_on)
Triggers when something requests an LG webOS TV to turn on.

For an overview of every trigger across all integrations, see the triggers reference.

Turning on the TV from Home Assistant

To turn on your TV from Home Assistant, you need to create an automation using the Device is requested to turn on trigger. Without this automation, the TV will appear as unavailable when it is off.

If you want to use an automation to turn on an LG webOS TV, install an integrationIntegrations connect and integrate Home Assistant with your devices, services, and more. [Learn more] such as HDMI-CEC or Wake-on-LAN. They provide an action that can power on the TV.

A common setup for webOS 3.0 and higher is to use Wake-on-LAN. For this to work, your TV should be connected to your network through Ethernet instead of wireless, and you should enable LG Connect Apps in the TV network settings, or Mobile App in the general settings on older models. The exact setting name can vary by model and webOS version.

Important

This usually only works if the TV is connected to the same network. Routing the Wake-on-LAN packet to a different subnet requires special configuration on your router or may not be possible.

List of actions

The LG webOS TV integrationIntegrations connect and integrate Home Assistant with your devices, services, and more. [Learn more] provides the following actions. Each link below opens a dedicated page with examples, parameters, and a step-by-step UI walkthrough.

Button (webostv.button)
Simulates a button press on the remote of an LG webOS TV.

Command (webostv.command)
Sends a generic command to an LG webOS TV.

Select sound output (webostv.select_sound_output)
Changes the active sound output of an LG webOS TV.

For an overview of every action across all integrations, see the actions reference.

Notifications

The notify platform allows you to send notifications to an LG webOS TV. Each TV gets its own action, named after the TV, such as notify.livingroom_tv. The action name selects which TV receives the notification, so you don’t target an entity. You can override the icon for individual notifications by providing a path to an alternative icon image.

This notification action takes the following options:

message: The message to display on the TV.

icon: An optional icon to show with the notification. In YAML, pass it inside the nested data: block, as shown in the example below.

automation:
- alias: "Front door motion"
triggers:
- trigger: state
entity_id: binary_sensor.front_door_motion
to: "on"
actions:
- action: notify.livingroom_tv
data:
message: "Movement detected: Front Door"
data:
icon: "/home/homeassistant/images/doorbell.png"

Important

The icon has to be a local file accessible by Home Assistant, not a web URL. The icon does not need to be accessible by the TV. The integration sends the icon to the TV encoded inside the notification message.

Data updates

LG webOS TV devices are automatically pushing data to Home Assistant.

Switching source with automation

Imagine you want your LG TV to automatically switch to a specific source when it turns on. Below is a simple automation example that launches YouTube after the TV is switched on.
It leverages select_source action from the Media player integration to launch a specific app installed on your LG TV.

To find available sources for your TV

Go to Settings > Tools > States.

Find your TV’s media_player entity.

Look for the source_list attribute which contains all available sources.

Tip

Source list example: source_list: ARD Mediathek, Apps, HDMI 1, Home Dashboard, JBL Bar 1300, Media Player, Netflix, Prime Video, Public Value, Spotify - Music and Podcasts, Timer, Web Browser, YouTube, ZDFmediathek

The automation can be created entirely through the Home Assistant UI. When setting it up, you’ll only need to manually enter the source name (for example, “YouTube”) in the action configuration. Below is the YAML code generated as a result:

alias: Switch TV source to YouTube by Default
description: 'Regardless if started from TV remote or via wake-on-lan, the TV will switch to YouTube right after it is on'
triggers:
- device_id: <TV DEVICE ID>
domain: media_player
entity_id: <TV MEDIA PLAYER ENTITY ID>
type: turned_on
trigger: device
conditions: []
actions:
- action: media_player.select_source
metadata: {}
data:
source: YouTube
target:
device_id: <TV DEVICE ID>
mode: single

Change channel through play_media action

The play_media action can be used in a script to switch to the specified TV channel. It selects the best matching channel according to the media_content_id parameter:

Channel number (for example, ‘1’ or ‘6’)

Exact channel name (for example, ‘France 2’ or ‘CNN’)

Substring in channel name (for example, ‘BFM’ in ‘BFM TV’)

# Example action entry in script to switch to channel number 1
action: media_player.play_media
target:
entity_id: media_player.lg_webos_tv
data:
media_content_id: 1
media_content_type: "channel"

# Example action entry in script to switch to channel including 'TF1' in its name
action: media_player.play_media
target:
entity_id: media_player.lg_webos_tv
data:
media_content_id: "TF1"
media_content_type: "channel"

Next/Previous buttons

The behavior of the next and previous buttons is different depending on the active source:

if the source is ‘LiveTV’ (television): next/previous buttons act as channel up/down

otherwise: next/previous buttons act as next/previous track

Troubleshooting

Device is not automatically detected

This integration uses the SSDP integration, which must be enabled for device discovery to work.

WakeOnLan does not work

On newer models (2025+), WakeOnLan may need to be enabled in the TV settings by going to Settings > Support > IP control settings > Wake on LAN.
For other models (2017+) the same settings is under Settings > General > Mobile TV On > Turn On Via WiFi, see these instructions.

Pairing fails when trying to add the TV

Make sure to enable LG Connect Apps feature in Network settings of the TV.

Known limitations

If Home Assistant and your TV are not on the same network, you need to create a firewall rule, which allows a connection on ports 3000 & 3001 with the TCP protocol from Home Assistant to your TV.

Most newer TV firmware does not allow passing the icon parameter to the notify command, the TV will ignore the icon and only display the message.

On some TV firmware versions, passing the icon parameter to the notify command can prevent the notification from being shown.

Removing the integration

This integration follows standard integration removal. No extra steps are required.

To remove an integration instance from Home Assistant

Go to Settings > Devices & services and select the integration card.

From the list of devices, select the integration instance you want to remove.

Next to the entry, select the three dots  menu. Then, select Delete.

Help us improve our documentation

Suggest an edit to this page, or provide/view feedback for this page.

Edit

Provide feedback

View pending feedback

The LG webOS TV  device  was introduced in Home Assistant 0.18, and it's used by

12.3% of the active installations.

Its IoT class is Local Push.

🏆 Platinum quality

View source on GitHub

View known issues

View feature requests

Integration owners

We are incredibly grateful to the following contributors who currently maintain this integration:

@thecode

Categories

Media player

Notifications

On this page

Configuration

Configuration options

Supported devices

List of triggers

Turning on the TV from Home Assistant

List of actions

Notifications

Data updates

Switching source with automation

Change channel through play_media action

Next/Previous buttons

Troubleshooting

Device is not automatically detected

WakeOnLan does not work

Pairing fails when trying to add the TV

Known limitations

Removing the integration

To remove an integration instance from Home Assistant

Back to top