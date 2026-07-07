---
'@inkeep/open-knowledge': patch
---

Correct user-facing copy that described behavior that doesn't exist, and finish
the Personal CRM rename in seeded content:

- The OKF pack's seeded skill no longer claims an "OKF export" normalizes
  `[[wiki-link]]` shorthand to standard links — no export feature exists;
  OpenKnowledge accepts the shorthand as a native superset and preserves it
  byte-for-byte.
- The `entity-vault` pack's seeded skill now titles itself **Personal CRM
  (GBrain-compatible)**, matching the starter-pack picker and the
  `ok seed` output. Applies to newly seeded projects; an existing project's
  skill is user-owned and left untouched.
- `ok seed --help` no longer promises a `--root` prompt on a TTY — omitting
  `--root` scaffolds at the project root (only the apply confirmation prompts).
- The template dialog's filename hint no longer says the filename "can't be
  changed later" (local templates are renamable from the edit dialog), and the
  description placeholder says "under the title", matching the field it sits
  beside.
