---
title: bscpylgtv/bscpylgtv/manifest.py at master · chros73/bscpylgtv · GitHub
id: bscpylgtvbscpylgtvmanifestpy-at-master-chros73bscpylgtv-github
tags:
- lgtv-webos-ha-root-1a89ff
- locus-rooted-acl-boundary-stock-vs-root-luna-matrix
created: '2026-08-28T02:26:30.696954Z'
source: https://github.com/chros73/bscpylgtv/blob/master/bscpylgtv/manifest.py
source_domain: github.com
fetched_at: '2026-08-28T02:26:30.695037Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: code
deprecated: false
---

bscpylgtv/bscpylgtv/manifest.py at master · chros73/bscpylgtv · GitHub

Skip to content

Search/

Sign inSign up
Appearance settings

You signed in with another tab or window. Reload to refresh your session.
You signed out in another tab or window. Reload to refresh your session.
You switched accounts on another tab or window. Reload to refresh your session.

Dismiss alert

{{ message }}

chros73

/

bscpylgtv

Public

Notifications
You must be signed in to change notification settings

Fork
30

Star
343

FilesExpand file tree

master

/
manifest.pyCopy path

Blame
More file actions

Blame
More file actions

Latest commit

HistoryHistory

History

executable file·
77 lines (76 loc) · 2.43 KB

master

/
manifest.pyCopy pathTop

File metadata and controls

Code

Blame

executable file·
77 lines (76 loc) · 2.43 KB

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
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77

SIGNATURE = (

"eyJhbGdvcml0aG0iOiJSU0EtU0hBMjU2Iiwia2V5SWQiOiJ0ZXN0LXNpZ25pbm"

"ctY2VydCIsInNpZ25hdHVyZVZlcnNpb24iOjF9.hrVRgjCwXVvE2OOSpDZ58hR"

"+59aFNwYDyjQgKk3auukd7pcegmE2CzPCa0bJ0ZsRAcKkCTJrWo5iDzNhMBWRy"

"aMOv5zWSrthlf7G128qvIlpMT0YNY+n/FaOHE73uLrS/g7swl3/qH/BGFG2Hu4"

"RlL48eb3lLKqTt2xKHdCs6Cd4RMfJPYnzgvI4BNrFUKsjkcu+WD4OO2A27Pq1n"

"50cMchmcaXadJhGrOqH5YmHdOCj5NSHzJYrsW0HPlpuAx/ECMeIZYDh6RMqaFM"

"2DXzdKX9NmmyqzJ3o/0lkk/N97gfVRLW5hA29yeAwaCViZNCP8iC9aO0q9fQoj"

"oa7NQnAtw=="

)

MANIFEST = {

"appVersion": "1.1",

"manifestVersion": 1,

"deviceName": "bscpylgtv",

"permissions": [

"LAUNCH",

"LAUNCH_WEBAPP",

"APP_TO_APP",

"CLOSE",

"TEST_OPEN",

"TEST_PROTECTED",

"CONTROL_AUDIO",

"CONTROL_DISPLAY",

"CONTROL_INPUT_JOYSTICK",

"CONTROL_INPUT_MEDIA_RECORDING",

"CONTROL_INPUT_MEDIA_PLAYBACK",

"CONTROL_INPUT_TV",

"CONTROL_POWER",

"CONTROL_TV_SCREEN",

"READ_APP_STATUS",

"READ_CURRENT_CHANNEL",

"READ_INPUT_DEVICE_LIST",

"READ_NETWORK_STATE",

"READ_RUNNING_APPS",

"READ_TV_CHANNEL_LIST",

"WRITE_NOTIFICATION_TOAST",

"READ_POWER_STATE",

"READ_COUNTRY_INFO",

"CONTROL_INPUT_TEXT",

"CONTROL_MOUSE_AND_KEYBOARD",

"READ_INSTALLED_APPS",

"READ_SETTINGS",

"READ_STORAGE_DEVICE_LIST",

],

"signatures": [{"signature": SIGNATURE, "signatureVersion": 1}],

"signed": {

"appId": "com.lge.test",

"created": "20140509",

"localizedAppNames": {

"": "LG Remote App",

"ko-KR": "리모컨 앱",

"zxx-XX": "ЛГ Rэмotэ AПП",

},

"localizedVendorNames": {"": "LG Electronics"},

"permissions": [

"TEST_SECURE",

"CONTROL_INPUT_TEXT",

"CONTROL_MOUSE_AND_KEYBOARD",

"READ_INSTALLED_APPS",

"READ_LGE_SDX",

"READ_NOTIFICATIONS",

"SEARCH",

"WRITE_SETTINGS",

"WRITE_NOTIFICATION_ALERT",

"CONTROL_POWER",

"READ_CURRENT_CHANNEL",

"READ_RUNNING_APPS",

"READ_UPDATE_INFO",

"UPDATE_FROM_REMOTE_APP",

"READ_LGE_TV_INPUT_EVENTS",

"READ_TV_CURRENT_TIME",

],

"serial": "2f930e2d2cfe083771f68e4fe7bb07",

"vendorId": "com.lge",

},

}

You can’t perform that action at this time.