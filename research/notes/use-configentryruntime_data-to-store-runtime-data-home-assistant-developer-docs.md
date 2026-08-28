---
title: Use ConfigEntry.runtime_data to store runtime data | Home Assistant Developer
  Docs
id: use-configentryruntime_data-to-store-runtime-data-home-assistant-developer-docs
tags:
- lgtv-webos-ha-root-1a89ff
- locus-platinum-second-mode-sister-integration-gap
created: '2026-08-28T03:06:15.784127Z'
updated: '2026-08-28T03:06:37.392473Z'
source: https://developers.home-assistant.io/docs/core/integration-quality-scale/rules/runtime-data
source_domain: developers.home-assistant.io
fetched_at: '2026-08-28T03:06:15.782697Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: docs
deprecated: false
summary: 'Home Assistant Platinum IQS runtime-data rule: runtime state must be stored
  in ConfigEntry.runtime_data with typed alias type MyIntegrationConfigEntry = ConfigEntry[MyClient]
  (entry.runtime_data = client), not in hass.data globals; if strict-typing is also
  implemented the typed ConfigEntry must be used throughout; no exceptions.'
---

Use ConfigEntry.runtime_data to store runtime data | Home Assistant Developer Docs

Skip to main content

On this page

Reasoning​

The ConfigEntry object has a runtime_data attribute that can be used to store runtime data.
This is useful for storing data that is not persisted to the configuration file storage, but is needed during the lifetime of the configuration entry.

By using runtime_data, we maintain consistency for developers to store runtime data in a consistent and typed way.
Because of the added typing, we can use tooling to avoid typing mistakes.

Example implementation​

The type of a ConfigEntry can be extended with the type of the data put in runtime_data.
In the following example, we extend the ConfigEntry type with MyClient, which means that the runtime_data attribute will be of type MyClient.

__init__.py:

type MyIntegrationConfigEntry = ConfigEntry[MyClient]

async def async_setup_entry(hass: HomeAssistant, entry: MyIntegrationConfigEntry) -> bool:

"""Set up my integration from a config entry."""

client = MyClient(entry.data[CONF_HOST])

entry.runtime_data = client

await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

return True

info

If the integration implements strict-typing, the use of a custom typed MyIntegrationConfigEntry is required and must be used throughout.

Additional resources​

More information about configuration entries and their lifecycle can be found in the config entry documentation.

Exceptions​

There are no exceptions to this rule.

Related rules​

strict-typing: Strict typing
test-before-setup: Check during integration initialization if we are able to set it up correctly

Reasoning
Example implementation
Additional resources
Exceptions
Related rules