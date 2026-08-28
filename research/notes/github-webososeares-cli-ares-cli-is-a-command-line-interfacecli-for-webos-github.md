---
title: 'GitHub - webosose/ares-cli: ares-cli is a command-line interface(CLI) for
  webOS · GitHub'
id: github-webososeares-cli-ares-cli-is-a-command-line-interfacecli-for-webos-github
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:16:14.405912Z'
source: https://github.com/webosose/ares-cli
source_domain: github.com
fetched_at: '2026-08-28T02:16:11.581936Z'
fetch_provider: builtin
status: draft
type: note
deprecated: false
summary: 'GitHub - webosose/ares-cli: ares-cli is a command-line interface(CLI) for
  webOS · GitHub'
---

GitHub - webosose/ares-cli: ares-cli is a command-line interface(CLI) for webOS · GitHub

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

webosose

/

ares-cli

Public

Notifications
You must be signed in to change notification settings

Fork
24

Star
60

main

BranchesTags

Go to fileCode
Open more actions menu

Latest commit

History77 Commits

77 Commits
Folders and filesNameName
Last commit message
Last commit date

bin

bin

files

files

lib

lib

spec

spec

.eslintignore

.eslintignore

.eslintrc.js

.eslintrc.js

.gitignore

.gitignore

APIs.js

APIs.js

CHANGELOG.md

CHANGELOG.md

LICENSE

LICENSE

README.md

README.md

npm-shrinkwrap.json

npm-shrinkwrap.json

package.json

package.json

View all files

Repository files navigation

ares-cli

Warning
We moved to @webos-tools/cli. In the future, we plan to develop and maintain a single webOS CLI to support multi webOS in @webos-tools/cli. This repository has been deprecated since March 4, 2024.

ares-cli is a command-line interface (CLI) for webOS. It provides a collection of commands used for creating, packaging, installing, and launching apps or services in the command line environment. ares-cli lets you develop and test apps or services without using any IDE.

Installation

To install ares-cli, use npm. It is recommended to install ares-cli globally. For Linux and macOS, you might need the sudo command.

$ npm install -g @webosose/ares-cli

Note: Node version 10.24.1 to 14.15.1 are recommended.

Compatibility

Our release cycle is independent of webOS OSE and Auto.
We recommend using the latest CLI. The latest CLI is compatible with the latest webOS OSE and Auto"

For information about the CLI previous version and compatible with platform, see the CLI Release Notes.

Command List

The list of ares-cli commands is as follows:

ares-generate: Creates a webOS app or service from templates.

ares-package: Packages the app or services into a package file.

ares-setup-device: Manages the target devices.

ares-install: Installs the app or service on the target device.

ares-launch: Launches or terminates the app.

ares-inspect: Enables Web Inspector or Node's Inspector for debugging web app or JS service.

ares-server: Runs the Web server for testing local app file.

ares-shell: Executes shell commands in the target device.

ares-push: Pushes file(s) from a host machine to a target device.

ares-pull: Pulls file(s) from a target device to a host machine.

ares-device: Displays the device information.

ares-log: Shows or saves logs of webOS apps and services.

Documentations

For more details about how to use ares-cli, see the webOS OSE CLI User Guide.

For step-by-step guides for developing apps or services, see the tutorials.

Developing External Web Apps

Developing External JS Services

Developing External QML Apps

Developing External Native Apps

Developing External Native Services

Test Commands

You can test the ares-cli commands and their options to check their validity. The test is performed by jasmine or npm test.

Before You Begin

Turn on the webOS device.

Check the IP address and SSH port number.

Enable the developer mode.

webOS OSE: Already enabled by default.

webOS Auto: Enable it in the Settings app.

The following key-value pairs are the default configurations for the test.

Key
Value

device
emulator

ip
127.0.0.1

port
6622

Test Usages

Test with default configurations.

$ jasmine

or

$ jasmine device=emulator, ip=127.0.0.1, port=6622

Test with specific configurations. (It can be omitted when using port 22.)

$ jasmine --device=webOS --ip=192.168.0.12

Test with specific port configurations.

$ jasmine --device=webOS --ip=192.168.0.12 --port=24

Test ares-generate command.

$ jasmine --device=webOS --ip=192.168.0.12 --port=24 spec/jsSpec/ares-generate.js

Test using npm command npm test instead of jasmine.

$ npm test --device=webOS --ip=192.168.0.12 --port=24

Contributing

The step-by-step guide to contribute is as follows:

Fork: Fork source from ares-cli repository.

Create a new branch: Create a branch from develop branch.

Implement: Implement the source codes and git push the changes to the new branch.

Create a pull request: Create a pull request. When you write a commit message, make sure you follow Commit Message Guidelines.

Submit the pull request to the owner.

Commit Message Guidelines

The following is an example of the commit message.

Change ares-device-info to ares-device

:Release Notes:
Expand the scope of ares-device-info command by changing its name

:Detailed Notes:
For now, the scope of the ares-device-info command seems to narrow,
so it is hard to add other options to the command (such as capture)
- Rename ares-device-info.js to ares-device.js
- Add --system-info and --session-info options
- Update ares-device TC

:Testing Performed:
1. All unit test passed
2. ESLint done
3. Check the below commands
$ ares-device
$ ares-device --system-info
$ ares-device --session-info

:Issues Addressed:
[ISSUE-1] Change ares-device-info to ares-device

Summary: Describe a summary of the pull request. Make sure you capitalize the first letter of the summary.

Release Notes: Describe what this commit implements.

Detailed Notes: Describe the problems of this commit and how to fix them.

Testing Performed: Describe detailed descriptions of the testing you performed.

Unit test: Run CLI unit test via jasmine on the target device or emulator and write the result. All unit tests must be passed.

ESlint: Run eslint on ares-cli root directory and write the result. No warning/error would be allowed.

Detail test steps with CLI commands : Write the commands to verify your changes. Be sure that the maintainers can check the changes by running that commands.

Issues Addressed: Write an issue number and its summary.

Copyright and License Information

Unless otherwise specified, all content, including all source code files and documentation files in this repository are:

Copyright (c) 2020-2023 LG Electronics, Inc.

All content, including all source code files and documentation files in this repository except otherwise noted are:

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0

About
ares-cli is a command-line interface(CLI) for webOS
Topics
clilgweboswebos-applicationwebos-osewebos-servicewebosose
Resources
Readme
Apache-2.0 license
Activity
Custom properties
Stars
60 stars
Watchers
6 watching
Forks
24 forks
Report repository

Releases

Packages

Used by

Contributors

Languages

You can’t perform that action at this time.