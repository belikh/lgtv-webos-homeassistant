---
title: Simple Service Discovery Protocol (SSDP) - Home Assistant
id: simple-service-discovery-protocol-ssdp-home-assistant
tags:
- lgtv-webos-ha-root-1a89ff
- locus-credentialless-root-detection-and-consented-ipk-orchestration
created: '2026-08-28T02:15:38.321158Z'
updated: '2026-08-28T02:40:07.452580Z'
source: https://www.home-assistant.io/integrations/ssdp/
source_domain: www.home-assistant.io
fetched_at: '2026-08-28T02:15:36.410206Z'
fetch_provider: builtin
status: draft
type: note
deprecated: false
summary: Simple Service Discovery Protocol (SSDP) - Home Assistant
---

Simple Service Discovery Protocol (SSDP) - Home Assistant

On this page

Configuration

Troubleshooting

SSDP/UPnP Browser

Discovered integrations

Simple Service Discovery Protocol (SSDP)

The Simple Service Discovery Protocol (SSDP) (part of UPnP) integrationIntegrations connect and integrate Home Assistant with your devices, services, and more. [Learn more] will scan the network for supported devices and services. Discovered integrations will show up in the discovered section on the integrations page in the configuration panel.

Integrations can opt-in to be found by adding an SSDP section to their manifest.json.

Configuration

This integration is by default enabled, unless you’ve disabled or removed the default_config: line from your configuration. If that is the case, the following example shows you how to enable this integration manually:

# Example configuration.yaml entry
ssdp:

Troubleshooting

SSDP/UPnP Browser

The SSDP/UPnP Browser displays devices discovered by Home Assistant using SSDP (Simple Service Discovery Protocol), a core part of the UPnP (Universal Plug and Play) standard. Devices like smart TVs, media servers, and printers often use SSDP to announce themselves on the network. Home Assistant listens for these broadcasts to automatically detect compatible devices.

To open the SSDP/UPnP Browser, go to:
Settings > System > Network > SSDP Browser

Discovered integrations

The following integrations are automatically discovered by the SSDP integration:

Arcam FMJ Receivers

AVM FRITZ!Box Tools

AVM FRITZ!SmartHome

Axis

Belkin WeMo

Control4

deCONZ

Denon AVR Network Receivers

Denon HEOS

DirecTV

DLNA Digital Media Renderer

DLNA Digital Media Server

Frontier Silicon

Huawei LTE

Hyperion

Imeon Inverter

Kaleidescape

Keenetic NDMS2 Router

LaMetric

LG webOS TV

Linn / OpenHome

Logitech Harmony Hub

MusicCast

Nanoleaf

NETGEAR

OctoPrint

Onkyo

Roku

Samsung Smart TV

Samsung SyncThru Printer

Sonos

Sony Bravia TV

Sony Songpal

Synology DSM

UniFi Network

UniFi Protect

Universal Devices ISY/IoX

UPnP/IGD

WiLight

Help us improve our documentation

Suggest an edit to this page, or provide/view feedback for this page.

Edit

Provide feedback

View pending feedback

The Simple Service Discovery Protocol (SSDP)  system  was introduced in Home Assistant 0.94, and it's used by

1.4% of the active installations.

Its IoT class is Local Push.

🏠 Internal integration

View source on GitHub

View known issues

View feature requests

Integration owners

This integration is community maintained.

If you are a developer and would like to help, feel free to contribute!

Categories

Network

On this page

Configuration

Troubleshooting

SSDP/UPnP Browser

Discovered integrations

Back to top