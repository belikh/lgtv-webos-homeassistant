---
title: Zero-configuration networking (zeroconf) - Home Assistant
id: zero-configuration-networking-zeroconf-home-assistant
tags:
- lgtv-webos-ha-root-1a89ff
- locus-credentialless-root-detection-and-consented-ipk-orchestration
created: '2026-08-28T02:15:38.325181Z'
updated: '2026-08-28T02:40:08.000002Z'
source: https://www.home-assistant.io/integrations/zeroconf/
source_domain: www.home-assistant.io
fetched_at: '2026-08-28T02:15:37.436096Z'
fetch_provider: builtin
status: draft
type: note
deprecated: false
summary: Zero-configuration networking (zeroconf) - Home Assistant
---

Zero-configuration networking (zeroconf) - Home Assistant

On this page

Configuration

Network interfaces and auto detection

Troubleshooting

Zeroconf Browser

Integrations relying on Zeroconf traffic are unresponsive

Discovered integrations

Zero-configuration networking (zeroconf)

The Zero-configuration networking (zeroconf) integrationIntegrations connect and integrate Home Assistant with your devices, services, and more. [Learn more] will scan the network for supported devices and services. Discovered integrations will show up in the discovered section on the integrations page in the configuration panel. It will also make Home Assistant discoverable for other services in the network. Zeroconf is also sometimes known as Bonjour, Rendezvous, and Avahi.

Integrations can opt-in to be found by adding either a Zeroconf section or a HomeKit section to their manifest.json.

Configuration

This integration is by default enabled, unless you’ve disabled or removed the default_config: line from your configuration. If that is the case, and you wish to have Home Assistant scan for integrations using zeroconf and HomeKit, the following example shows you how to enable this integration manually:

# Example configuration.yaml entry
zeroconf:

Network interfaces and auto detection

Zeroconf chooses which interfaces to broadcast on based on the Network integration.

IPv6 will automatically be enabled if one of the selected interfaces has an IPv6 address that is enabled via the Network integration.

Troubleshooting

Zeroconf Browser

The Zeroconf Browser shows devices discovered by Home Assistant using Zeroconf (also known as mDNS or Bonjour). This method allows devices to advertise their services on the local network without needing a central directory. Home Assistant actively searches for specific services using Zeroconf, and any matching devices will appear in this browser.

To open the Zeroconf Browser, go to:
Settings > System > Network > Zeroconf Browser

Integrations relying on Zeroconf traffic are unresponsive

Some integrations rely on Zeroconf traffic to work, for example, the HomeKit integration.
These integrations will not respond to traffic from other devices if the host device is not configured correctly.

Libvirt virtual machine with macvtap adapter

By default, the macvtap adapter created by libvirt does not allow the guest to receive Zeroconf or multicast traffic.

Configure the virtual machine to accept this traffic by adding the trustGuestRxFilters="yes" setting in the adapter’s XML. For example:

<interface type="direct" trustGuestRxFilters="yes">
<mac address="xx:xx:xx:xx:xx:xx"/>
<source dev="eno1" mode="bridge"/>
<model type="virtio"/>
<link state="up"/>
<address type="pci" domain="0x0000" bus="0x01" slot="0x00" function="0x0"/>
</interface>

This only works with the virtio network adapter type and it is disabled by default for security reasons. See the libvirt documentation for more details.

Discovered integrations

The following integrations are automatically discovered by the zeroconf integration:

1-Wire

AirGradient

Altruist

Android TV Remote

Apple TV

Awair

Axis

Bang & Olufsen

Big Ass Fans

BleBox devices

Bluesound

Bond

Bosch SHC

Bose SoundTouch

Brother Printer

BSB-Lan

Cambridge Audio

Daikin AC

Deako

Denon HEOS

Devialet

devolo Home Control

devolo Home Network

DoorBird

Droplet

ecobee

EHEIM Digital

Elexa Guardian

Elgato Light

Elmax

Enphase Envoy

ESPHome

Freebox

Google Cast

Home Connect

HomeKit Bridge

HomeKit Device

HomeWizard Energy

Hunter Douglas PowerView

Internet Printing Protocol (IPP)

IOmeter

iRobot Roomba and Braava

Kodi

Lektrico Charging Station

LinkPlay

LOOKin

LOQED Touch Smart Lock

Lutron Caséta

Matter

Miele

Modern Forms

Music Assistant

Nanoleaf

Nettigo Air Monitor

Network UPS Tools (NUT)

OctoPrint

Overkiz

OwnTone

Peblar

Philips Hue

Philips TV

Plex Media Server

Plugwise

Powerfox

Pure Energie

Rabbit Air

Rachio

RainMachine

ROMY Vacuum Cleaner

Russound RIO

Samsung Smart TV

Shelly

Slide Local

Smappee

SMLIGHT SLZB

Sonos

Synology DSM

System Bridge

Tailwind

TechnoVE

Thread

Vegetronix VegeHub

VIZIO SmartCast

Vogel’s MotionMount

Volumio

WLED

Wyoming Protocol

Xiaomi Gateway (Aqara)

Xiaomi Home

Yeelight

Zigbee Home Automation

Z-Wave

Z-Wave.Me

Help us improve our documentation

Suggest an edit to this page, or provide/view feedback for this page.

Edit

Provide feedback

View pending feedback

The Zero-configuration networking (zeroconf)  system  was introduced in Home Assistant 0.18, and it's used by

1.7% of the active installations.

Its IoT class is Local Push.

🏠 Internal integration

View source on GitHub

View known issues

View feature requests

Integration owners

We are incredibly grateful to the following contributors who currently maintain this integration:

@bdraco

Categories

Network

On this page

Configuration

Network interfaces and auto detection

Troubleshooting

Zeroconf Browser

Integrations relying on Zeroconf traffic are unresponsive

Discovered integrations

Back to top