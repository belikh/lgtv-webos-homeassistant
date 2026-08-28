---
title: bscpylgtv/bscpylgtv/endpoints.py at master · chros73/bscpylgtv · GitHub
id: bscpylgtvbscpylgtvendpointspy-at-master-chros73bscpylgtv-github
tags:
- lgtv-webos-ha-root-1a89ff
- locus-rooted-acl-boundary-stock-vs-root-luna-matrix
- locus-transport-discovery-security-pairing-ws-mqtt-hybrid
created: '2026-08-28T02:26:30.844290Z'
updated: '2026-08-28T02:44:17.133377Z'
source: https://github.com/chros73/bscpylgtv/blob/master/bscpylgtv/endpoints.py
source_domain: github.com
fetched_at: '2026-08-28T02:26:30.842197Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: code
deprecated: false
---

bscpylgtv/bscpylgtv/endpoints.py at master · chros73/bscpylgtv · GitHub

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
endpoints.pyCopy path

Blame
More file actions

Blame
More file actions

Latest commit

HistoryHistory

History

executable file·
75 lines (74 loc) · 3.58 KB

master

/
endpoints.pyCopy pathTop

File metadata and controls

Code

Blame

executable file·
75 lines (74 loc) · 3.58 KB

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

# webOS TV public SSAP API endpoints

GET_SERVICES = "api/getServiceList"

SET_MUTE = "audio/setMute"

GET_AUDIO_STATUS = "audio/getStatus"

GET_VOLUME = "audio/getVolume"

SET_VOLUME = "audio/setVolume"

VOLUME_UP = "audio/volumeUp"

VOLUME_DOWN = "audio/volumeDown"

GET_CURRENT_APP_INFO = "com.webos.applicationManager/getForegroundAppInfo"

GET_APPS = "com.webos.applicationManager/listLaunchPoints"

GET_APPS_ALL = "com.webos.applicationManager/listApps"

SEND_ENTER = "com.webos.service.ime/sendEnterKey"

SEND_DELETE = "com.webos.service.ime/deleteCharacters"

INSERT_TEXT = "com.webos.service.ime/insertText"

GET_SOFTWARE_INFO = "com.webos.service.update/getCurrentSWInformation"

MEDIA_PLAY = "media.controls/play"

MEDIA_STOP = "media.controls/stop"

MEDIA_PAUSE = "media.controls/pause"

MEDIA_REWIND = "media.controls/rewind"

MEDIA_FAST_FORWARD = "media.controls/fastForward"

MEDIA_CLOSE = "media.viewer/close"

POWER_OFF = "system/turnOff"

SHOW_MESSAGE = "system.notifications/createToast"

CREATE_ALERT = "system.notifications/createAlert"

CLOSE_ALERT = "system.notifications/closeAlert"

LAUNCHER_CLOSE = "system.launcher/close"

GET_SYSTEM_INFO = "system/getSystemInfo"

LAUNCH = "system.launcher/launch"

OPEN = "system.launcher/open"

GET_SYSTEM_SETTINGS = "settings/getSystemSettings"

SET_SYSTEM_SETTINGS = "settings/setSystemSettings"

TV_CHANNEL_DOWN = "tv/channelDown"

TV_CHANNEL_UP = "tv/channelUp"

GET_TV_CHANNELS = "tv/getChannelList"

GET_CHANNEL_INFO = "tv/getChannelProgramInfo"

GET_CURRENT_CHANNEL = "tv/getCurrentChannel"

GET_INPUTS = "tv/getExternalInputList"

SET_CHANNEL = "tv/openChannel"

SET_INPUT = "tv/switchInput"

TAKE_SCREENSHOT = "tv/executeOneShot"

CLOSE_WEB_APP = "webapp/closeWebApp"

INPUT_SOCKET = "com.webos.service.networkinput/getPointerInputSocket"

CALIBRATION = "externalpq/setExternalPqData"

GET_CALIBRATION = "externalpq/getExternalPqData"

GET_SOUND_OUTPUT = "com.webos.service.apiadapter/audio/getSoundOutput"

CHANGE_SOUND_OUTPUT = "com.webos.service.apiadapter/audio/changeSoundOutput"

GET_POWER_STATE = "com.webos.service.tvpower/power/getPowerState"

TURN_OFF_SCREEN = "com.webos.service.tvpower/power/turnOffScreen"

TURN_ON_SCREEN = "com.webos.service.tvpower/power/turnOnScreen"

GET_CONFIGS = "config/getConfigs"

LIST_DEVICES = "com.webos.service.attachedstoragemanager/listDevices"

SHOW_INPUT_PICKER = "com.webos.surfacemanager/showInputPicker"

SET_DEVICE_INFO = "com.webos.service.eim/setDeviceInfo"

REQUEST_REBOOT = "com.webos.service.devicereset/requestReboot"

# endpoints below were removed at some point

SET_3D_ON = "com.webos.service.tv.display/set3DOn"

SET_3D_OFF = "com.webos.service.tv.display/set3DOff"

TURN_OFF_SCREEN_WO4 = "com.webos.service.tv.power/turnOffScreen"

TURN_ON_SCREEN_WO4 = "com.webos.service.tv.power/turnOnScreen"

POWER_ON = "system/turnOn"

SET_PIN = "pairing/setPin"

# webOS TV internal Luna API endpoints

LUNA_SET_SYSTEM_SETTINGS = "com.webos.settingsservice/setSystemSettings"

LUNA_SET_DEVICE_INFO = "com.webos.service.eim/setDeviceInfo"

LUNA_SET_TPC = "com.webos.service.oledepl/setTemporalPeakControl"

LUNA_SET_GSR = "com.webos.service.oledepl/setGlobalStressReduction"

LUNA_SET_WHITE_BALANCE = "com.webos.service.pqcontroller/setWhiteBalance"

LUNA_SET_PQ_PROPERTIES = "com.webos.service.pqcontroller/setProperties"

# access to endpoints below were disabled at some point

LUNA_SET_CONFIGS = "com.webos.service.config/setConfigs"

LUNA_TURN_ON_SCREEN_SAVER = "com.webos.service.tvpower/power/turnOnScreenSaver"

LUNA_REBOOT_TV = "com.webos.service.tvpower/power/reboot"

LUNA_REBOOT_TV_WO4 = "com.webos.service.tv.power/reboot"

LUNA_EJECT_DEVICE = "com.webos.service.attachedstoragemanager/ejectDevice"

You can’t perform that action at this time.