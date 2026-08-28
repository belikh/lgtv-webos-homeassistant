---
title: core/homeassistant/components/webostv/manifest.json at dev · home-assistant/core
  · GitHub
id: corehomeassistantcomponentswebostvmanifestjson-at-dev-home-assistantcore-github
tags:
- lgtv-webos-ha-root-1a89ff
- locus-transport-discovery-security-pairing-ws-mqtt-hybrid
created: '2026-08-28T02:43:59.837335Z'
source: https://github.com/home-assistant/core/blob/dev/homeassistant/components/webostv/manifest.json
source_domain: github.com
fetched_at: '2026-08-28T02:43:59.836040Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: code
deprecated: false
---

core/homeassistant/components/webostv/manifest.json at dev · home-assistant/core · GitHub

Skip to content

Search/

Sign inSign up
Appearance settings

You signed in with another tab or window. Reload to refresh your session.
You signed out in another tab or window. Reload to refresh your session.
You switched accounts on another tab or window. Reload to refresh your session.

Dismiss alert

{{ message }}

Uh oh!

There was an error while loading. Please reload this page.

home-assistant

/

core

Public

Uh oh!

There was an error while loading. Please reload this page.

Notifications
You must be signed in to change notification settings

Fork
38.4k

Star
90.2k

FilesExpand file tree

dev

/
manifest.jsonCopy path

Blame
More file actions

Blame
More file actions

Latest commit

HistoryHistory

History

17 lines (17 loc) · 424 Bytes

dev

/
manifest.jsonCopy pathTop

File metadata and controls

Code

Blame

17 lines (17 loc) · 424 Bytes

Raw
Copy raw file
Download raw file
Open symbols panel
Edit and raw actions

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17

{

"domain": "webostv",

"name": "LG webOS TV",

"codeowners": ["@thecode"],

"config_flow": true,

"documentation": "https://www.home-assistant.io/integrations/webostv",

"integration_type": "device",

"iot_class": "local_push",

"loggers": ["aiowebostv"],

"quality_scale": "platinum",

"requirements": ["aiowebostv==0.9.2"],

"ssdp": [

{

"st": "urn:lge-com:service:webos-second-screen:1"

}

]

}

You can’t perform that action at this time.