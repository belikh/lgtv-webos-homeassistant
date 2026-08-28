---
title: Dependency is async | Home Assistant Developer Docs
id: dependency-is-async-home-assistant-developer-docs
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:14:16.837304Z'
source: https://developers.home-assistant.io/docs/core/integration-quality-scale/rules/async-dependency
source_domain: developers.home-assistant.io
fetched_at: '2026-08-28T02:14:16.836348Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: docs
deprecated: false
---

Dependency is async | Home Assistant Developer Docs

Skip to main content

On this page

Reasoning​

Home Assistant works with asyncio to be efficient when handling tasks.
To avoid switching context between the asyncio event loop and other threads, which is costly performance wise, ideally, your library should also use asyncio.

This results not only in a more efficient system but the code is also more neat.

Additional resources​

More information on how to create a library can be found in the documentation.

Exceptions​

There are no exceptions to this rule.

Related rules​

inject-websession: The integration dependency supports passing in a websession

Reasoning
Additional resources
Exceptions
Related rules