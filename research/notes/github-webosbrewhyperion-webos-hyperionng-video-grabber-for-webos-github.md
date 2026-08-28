---
title: 'GitHub - webosbrew/hyperion-webos: hyperion.ng video grabber for webOS · GitHub'
id: github-webosbrewhyperion-webos-hyperionng-video-grabber-for-webos-github
tags:
- lgtv-webos-ha-root-1a89ff
- locus-companion-lifecycle-enact-vs-js-service-vs-systemd-persistence
created: '2026-08-28T02:13:43.004331Z'
updated: '2026-08-28T02:34:44.820265Z'
source: https://github.com/webosbrew/hyperion-webos
source_domain: github.com
fetched_at: '2026-08-28T02:13:43.002619Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: code
deprecated: false
---

GitHub - webosbrew/hyperion-webos: hyperion.ng video grabber for webOS · GitHub

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

webosbrew

/

hyperion-webos

Public

Notifications
You must be signed in to change notification settings

Fork
36

Star
178

main

BranchesTags

Go to fileCode
Open more actions menu

Latest commit

History334 Commits

334 Commits
Folders and filesNameName
Last commit message
Last commit date

.github/workflows

.github/workflows

fbs

fbs

libyuv

libyuv

lint

lint

src

src

tv-native-apis @ 4a48765

tv-native-apis @ 4a48765

unicapture

unicapture

.clang-format

.clang-format

.gitignore

.gitignore

.gitmodules

.gitmodules

CMakeLists.txt

CMakeLists.txt

FLATBUFFERS.md

FLATBUFFERS.md

GenerateVersionHeader.cmake

GenerateVersionHeader.cmake

LICENSE

LICENSE

README.md

README.md

View all files

Repository files navigation

hyperion-webos

hyperion.ng grabber for
webOS.

This piece of software does high-framerate/low-latency capture of contents
displayed directly on webOS TVs and transmits these frames to hyperion.ng over
the network.

Requires root.

Based on reverse-engineered internal system APIs. Still highly experimental.

If you are looking for a user-friendly UI that ships this piece of software check PicCap. This application mainly is the underlaying service for this software.

Known issues

Everything is based on highly platform-specific reverse-engineered internal
system APIs. Standard no-warranty clauses apply.

Backends

This software uses multiple capture backends, that may work differently on some
webOS versions/hardware platforms.

Now, with unicapture, video and ui backends are seperated and only blended together if desired.

This means, UI or video capture can be turned on/off individually.

Video capturing

Backend
Description
webOS

libdile_vt
Low-level library used internally by libvt
3.x+

libvtcapture
High-level video capture library
5.x+

UI capturing

Backend
Description
webOS

libgm
UI capture library for older TVs
3.x+

libhalgal
UI capture library for newer TVs
5.x+

Quirks

Some TV models generally are comptabile with a specific backend, but require a slightly different routine
to work reliably.

In this case, to not need totally different binaries, we implemented quirks, which can be toggled on if needed.

Currently the following ones exist:

Backend
Quirk
Description
Flag

DILE_VT
QUIRK_DILE_VT_CREATE_EX
Use DILE_VT_CreateEx instead of DILE_VT_Create
0x1

DILE_VT
QUIRK_DILE_VT_NO_FREEZE_CAPTURE
Do not freeze frame before capturing (higher fps)
0x2

DILE_VT VTCAPTURE
QUIRK_ALTERNATIVE_DUMP_LOCATION
(webOS 3.4, VTCAPTURE) Use alternative dump location (vtcapture: SCALER_OUTPUT)
0x4

VTCAPTURE
QUIRK_ALTERNATIVE_DUMP_LOCATION_2
Use alternative dump location SCALER_INPUT
0x8

VTCAPTURE
QUIRK_ALTERNATIVE_DUMP_LOCATION_3
Use alternative dump location BLENDED_OUTPUT
0x10

VTCAPTURE
QUIRK_ALTERNATIVE_DUMP_LOCATION_4
Use alternative dump location OSD_OUTPUT
0x20

VTCAPTURE
QUIRK_ALTERNATIVE_DUMP_LOCATION_5
Use alternative dump location HISTOGRAM_OUTPUT
0x40

VTCAPTURE
QUIRK_VTCAPTURE_FORCE_CAPTURE
Use of a custom kernel module for reenable capture in special situation
0x100

They can be provided in config.json via the {"quirks": 0} field or on commandline via --quirks.

Easiest way though -> Use PicCap GUI!

You can assemble the final quirks value by using a bitwise-OR,
e.g. quirks_value = (quirk_val | quirk_val2 | quirk_val3).
The calculator is your friend ;)

You can find them defined here: Source code file

Building

You will need buildroot-nc4
(or, theoretically, some other webOS toolchain).

Set TOOLCHAIN_FILE to the path of buildroot-nc4's toolchainfile.cmake.
For example:

export TOOLCHAIN_FILE='/opt/arm-webos-linux-gnueabi_sdk-buildroot/share/buildroot/toolchainfile.cmake'

Then run the following commands:

git clone --recursive https://github.com/webosbrew/hyperion-webos.git
mkdir hyperion-webos/build
cd hyperion-webos/build
cmake .. -DCMAKE_TOOLCHAIN_FILE="${TOOLCHAIN_FILE}"
make hyperion-webos gm_backend halgal_backend dile_vt_backend vtcapture_backend

Running

hyperion-webos together with *_backend.so libraries need to be copied onto
the TV, eg. into /tmp directory.

cd /tmp
./hyperion-webos --help
./hyperion-webos -b libdile_vt -a 10.0.0.1

Issues reporting

When reporting issues please include result of the following command:

grep -h -E '"(hardware_id|core_os_release|product_id|webos_manufacturing_version|board_type)"' /var/run/nyx/*

This contains model/hardware/region/software version, without any uniquely
identifiable information.

If a segfault/crash occurs, a crashlog file will be generated in /var/log/reports/librdx
or /tmp/faultmanager/crash/. This contains process memory dump and backtrace,
but should not contain any uniquely identifiable information. (though, this is not guaranteed)

Code style / linting

To ensure a common codestyle on contributions, please ensure your submission is linted.
The linting script depends on python3 / clang-format to be installed.

Run the linting / formatter script like this:

python lint/run-clang-format.py --extensions "c,h,cpp" --color auto --recursive --inplace true ./src

To make a dry-run (and not auto-fix), omit the --inplace true parameter.

About
hyperion.ng video grabber for webOS
Topics
hyperionhyperion-projectweboswebos-homebrew
Resources
Readme
MIT license
Activity
Custom properties
Stars
178 stars
Watchers
14 watching
Forks
36 forks
Report repository

Releases

Packages

Used by

Contributors

Languages

You can’t perform that action at this time.