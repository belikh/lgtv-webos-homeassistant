---
title: HDMI-CEC - Home Assistant
id: hdmi-cec-home-assistant
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:15:59.036322Z'
source: https://www.home-assistant.io/integrations/hdmi_cec/
source_domain: www.home-assistant.io
fetched_at: '2026-08-28T02:15:55.336136Z'
fetch_provider: builtin
status: draft
type: note
deprecated: false
summary: HDMI-CEC - Home Assistant
---

HDMI-CEC - Home Assistant

On this page

CEC Setup

Home Assistant OS

Adapter

libcec

Testing your installation

Configuration Example

List of actions

Useful References

HDMI-CEC

The HDMI-CEC integrationIntegrations connect and integrate Home Assistant with your devices, services, and more. [Learn more] provides actions that allow selecting the active device, powering on all devices, setting all devices to standby and creates switch entities for HDMI devices. Devices are defined in the configuration file by associating HDMI port number and a device name. Connected devices that provide further HDMI ports, such as sound-bars and AVRs are also supported. Devices are listed from the perspective of the CEC-enabled Home Assistant device. Any connected device can be listed, regardless of whether it supports CEC. Ideally the HDMI port number on your device will map correctly the CEC physical address. If it does not, use cec-client (part of the libcec package) to listen to traffic on the CEC bus and discover the correct numbers.

CEC Setup

Home Assistant OS

To test if HDMI-CEC will work on your Home Assistant OS installation, you can use the official CEC Scanner app for Home Assistant (formerly known as CEC Scanner add-on). Run this app to see if your hardware has HDMI-CEC capabilities and which devices are connected. Do not have this app Start on boot, as it will interfere with the integration.

Once you’ve run the CEC Scanner app, you can use the resulting scan information to configure the integration.

Adapter

The computer running Home Assistant must support CEC, and of course be connected via HDMI to a device also supporting CEC. You can purchase a USB CEC adapter to add support if necessary. Note that all Raspberry Pi models support CEC natively.

libcec

This section only applies to users of Home Assistant Core in a Python virtual environment.

libcec must be installed for this integration to work. Follow the installation instructions for your environment, provided at the link. libcec installs Python 3 bindings by default as a system Python module. If you are running Home Assistant in a Python virtual environment, make sure it can access the system module, by either symlinking it or using the --system-site-packages flag.

Symlinking into virtual environment

Create a symlink to the cec installation including the _cec.so file. Keep in mind different installation methods will result in different locations of cec.

ln -s /path/to/your/installation/of/cec.py /path/to/your/venv/lib/python*/site-packages
ln -s /path/to/your/installation/of/_cec.so /path/to/your/venv/lib/python*/site-packages

Symlinking examples

For the default virtual environment of a Manual install for Raspberry Pi the command would be as follows.

ln -s /usr/local/lib/python*/dist-packages/cec.py /srv/homeassistant/lib/python*/site-packages
ln -s /usr/local/lib/python*/dist-packages/_cec.so /srv/homeassistant/lib/python*/site-packages

Note

If after symlinking and adding hdmi_cec: to your configuration you are getting the following error in your logs,
* failed to open vchiq instance you will also need to add the user account Home Assistant runs under, to the video group. To add the Home Assistant user account to the video group, run the following command. $ usermod -a -G video <hass_user_account>

Testing your installation

Log in to Raspberry Pi

ssh pi@your_raspberry_pi_ip

at the command line type:

echo scan | cec-client -s -d 1

Note: to use this command you have to install cec-utils package. In Debian based should be: sudo apt install cec-utils

This will give you the list of devices that are on the bus

opening a connection to the CEC adapter...
requesting CEC bus information ...
CEC bus information
===================
device #4: Playback 1
address:       3.0.0.0
active source: no
vendor:        Sony
osd string:    BD
CEC version:   1.4
power status:  on
language:      ???

Note

address: entry above this will be used to configure Home Assistant, this address is represented below as 3: BlueRay player.

Configuration Example

In the following example, a Pi Zero running Home Assistant is on a TV’s HDMI port 1. HDMI port 2 is attached to a AV receiver. Three devices are attached to the AV receiver on HDMI ports 1 through 3.

You can use either direct mapping name to physical address of device

hdmi_cec:
devices:
TV: 0.0.0.0
Pi Zero: 1.0.0.0
Fire TV Stick: 2.1.0.0
Chromecast: 2.2.0.0
Another Device: 2.3.0.0
BlueRay player: 3.0.0.0

or port mapping tree:

hdmi_cec:
devices:
1: Pi Zero
2:
1: Fire TV Stick
2: Chromecast
3: Another Device
3: BlueRay player

Choose just one schema. Mixing both approaches is not possible.

Another option you can use in configuration is platform which specifying of default platform of HDMI devices. “switch” and “media_player” are supported. Switch is default.

hdmi_cec:
platform: media_player

Then you set individual platform for devices in customizations:

hdmi_cec:
types:
hdmi_cec.hdmi_5: media_player

And the last option is host. PyCEC supports bridging CEC commands over TCP. When you start pyCEC on machine with HDMI port (python -m pycec), you can then run Home Assistant on another machine and connect to CEC over TCP. Specify TCP address of pyCEC server:

hdmi_cec:
host: 192.168.1.3

List of actions

The HDMI-CEC integrationIntegrations connect and integrate Home Assistant with your devices, services, and more. [Learn more] provides the following actions. Each link below opens a dedicated page with examples, parameters, and a step-by-step UI walkthrough.

Power on (hdmi_cec.power_on)
Powers on all devices on the HDMI-CEC bus that support this function.

Select device (hdmi_cec.select_device)
Makes an HDMI-CEC device the active source.

Send command (hdmi_cec.send_command)
Sends a raw CEC command to the HDMI-CEC bus.

Standby (hdmi_cec.standby)
Puts all devices on the HDMI-CEC bus that support this function into standby.

Update (hdmi_cec.update)
Updates the state of HDMI-CEC devices from the bus.

Volume (hdmi_cec.volume)
Changes the volume or mute state of the HDMI-CEC audio system.

For an overview of every action across all integrations, see the actions reference.

Useful References

CEC overview

CEC-o-matic

Help us improve our documentation

Suggest an edit to this page, or provide/view feedback for this page.

Edit

Provide feedback

View pending feedback

The HDMI-CEC  integration  was introduced in Home Assistant 0.23, and it's used by

63 active installations.

Its IoT class is Local Push.

💾 Legacy integration

View source on GitHub

View known issues

View feature requests

Integration owners

We are incredibly grateful to the following contributors who currently maintain this integration:

@inytar

Categories

Automation

On this page

CEC Setup

Home Assistant OS

Adapter

libcec

Testing your installation

Configuration Example

List of actions

Useful References

Back to top