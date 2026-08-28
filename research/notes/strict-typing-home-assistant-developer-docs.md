---
title: Strict typing | Home Assistant Developer Docs
id: strict-typing-home-assistant-developer-docs
tags:
- lgtv-webos-ha-root-1a89ff
- locus-platinum-second-mode-sister-integration-gap
created: '2026-08-28T02:14:14.460113Z'
updated: '2026-08-28T03:06:32.199681Z'
source: https://developers.home-assistant.io/docs/core/integration-quality-scale/rules/strict-typing
source_domain: developers.home-assistant.io
fetched_at: '2026-08-28T02:14:14.458904Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: docs
deprecated: false
summary: 'Home Assistant Platinum IQS strict-typing rule: integration must be fully
  type-hinted and PEP-561 compliant (ship py.typed), enable strict mypy via .strict-typing
  file in HA core, and if runtime-data is implemented must use custom typed MyIntegrationConfigEntry
  throughout; no exceptions. Links to runtime-data rule.'
---

Strict typing | Home Assistant Developer Docs

Skip to main content

On this page

Reasoning​

Python is a dynamically typed language, which can be the source of many bugs.
By using type hints, you can catch bugs early and avoid introducing them.

Type hints are checked by mypy, a static type checker for Python.
Because of the way typing in Python works, and type hints being optional in Python, mypy will only check the code that it knows to be type annotated.
To improve on this, we recommend fully typing your library and making your library PEP-561 compliant.
This means that you need to add a py.typed file to your library.
This file tells mypy that your library is fully typed, after which it can read the type hints from your library.

In the Home Assistant codebase, you can add your integration to the .strict-typing file, which will enable strict type checks for your integration.

warning

If the integration implements runtime-data, the use of a custom typed MyIntegrationConfigEntry is required and must be used throughout.

Additional resources​

To read more about the py.typed file, see PEP-561.

Exceptions​

There are no exceptions to this rule.

Related rules​

runtime-data: Use ConfigEntry.runtime_data to store runtime data

Reasoning
Additional resources
Exceptions
Related rules