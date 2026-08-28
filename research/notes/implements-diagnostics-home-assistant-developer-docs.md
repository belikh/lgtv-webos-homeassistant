---
title: Implements diagnostics | Home Assistant Developer Docs
id: implements-diagnostics-home-assistant-developer-docs
tags:
- lgtv-webos-ha-root-1a89ff
- locus-credentialless-root-detection-and-consented-ipk-orchestration
created: '2026-08-28T02:39:21.507075Z'
source: https://developers.home-assistant.io/docs/core/integration-quality-scale/rules/diagnostics
source_domain: developers.home-assistant.io
fetched_at: '2026-08-28T02:39:21.505024Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: docs
deprecated: false
---

Implements diagnostics | Home Assistant Developer Docs

Skip to main content

On this page

Reasoning​

Diagnostics are an easy way for the user to gather data about the integration and can prove useful when debugging an integration.

We consider it a good practice to have the diagnostics implemented.
Something to keep in mind is that the diagnostics should not expose any sensitive information, such as passwords, tokens, or coordinates.

Example implementation​

In the following example we provide diagnostics which includes data from various sources, such as the configuration and the current state of the integration.
Since the configuration may contain sensitive information, we redact the sensitive information before returning the diagnostics.

diagnostics.py:

TO_REDACT = [

CONF_API_KEY,

CONF_LATITUDE,

CONF_LONGITUDE,

]

async def async_get_config_entry_diagnostics(

hass: HomeAssistant, entry: MyConfigEntry

) -> dict[str, Any]:

"""Return diagnostics for a config entry."""

return {

"entry_data": async_redact_data(entry.data, TO_REDACT),

"data": entry.runtime_data.data,

}

Additional resources​

To learn more information about diagnostics, check out the diagnostics documentation.

Exceptions​

There are no exceptions to this rule.

Reasoning
Example implementation
Additional resources
Exceptions