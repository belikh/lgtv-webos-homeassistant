---
title: 'GitHub - openlgtv/epk2extract: Extraction tool for LG, Hisense, Sharp, Philips/TPV,
  Thompson and similar TVs/Embedded Devices · GitHub'
id: github-openlgtvepk2extract-extraction-tool-for-lg-hisense-sharp-philipstpv-thomp
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:14:28.011388Z'
source: https://github.com/openlgtv/epk2extract
source_domain: github.com
fetched_at: '2026-08-28T02:14:28.009973Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: code
deprecated: false
---

GitHub - openlgtv/epk2extract: Extraction tool for LG, Hisense, Sharp, Philips/TPV, Thompson and similar TVs/Embedded Devices · GitHub

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

openlgtv

/

epk2extract

Public

Notifications
You must be signed in to change notification settings

Fork
93

Star
404

master

BranchesTags

Go to fileCode
Open more actions menu

Latest commit

History749 Commits

749 Commits
Folders and filesNameName
Last commit message
Last commit date

.github/workflows

.github/workflows

cmake-modules

cmake-modules

include

include

keys

keys

src

src

.cirrus.yml

.cirrus.yml

.editorconfig

.editorconfig

.gitattributes

.gitattributes

.gitignore

.gitignore

.sonarcloud_gen.sh

.sonarcloud_gen.sh

AUTHORS

AUTHORS

CMakeLists.txt

CMakeLists.txt

COPYING

COPYING

README.md

README.md

build.sh

build.sh

code_format.sh

code_format.sh

partinfo.py

partinfo.py

sonar-project.properties

sonar-project.properties

View all files

Repository files navigation

epk2extract

Join on Discord: https://discord.gg/xWqRVEm

epk2extract is a tool that can extract, decrypt, convert multiple file formats that can be found in LG TV sets and similar devices.

Supported Formats:

NOTE: To unpack epk v2 and v3 you need proper AES and RSA keys for decryption. To get them you will need to dump them from a running TV.

NOTE: To decrypt PVR recordings you need a dump of the unique AES-128 key from your TV

Format
Notes

epk v1
First version of epk format, not encrypted and not signed

epk v2
Introduces signing and encryption, keys needed

epk v3
Introduced with WebOS. Keys needed

Mediatek pkg
UPG/PKG files used by Hisense/Sharp/Philips (missing Philips AES key) and possibly others

Philips "fusion"
Upgrade files used by some Philips TVs

squashfs

cramfs

lz4
Slightly modified version with header magic

lzo

gzip

jffs2

lzhs
Special compression for MTK bootloaders (boot.pak, tzfw.pak), uses lzss + huffman

lzhs_fs
LZHS compressed filesystem used in MTK Upgrade files for the external writable partition (3rdw)

mtdinfo/partinfo
LG Partition table format (mtdi.pak, part.pak)

str/pif
PVR recording format that can be found in netcast models

sym
LG Debugging symbols. Can extract function names and addresses to an IDA script file (idc)

Although epk2extract is only tested on LG firmware files, you may use it to extract other files like a general unpack tool, as long as they are supported according to the table above.

!!WARNING!!

epk2extract isn't designed to repack files

If you wish to repack modified files, follow the openlgtv wiki/forum, and do it in a Linux environment (no cygwin)

Don't repack files extracted in cygwin environment

In any case, you do so at your own risk

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE

Tools:
Description

lzhsenc
Compresses a given file with lzhs algorithm

lzhs_scanner
Scans a given file to find lzhs files, and extracts them

idb_extract
Extracts Image Database (IDB) files that can be found in LG firmwares

jffs2extract
Extracts JFFS2 images. Supports various compression algorithms

To compile on Linux:

Install build dependencies:

Ubuntu/Debian:

apt-get install git build-essential cmake liblzo2-dev libssl-dev libc6-dev zlib1g-dev

Mandriva/Mageia:

urpmi git task-c++-devel cmake liblzo-devel libopenssl-devel glibc-devel --auto

Build it

./build.sh

After building, epk2extract can be found in ./build_<platform>/

To compile on Cygwin:

Install Cygwin and during setup select following packages:

Devel -> gcc-g++, git, cmake, make
Libs  -> liblzo2-devel, zlib-devel
Net   -> openssl-devel
Utils -> ncurses

Build it

./build.sh

The build script automatically copies required shared libraries to the ./build_cygwin/ folder, so you can use epk2extract standalone/portable without a full cygwin installation.

=====================

How to speed up extraction process

You can build the test build, which contains compiler optimizations, with this command

CMAKE_FLAGS=-DCMAKE_BUILD_TYPE=Test ./build.sh

The Test build is orders of magnitude faster than the Debug build

To use:

Put *.pem and AES.key files in the same directory as the epk2extract binary.

Run it via sudo/fakeroot to avoid warnings (while extracting device nodes from rootfs):

fakeroot ./epk2extract file

To get IDC from SYM run:

./epk2extract xxxxxxxx.sym

To decode part.pak or mtdi.pak do:

./epk2extract part.pak

Or use partinfo.py (deprected)

python partinfo.py part.pak

About
Extraction tool for LG, Hisense, Sharp, Philips/TPV, Thompson and similar TVs/Embedded Devices
Topics
binaryepkextractfirmwareiotjffs2smarttvtool
Resources
Readme
GPL-2.0 license
Activity
Custom properties
Stars
404 stars
Watchers
25 watching
Forks
93 forks
Report repository

Releases

Packages

Used by

Contributors

Languages

You can’t perform that action at this time.