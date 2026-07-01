---
"@inkeep/open-knowledge": patch
---

The editor's inline **Ask AI** button now sends a grounded prompt to the docked terminal instead of the raw selected text. When you highlight a passage and click Ask AI with a terminal open, the running CLI receives the passage together with a reference to the document it came from (or a pointer to read the full passage via the OpenKnowledge MCP server when the selection is large), so the agent can place it in your knowledge base instead of getting an unattributed blob.
