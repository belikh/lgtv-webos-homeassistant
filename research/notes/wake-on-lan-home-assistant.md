---
title: Wake on LAN - Home Assistant
id: wake-on-lan-home-assistant
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:15:59.030331Z'
source: https://www.home-assistant.io/integrations/wake_on_lan/
source_domain: www.home-assistant.io
fetched_at: '2026-08-28T02:15:54.674348Z'
fetch_provider: builtin
status: draft
type: note
deprecated: false
summary: Wake on LAN - Home Assistant
---

Wake on LAN - Home Assistant

On this page

Configuration

Integration services

List of actions

Button

Switch

Examples

Helper button with automation

Related topics

Wake on LAN

The Wake on LAN integrationIntegrations connect and integrate Home Assistant with your devices, services, and more. [Learn more] enables the ability to send magic packets to Wake on LAN capable devices to turn them on.

There is currently support for the following device types within Home Assistant:

Button enabled from the UI

Switch enabled from YAML configuration

Tip

To implement a switch without using YAML, consider using a template switch helper. Use the Wake on LAN button as the turn on action, a ping sensor for the state, and a third service for the turn off action.

Configuration

To add the Wake on LAN service to your Home Assistant instance, use this My button:

Manual configuration steps

If the above My button doesn’t work, you can also perform the following steps
manually:

Browse to your Home Assistant instance.

Go to  Settings > Devices & services.

In the bottom right corner, select the
Add Integration button.

From the list, select Wake on LAN.

Follow the instructions on screen to complete the setup.

Mac address

The MAC address to send the wake-up command to. For example, 00:01:02:03:04:05.

SecureOn password

The SecureOn password to append to the magic packet. For example, 00:aa:22:bb:33:cc.

Broadcast address

The IP address of the host to send the magic packet to.

Broadcast port

The port to send the magic packet to.

Integration services

To use only the Send magic packet action, without the button or switch, add the following to your configuration.yamlThe configuration.yaml file is the main configuration file for Home Assistant. It lists the integrations to be loaded and their specific configurations. In some cases, the configuration needs to be edited manually directly in the configuration.yaml file. Most integrations can be configured in the UI. [Learn more] file:

# Example configuration.yaml entry
wake_on_lan:

List of actions

The Wake on LAN integrationIntegrations connect and integrate Home Assistant with your devices, services, and more. [Learn more] provides the following actions. Each link below opens a dedicated page with examples, parameters, and a step-by-step UI walkthrough.

Send magic packet (wake_on_lan.send_magic_packet)
Sends a magic packet to wake up a device with Wake-on-LAN capabilities.

For an overview of every action across all integrations, see the actions reference.

Button

The wake_on_lan (WOL) button integrationIntegrations connect and integrate Home Assistant with your devices, services, and more. [Learn more] allows you to turn on a WOL enabled computer.

The WOL button can only turn on your computer.
It will send a magic packet to the MAC address specified in the configuration. As a button, it is stateless. This means it cannot monitor if the WOL-enabled computer has actually received the wake-up call and has started.

Switch

The wake_on_lan (WOL) switch integrationIntegrations connect and integrate Home Assistant with your devices, services, and more. [Learn more] allows you to turn on a WOL enabled computer.

The WOL switch can only turn on your computer and monitor the state. There is no universal way to turn off a computer remotely. The turn_off variable is there to help you call a script when you have figured out how to remotely turn off your computer. See below for suggestions on how to do this.

It’s required that the binary ping is in your $PATH.

To enable this switch in your installation, add the following to your configuration.yamlThe configuration.yaml file is the main configuration file for Home Assistant. It lists the integrations to be loaded and their specific configurations. In some cases, the configuration needs to be edited manually directly in the configuration.yaml file. Most integrations can be configured in the UI. [Learn more] file:

# Example configuration.yaml entry
switch:
- platform: wake_on_lan
mac: MAC_ADDRESS

Configuration Variables

Looking for your configuration file?

mac string Required

