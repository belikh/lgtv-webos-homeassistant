# Security Policy

## Reporting a Vulnerability

Please report vulnerabilities via GitHub Security Advisories: https://github.com/belikh/lgtv-webos-homeassistant/security/advisories/new

Do not open a public issue for sensitive reports. We will acknowledge within 3 business days (Australian Eastern).

## Supported Versions

| Version | Supported |
|---------|-----------|
| main    | ✅        |

## Scope

This repo's scope is the TV companion IPK `com.ha.tvbridge` (Enact + JS service + native daemon) and its Home Assistant coordination. The companion's `all`-role native tier is root-only; stock fallback keeps Gold entities. See `docs/ROADMAP.md` §1 three-tier ACL and §3 consented install.
