---
"@inkeep/open-knowledge": patch
---

feat(ok): make config self-describing and starter packs cleaner for novices

Configuration is now legible end to end. Every config field carries a
description that flows into the published per-scope JSON schemas, so editors
show inline field help and autocomplete from the `$schema` comment in
`.ok/config.yml`. Config errors (scope violations, agent-not-settable,
mixed-scope writes) now name the exact file to edit and explain the scope in
plain language instead of citing internal codes. `ok init` no longer scaffolds
a dead `folders:` block or a Picomatch cheatsheet, and the schema-reference
path it prints is correct. The docs site configuration reference and quickstart
gain a scope column, the telemetry keys, a tiered env table, and the
three-layer model.

Starter packs are lighter and clearer. Template bodies are now bare headings
(no instructional prose polluting new docs or `log.md`), folder descriptions are
one-liners, and the "frontmatter sweep" jargon is gone. The workflow guidance
that used to live in template bodies now ships as a per-pack project skill:
`ok seed` (and the in-app Initialize dialog) install an
`open-knowledge-pack-<id>` skill next to the platform `open-knowledge` skill for
every editor set up in the project (`.claude`, `.cursor`, `.agents`). Install is
unified server-side in `applySeed`, so the CLI, the desktop IPC path, and the
HTTP path behave identically. Pack skills are now composed into the built CLI
and desktop artifacts, not just resolved from source.
