---
title: GitHub - webosbrew/hyperhdr-webos-loader · GitHub
id: github-webosbrewhyperhdr-webos-loader-github
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:14:39.507314Z'
source: https://github.com/webosbrew/hyperhdr-webos-loader
source_domain: github.com
fetched_at: '2026-08-28T02:14:39.505969Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: code
deprecated: false
---

GitHub - webosbrew/hyperhdr-webos-loader · GitHub

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

hyperhdr-webos-loader

Public

Notifications
You must be signed in to change notification settings

Fork
36

Star
57

master

BranchesTags

Go to fileCode
Open more actions menu

Latest commit

History107 Commits

107 Commits
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

resources

resources

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

babel.config.json

babel.config.json

build.sh

build.sh

build_hyperhdr.sh

build_hyperhdr.sh

package-lock.json

package-lock.json

package.json

package.json

View all files

Repository files navigation

HyperHDR for WebOS

Binaries are ready to install from Homebrew Channel

Requirements

Linux host system

WebOS buildroot toolchain - arm-webos-linux-gnueabi_sdk-buildroot (https://github.com/openlgtv/buildroot-nc4/releases)

git

CMake

npm

Build

Build hyperhdr: ./build_hyperhdr.sh

Build webOS frontend/service: ./build.sh

Both scripts take an environment variable TOOLCHAIN_DIR, defaulting to: $HOME/arm-webos-linux-gnueabi_sdk-buildroot

To provide an individual path, call export TOOLCHAIN_DIR=/your/toolchain/path before executing respective scripts.

build_hyperhdr.sh also takes two other environment variables:

HYPERHDR_REPO

HYPERHDR_BRANCH

References

Hyperion.NG

HyperHDR

Video grabber of webOS: hyperion-webos

Frontend of Video grabber hyperion-webos: piccap

Credits

@Smx-smx
@TBSniller
@Informatic
@Mariotaku
@Lord-Grey
@Paulchen-Panther
@Awawa
@chbartsch

About
No description, website, or topics provided.
Resources
Readme
Activity
Custom properties
Stars
57 stars
Watchers
0 watching
Forks
36 forks
Report repository

Releases

Packages

Used by

Contributors

Languages

You can’t perform that action at this time.