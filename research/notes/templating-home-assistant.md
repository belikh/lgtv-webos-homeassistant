---
title: Templating - Home Assistant
id: templating-home-assistant
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:15:48.645700Z'
source: https://www.home-assistant.io/docs/templating/
source_domain: www.home-assistant.io
fetched_at: '2026-08-28T02:15:47.789058Z'
fetch_provider: builtin
status: draft
type: note
deprecated: false
summary: Templating - Home Assistant
---

Templating - Home Assistant

On this page

Quick example

Learning guide

Tutorials

Reference

Templating

Templates are short snippets of code you can use wherever Home Assistant needs to figure something out for you. Instead of typing a fixed message or value, you write a small instruction that reads your data and produces the right result.

For example, instead of a notification that always says “Someone is home”, a template can say “Frenck is home” or “Nobody is home, they’re at the gym” depending on what’s actually happening.

Quick example

ActionActions are used in several places in Home Assistant. As part of a script or automation, actions define what is going to happen once a trigger is activated. In scripts, an action is called *sequence*. [Learn more]
action: notify.send_message
target:
entity_id: notify.my_device
data:
message: >
{% if is_state('device_tracker.frenck', 'home') %}
Frenck is home.
{% else %}
Frenck is at {{ states('device_tracker.frenck') }}.
{% endif %}

Result
Frenck is at gym.

The text between {%, %} and {{, }} is the template. When the action runs, Home Assistant replaces it with the right message.

Learning guide

Start here if you are new to templating in Home Assistant. The pages below walk you through the concepts step by step.

Introduction

What templates are and why you would use them.

Where to use templates

The places in Home Assistant where templates show up.

Template syntax

The building blocks of every template, explained in plain language.

Loops and conditions

Making decisions and repeating work with if, for, and friends.

Templates in YAML

Quoting, multi-line strings, and other YAML gotchas.

Working with states

Reading states, attributes, and entity information.

Types and conversion

Understand data types and how to convert between them.

Dates and times

Format, compare, and calculate with dates and times.

Python methods

Cheat sheet of Python methods available in templates.

Common patterns

Recipes for the things you actually want to do.

Debugging templates

Fixing mistakes with the template editor.

Error messages

What each error means and how to fix it.

Custom templates and macros

Share templates across your configuration.

Tutorials

Two step-by-step walkthroughs that show templating in practice.

Notify me about low batteries

Build a daily notification that lists devices with low batteries.

Average home temperature

Create a template sensor that averages all your temperature sensors.

Reference

Home Assistant provides hundreds of template functions, filters, and tests for working with your data. Each one has its own page with explanations and examples.

Template functions reference. Browse all functions, filters, and tests by category.

Help us improve our documentation

Suggest an edit to this page, or provide/view feedback for this page.

Edit

Provide feedback

View given feedback

Documentation

Overview
|
FAQ
|
Glossary

Automations

Dashboards

Voice assistants

Organization

Home energy management

Templating

Introduction

Where to use templates

Template syntax

Loops and conditions

Templates in YAML

Working with states

Types and conversion

Dates and times

Python methods

Common patterns

Debugging templates

Error messages

Custom templates and macros

Tutorial: Low battery alerts

Tutorial: Average temperature

Template functions reference

Common tasks

Configuration

Authentication

Tools and helpers

iOS and Android apps

Official hardware

Home Assistant Green

Home Assistant Connect ZBT-1

Home Assistant Connect ZBT-2

Home Assistant Connect ZWA-2

Home Assistant Yellow

Home Assistant Voice Preview Edition

On this page

Quick example

Learning guide

Tutorials

Reference

Back to top