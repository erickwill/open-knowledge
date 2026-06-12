---
"@inkeep/open-knowledge": patch
---

OK skill guidance now tells agents to reference images and other assets by a doc-relative path and never by a server URL. Previously an agent (notably in Codex) could embed an absolute `http://localhost:<port>/…` preview-server URL — which is machine- and session-specific and breaks portability, sharing, and the published docs render. The Media section now states the rule explicitly, covers the "reference an asset already in the tree" case, and clarifies that `preview_url`'s URL navigates the preview and must never be pasted into an image embed.
