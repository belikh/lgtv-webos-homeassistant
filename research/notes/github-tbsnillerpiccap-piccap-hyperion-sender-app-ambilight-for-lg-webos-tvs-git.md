---
title: 'GitHub - TBSniller/piccap: PicCap - Hyperion Sender App | Ambilight for LG
  WebOS TVs · GitHub'
id: github-tbsnillerpiccap-piccap-hyperion-sender-app-ambilight-for-lg-webos-tvs-git
tags:
- lgtv-webos-ha-root-1a89ff
- locus-companion-lifecycle-enact-vs-js-service-vs-systemd-persistence
created: '2026-08-28T02:13:41.352795Z'
updated: '2026-08-28T02:34:44.189776Z'
source: https://github.com/TBSniller/piccap
source_domain: github.com
fetched_at: '2026-08-28T02:13:41.351221Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: code
deprecated: false
---

GitHub - TBSniller/piccap: PicCap - Hyperion Sender App | Ambilight for LG WebOS TVs · GitHub

Skip to content

Search/

Sign inSign up
Appearance settings

You signed in with another tab or window. Reload to refresh your session.
You signed out in another tab or window. Reload to refresh your session.
You switched accounts on another tab or window. Reload to refresh your session.

Dismiss alert

{{ message }}

TBSniller

/

piccap

Public

Notifications
You must be signed in to change notification settings

Fork
39

Star
387

main

BranchesTags

Go to fileCode
Open more actions menu

Latest commit

History297 Commits

297 Commits
Folders and filesNameName
Last commit message
Last commit date

.github

.github

.vscode

.vscode

docs

docs

frontend

frontend

hyperion-webos @ 00c932f

hyperion-webos @ 00c932f

servicefiles

servicefiles

.eslintignore

.eslintignore

.eslintrc.js

.eslintrc.js

.gitignore

.gitignore

.gitmodules

.gitmodules

LICENSE

LICENSE

README.md

README.md

babel.config.json

babel.config.json

package-lock.json

package-lock.json

package.json

package.json

webpack.config.js

webpack.config.js

View all files

Repository files navigation

PicCap - Hyperion Sender App | Ambilight for LG WebOS TVs

What's this?

PicCap?

PicCap is an frontend app, which you can install on your TV, to make TV content capturing as easy as possible. It ships and controls the seperated hyperion-webos background native service, which uses capture interfaces on your TV based on reverse engineering, proccesses the output and sends as result a low quality image to a receiver like Hyperion's flatbuffer server.

On newer TVs there is no official way for capturing DRM-protected content like from Netflix or Amazon. This restriction doesn't take place for content comming from an HDMI input.

So currently as a workaround you can play your media using your PC, FireTV-Stick or Chromecast and still enjoy your LEDs.

Hyperion?

hyperion.ng basicly is a server service, which transforms incomming image data to an LED output. The idea is to have an ambilight like it's known from Philipps TVs.
It is used in DIY-environments, like builded up in this tutorial.

You can also run Hyperion.ng webOS loader or it's fork HyperHDR webOS loader directly on your webOS TV, so you don't need any further hardware, expect of your LED driver. Both apps can be found in Homebrew Channels app repository.

piccap_preview.mp4

This footage is captured on a webOS5-TV using vtCapture as library.

How to install

What do you need?

Root access to your TV

webOS 3.4 or above

Latest version of Homebrew Channel installed, as we take use of its elevate-service script

Brain with some basic knowledge - We haven't encountered any bricks, but standard no warranty clause applies

Easy way

Open Homebrew Channel and install PicCap directly from there.

Manual way

First you will have to build it from scratch, or download pre-compiled IPK from releases.

# Copy IPK to TV
scp /home/[USER]/downloads/org.webosbrew.piccap_[version]_all.ipk root@[TVIP]:/tmp/org.webosbrew.piccap_[version]_all.ipk

# On TV install IPK
luna-send -i -f luna://com.webos.appInstallService/dev/install '{"id":"org.webosbrew.piccap","ipkUrl":"/tmp/org.webosbrew.piccap_[version]_all.ipk","subscribe":true}'

How to use

First start

Wait a few secounds to let the service elevate root permissions through Homebrew Channel-Service. Check status message in bottom right corner, to see when it's done.

Settings

If you use hyperion.ng or HyperHDR loader, you will have to fill 127.0.0.1 as IP address.

Change priority if you have other capture or effect sources for your Hyperion or HyperHDR instance.

Backends

We use different libraries to capture TVs content. These are used by hyperion-webos and described here.

Advanced settings

Some TV models are comptabile with a specific backend, but require a slightly different routine to work reliably. You can find an explaination for  these so called quirks here.

Development

Dependencies

To build PicCap and hyperion-webos you will need:

Node.js

buildroot-nc4

You will also need clang-format-14 if you want to contribute.

How to build

We have tried to make build process as easy as possible. After building all files can be found in ./build.

# Setup buildroot-nc4 (needed for hyperion-webos)
cd /desired/path
wget -O toolchain.tar.gz $TOOLCHAIN_URL_FROM_RELEASES
tar -xvzf toolchain.tar.gz
rm toolchain.tar.gz
arm-webos-linux-gnueabi_sdk-buildroot/relocate-sdk.sh
export TOOLCHAIN_FILE=/desired/path/arm-webos-linux-gnueabi_sdk-buildroot/share/buildroot/toolchainfile.cmake

# Clone project and submodules
git clone --recursive https://github.com/TBSniller/piccap.git
cd ./piccap

# Install node dependencies
npm install

# Build
npm run-script build-all        # Build PicCap & hyperion-webos + deps
npm run-script build-frontend   # Build PicCap only
npm run-script build-backend    # Build hyperion-webos + deps only

# Package IPK-file for TV installation
npm run-script package

Other

Known issues

Expect bugs - This app is still in early development

Attention! New AI options have been added to newer LG models.
Since the 'AI Picture Pro', 'AI Brightness', 'AI Genre Selection', 'AI Image Game Optimizer' and 'AI Game Sound' options use the same recording process as Hyperion WebOS, dropouts may occur during recording. Consequently, a live preview in HyperHDR is temporarily unavailable, and the LEDs also switch off briefly.

Workaround:
Deactivate these options (can be found under “Settings” > ‘General’ > “AI service”). Depending on the model, this can also be done under “Settings” > ‘General’ > “AI service”.

Please see hyperion-webos#known-issues for issues regarding the backend service. - This only is the frontend application and has nothing to do with capture related things!

Version tracker is available in hyperion-webos#16.

Credits

This project would never ever exist without help from @Mariotaku and @Informatic.
Both programmed important things at the beginning of this whole ambilight project. @tuxuser also made some important changes in the mid of this project.

Share them some love if you can, they taught and showed me alot!

You should also check out the other contributors. Some nice enhancements wouldn't be there without them :)

Check out OpenLGs-Discord server, if you have some questions. You will find a very helpful community. <3

Screenshots

About
PicCap - Hyperion Sender App | Ambilight for LG WebOS TVs
Topics
ambilighthomebrewhyperionlgwebos
Resources
Readme
MIT license
Activity
Stars
387 stars
Watchers
15 watching
Forks
39 forks
Report repository

Releases

Used by

Contributors

Languages

You can’t perform that action at this time.