The MAC address to send the wake up command to, e.g, 00:01:02:03:04:05.

name string (Optional, default: Wake on LAN)

The name of the switch.

host string (Optional)

The IP address or hostname to check the state of the device (on/off). If this is not provided, the state of the switch will be assumed based on the last action that was taken.

turn_off string (Optional)

Defines an action to run when the switch is turned off.

broadcast_address string (Optional, default: 255.255.255.255)

The IP address of the host to send the magic packet to.

broadcast_port integer (Optional)

The port to send the magic packet to.

Examples

Here are some real-life examples of how to use the turn_off variable.

Suspending Linux

Suggested recipe for letting the turn_off script suspend a Linux computer (the target)
from Home Assistant running on another Linux computer (the server).

On the server, log in as the user account Home Assistant is running under. In this example it’s hass.

On the server, create a .ssh directory in /config. This is necessary to avoid a 255 error that prevents the SSH command from executing.

On the server, create SSH keys by running ssh-keygen. Just press enter on all questions.

On the target, create a new account that Home Assistant can ssh into: sudo adduser hass. Just press enter on all questions except password. It’s recommended using the same username as on the server. If you do, you can leave out hass@ in the SSH commands below.

On the server, transfer your public SSH key by ssh-copy-id hass@TARGET where TARGET is your target machine’s name or IP address. Enter the password you created in step 4.

On the server, verify that you can reach your target machine without password by ssh TARGET.

On the target, we need to let the hass user execute the program needed to suspend/shut down the target computer. Here it is pm-suspend, use poweroff to turn off the computer. First, get the full path: which pm-suspend. On my system, this is /usr/sbin/pm-suspend.

On the target, using an account with sudo access (typically your main account), sudo visudo. Add this line last in the file: hass ALL=NOPASSWD:/usr/sbin/pm-suspend, where you replace hass with the name of your user on the target, if different, and /usr/sbin/pm-suspend with the command of your choice, if different.

On the server, add the following to your configuration, replacing TARGET with the target’s name:

switch:
- platform: wake_on_lan
name: "TARGET"
mac: XX:XX:XX:XX:XX:XX
turn_off:
action: shell_command.turn_off_TARGET

shell_command:
turn_off_TARGET: "ssh hass@TARGET sudo pm-suspend"

Helper button with automation

A switch defined with the wake_on_lan platform will render in the UI with both ‘on’ and ‘off’ clickable actions. If you don’t intend to use the turn_off functionality, then using a virtual button & automation will look cleaner and less confusing. It will only have one action.

First, define a new helper button.

Go to Settings > Devices & services > Helpers and select the + Create helper button. Choose Button and give it a name. A button named “Wake PC” will render like this:

Then, create a new automation. Go to Settings > Automations & scenes and select + Create Automation.

The trigger will be on State and the entity will be the button you created.

Continuing your example, the trigger YAML will look like this:

trigger: state
entity_id:
- input_button.wake_pc

For the action, select Perform action and choose Wake on LAN: Send magic packet.

Type in the target MAC address.

Do not change the broadcast port unless you’ve configured your device to listen to a different port.

Continuing our example, the action YAML looks like this:

action: wake_on_lan.send_magic_packet
data:
broadcast_port: 9
mac: 00:11:22:33:44:55

Save the automation. Now, when you activate PRESS on the helper button in the UI, Home Assistant will send a wake packet to the configured MAC.

Related topics

Configuration file

Help us improve our documentation

Suggest an edit to this page, or provide/view feedback for this page.

Edit

Provide feedback

View pending feedback

The Wake on LAN  service  was introduced in Home Assistant 0.49, and it's used by

8.6% of the active installations.

Its IoT class is Local Push.

View source on GitHub

View known issues

View feature requests

Integration owners

We are incredibly grateful to the following contributors who currently maintain this integration:

@ntilley905

Categories

Button

Network

Switch

On this page

Configuration

Integration services

List of actions

Button

Switch

Examples

Helper button with automation

Related topics

Back to top