---
"@inkeep/open-knowledge-app": patch
---

Fix: JSON files now render with syntax highlighting in the read-only code viewer. The extension-to-language table mapped `jsonc` to the JSON grammar but omitted plain `json`, so opening a `.json` file (for example `config.json`, `package.json`, or `.mcp.json`) resolved to no language and CodeMirror fell back to unhighlighted plaintext. Adding the `json` entry routes these files to the JSON grammar that was already available. The media-kind dispatch is unaffected — `.json` already resolved as a text asset through the sidebar text set, which is checked before the code-language set.
