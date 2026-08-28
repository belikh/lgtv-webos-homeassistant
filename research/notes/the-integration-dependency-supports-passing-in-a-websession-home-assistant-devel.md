---
title: The integration dependency supports passing in a websession | Home Assistant
  Developer Docs
id: the-integration-dependency-supports-passing-in-a-websession-home-assistant-devel
tags:
- lgtv-webos-ha-root-1a89ff
- locus-platinum-second-mode-sister-integration-gap
created: '2026-08-28T02:14:19.240333Z'
updated: '2026-08-28T03:06:35.171545Z'
source: https://developers.home-assistant.io/docs/core/integration-quality-scale/rules/inject-websession
source_domain: developers.home-assistant.io
fetched_at: '2026-08-28T02:14:19.239002Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: docs
deprecated: false
summary: 'Home Assistant IQS inject-websession rule: integration dependencies that
  make HTTP requests must support passing in a shared websession (aiohttp async_get_clientsession
  or httpx get_async_client) to reuse HA session pool; use async_create_clientsession/create_async_httpx_client
  only for isolated sessions (e.g., cookies); exception if no HTTP requests.'
---

The integration dependency supports passing in a websession | Home Assistant Developer Docs

Skip to main content

On this page

Reasoning​

Since many devices and services are connected via HTTP, the number of active web sessions can be high.
To improve the efficiency of those web sessions, it is recommended to support passing in a web session to the dependency client that is used by the integration.

Home Assistants supports this for aiohttp and httpx.
This means that the integration dependency should use either of those two libraries.

Example implementation​

In the example below, an aiohttp session is passed in to the client.
The equivalent for httpx would be get_async_client.

async def async_setup_entry(hass: HomeAssistant, entry: MyConfigEntry) -> bool:

"""Set up my integration from a config entry."""

client = MyClient(entry.data[CONF_HOST], async_get_clientsession(hass))

info

There are cases where you might not want a shared session, for example when cookies are used.
In that case, you can create a new session using async_create_clientsession for aiohttp and create_async_httpx_client for httpx.

Exceptions​

If the integration is not making any HTTP requests, this rule does not apply.

Related rules​

async-dependency: Dependency is async

Reasoning
Example implementation
Exceptions
Related rules