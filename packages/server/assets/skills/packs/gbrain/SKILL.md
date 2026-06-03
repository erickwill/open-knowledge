---
name: open-knowledge-pack-gbrain
description: "How to work in a Gbrain project (the `gbrain` starter pack): a typed-entity vault of people, companies, meetings, and concepts, each a dossier with a rewritable summary plus an append-only timeline. Read when the project has these folders. Carries the dossier convention and entity-extraction behaviors so that guidance does not live inside template bodies or folder descriptions. Complements the platform `open-knowledge` skill; does not replace it."
compatibility: "Claude Code, Claude Desktop, Claude Cowork, Claude.ai web. Requires Open Knowledge MCP server. Installed project-local by `ok seed --pack gbrain`."
metadata:
  pack: "gbrain"
  author: "Inkeep"
  repository: "https://github.com/inkeep/open-knowledge"
---
# Gbrain pack — how to work here

A typed-entity vault inspired by Garry Tan's gbrain. Each entity is a dossier; the agent keeps dossiers current by extracting entities from meeting notes and original thinking. This skill holds those behaviors so templates and folder descriptions stay clean.

> Pack guidance. The platform `open-knowledge` skill still governs every markdown operation.

## The dossier convention (the load-bearing rule)

Every dossier in `people/`, `companies/`, and `concepts/` has two parts:

1. **Compiled truth** (above the `---` divider) — your current best understanding. Overwrite it as new evidence arrives.
2. **Timeline** (below the divider) — append-only `YYYY-MM-DD:` entries. **Never edit existing timeline entries; only append.**

When a new fact arrives, route it: update **compiled truth** if it changes current understanding, or append to the **timeline** if it's raw evidence.

## Folders

- **`people/`**, **`companies/`**, **`concepts/`** — dossiers (compiled truth + timeline). Frontmatter `type: person|company|concept`.
- **`meetings/`** — meeting notes (`YYYY-MM-DD-<slug>.md`); `attendees:` should match dossier filenames in `people/`. The verbatim record — do NOT rewrite it.
- **`originals/`** — your own untransformed thinking; authoritative source material.
- **`media/`** — bulk transcripts, voice notes, large attachments; often `.okignore`-d to keep the index light.

## Agent behaviors

- After a meeting note lands, extract entity mentions and append timeline entries to each referenced dossier (cite the meeting by markdown link). Stub any mentioned entity not yet captured.
- Treat `originals/` as authoritative (the user's own words, not inferences).
- Surface entity-to-entity edges (person ↔ company, concept hubs) when both ends exist.

## gbrain CLI (optional)

This pack ships the markdown half (folders + templates + this skill). If the external `gbrain` CLI is installed (`~/.gbrain/`), it adds scheduled enrichment: `gbrain dream` (nightly maintenance), `gbrain briefing`, `gbrain soul-audit`. The root files (`USER.md`, `SOUL.md`, `ACCESS_POLICY.md`, `HEARTBEAT.md`) are read by those skills; fill them in by hand or via `gbrain soul-audit`. None of it is required to use the vault.

## Templates

Create with `write_document({ template: "<name>", … })`. Templates carry only structure (including the compiled-truth / timeline divider); the convention is described here, not repeated in document bodies.
