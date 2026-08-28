---
title: GitHub - webosbrew/hyperion.ng-webos-loader · GitHub
id: github-webosbrewhyperionng-webos-loader-github
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:15:48.637467Z'
source: https://github.com/webosbrew/hyperion.ng-webos-loader
source_domain: github.com
fetched_at: '2026-08-28T02:15:44.412530Z'
fetch_provider: builtin
status: draft
type: note
deprecated: false
summary: GitHub - webosbrew/hyperion.ng-webos-loader · GitHub
---

GitHub - webosbrew/hyperion.ng-webos-loader · GitHub

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

hyperion.ng-webos-loader

Public

Notifications
You must be signed in to change notification settings

Fork
10

Star
15

master

BranchesTags

Go to fileCode
Open more actions menu

Latest commit

History112 Commits

112 Commits
Folders and filesNameName
Last commit message
Last commit date

.github/workflows

.github/workflows

assets

assets

frontend

frontend

lib

lib

service

service

tools

tools

.enyoconfig

.enyoconfig

.eslintrc.json

.eslintrc.json

.gitignore

.gitignore

.gitmodules

.gitmodules

.prettierignore

.prettierignore

.prettierrc

.prettierrc

README.md

README.md

appinfo.json

appinfo.json

build.sh

build.sh

build_hyperion_ng.sh

build_hyperion_ng.sh

package-lock.json

package-lock.json

package.json

package.json

View all files

Repository files navigation

Hyperion.NG for webOS

Binaries are available through Homebrew Channel.

Building

Requirements

Linux host system

buildroot-nc4, a toolchain targeting webOS

Git

CMake

npm

Instructions

Build Hyperion.NG:

./build_hyperion_ng.sh

Build webOS frontend/service:

./build.sh

Both scripts take the environment variable TOOLCHAIN_DIR, defaulting to $HOME/arm-webos-linux-gnueabi_sdk-buildroot.

To provide a different path, run export TOOLCHAIN_DIR=/your/toolchain/path before executing the respective scripts.

Two other environment variables can also be used to configure build_hyperion_ng.sh:

HYPERION_NG_REPO - Repository from which to obtain Hyperion.NG. Defaults to https://github.com/hyperion-project/hyperion.ng.

HYPERION_NG_BRANCH - Which branch to check out from the above repo. Defaults to master.

Related projects

Hyperion.NG - Ambient lighting service/daemon

hyperion-webos - Video grabber for webOS

PicCap - Frontend for hyperion-webos video grabber

Credits

@Smx-smx

@TBSniller

@Informatic

@Mariotaku

@Lord-Grey

@Paulchen-Panther

@chbartsch

throwaway96

About
No description, website, or topics provided.
Resources
Readme
Activity
Custom properties
Stars
15 stars
Watchers
1 watching
Forks
10 forks
Report repository

Releases

Packages

Used by

Contributors

Languages

You can’t perform that action at this time.