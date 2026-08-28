---
title: 'GitHub - home-assistant-libs/aiowebostv: Python library to control LG webOS
  based TV devices · GitHub'
id: github-home-assistant-libsaiowebostv-python-library-to-control-lg-webos-based-tv
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:15:23.379504Z'
source: https://github.com/home-assistant-libs/aiowebostv
source_domain: github.com
fetched_at: '2026-08-28T02:15:23.378004Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: code
deprecated: false
---

GitHub - home-assistant-libs/aiowebostv: Python library to control LG webOS based TV devices · GitHub

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

home-assistant-libs

/

aiowebostv

Public

Notifications
You must be signed in to change notification settings

Fork
16

Star
55

main

BranchesTags

Go to fileCode
Open more actions menu

Latest commit

History703 Commits

703 Commits
Folders and filesNameName
Last commit message
Last commit date

.github

.github

aiowebostv

aiowebostv

examples

examples

.gitignore

.gitignore

.pre-commit-config.yaml

.pre-commit-config.yaml

AI_POLICY.md

AI_POLICY.md

LICENSE

LICENSE

README.md

README.md

pyproject.toml

pyproject.toml

requirements.txt

requirements.txt

requirements_dev.txt

requirements_dev.txt

requirements_lint.txt

requirements_lint.txt

View all files

Repository files navigation

aiowebostv

Python library to control LG webOS based TV devices.

Based on:

aiopylgtv library at https://github.com/bendavid/aiopylgtv

bscpylgtv library at https://github.com/chros73/bscpylgtv

Requirements

Python >= 3.11

Install

pip install aiowebostv

Install from Source

Run the following command inside this folder

pip install --upgrade .

Examples

Basic Example:

import asyncio
from pprint import pprint

from aiowebostv import WebOsClient

HOST = "192.168.1.39"
# For first time pairing set key to None
CLIENT_KEY = "140cce792ae045920e14da4daa414582"

async def main():
"""Basic webOS client example."""

client = WebOsClient(HOST, CLIENT_KEY)
await client.connect()

# Store this key for future use
print(f"Client key: {client.client_key}")

pprint(client.tv_info)
pprint(client.tv_state)

await client.disconnect()

if __name__ == "__main__":
asyncio.run(main())

Subscribed State Updates Example:

import asyncio
import dataclasses
import signal
from datetime import UTC, datetime
from pprint import pprint

from aiowebostv import WebOsClient
from aiowebostv.models import WebOsTvState

HOST = "192.168.1.39"
# For first time pairing set key to None
CLIENT_KEY = "140cce792ae045920e14da4daa414582"

async def on_state_change(tv_state: WebOsTvState) -> None:
"""State changed callback."""
now = datetime.now(UTC).astimezone().strftime("%H:%M:%S.%f")[:-3]
print(f"[{now}] State change:")
# for the example, remove apps and inputs to make the output more readable
state = dataclasses.replace(tv_state, apps={}, inputs={})
pprint(state)

async def main():
"""Subscribed State Updates Example."""
client = WebOsClient(HOST, CLIENT_KEY)
await client.register_state_update_callback(on_state_change)
await client.connect()

# Store this key for future use
print(f"Client key: {client.client_key}")

# Change something using the remote to get updates or ctrl-c to exit
sig_event = asyncio.Event()
signal.signal(signal.SIGINT, lambda _exit_code, _frame: sig_event.set())
await sig_event.wait()

await client.disconnect()

if __name__ == "__main__":
asyncio.run(main())

Examples can be found in the examples folder

About
Python library to control LG webOS based TV devices
Resources
Readme
Apache-2.0 license
Security policy
Security policy
Activity
Custom properties
Stars
55 stars
Watchers
4 watching
Forks
16 forks
Report repository

Releases

Packages

Used by

Contributors

Languages

You can’t perform that action at this time.