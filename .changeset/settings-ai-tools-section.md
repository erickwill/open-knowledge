---
"@inkeep/open-knowledge": minor
---

Settings → User gains an "AI tools & CLI" section — the first-launch "Connect your AI tools to OpenKnowledge" dialog is now a persistent, stateful surface in the desktop app's settings. Every global component is listed with a checkbox reflecting its live installed state, and clicking installs or uninstalls that one component: the per-editor `open-knowledge` MCP entries (Claude Code, Claude Desktop, Cursor, Codex, OpenCode, OpenClaw), the `ok` shell-PATH shim, and the user-global Agent Skills (`open-knowledge-discovery`, `open-knowledge-write-skill`). Removal follows the same guest discipline as install: only entries OpenKnowledge recognizably wrote are deleted (customized/forked entries are reported and left byte-unchanged), PATH removal strips only the managed rc block and records a declined consent so startup self-heal never re-appends it, and skill removal records the per-bundle decision every install actor honors.
