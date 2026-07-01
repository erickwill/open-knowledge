---
"@inkeep/open-knowledge": patch
---

Refined the docked terminal's chat controls. Show or hide the terminal with an edge "Show terminal" tab that appears right where you closed it — on the right column or under the editor, depending on where it's docked — and the header's separate chat toggle is gone. The terminal's "new tab" control is now a split button: click it to open a new tab in your current CLI, or use the dropdown to switch CLI (your pick sticks, shared with the Ask AI composer) or open a plain "Terminal" tab (which sticks too, just for the terminal). New-chat now respects a CLI you picked but haven't installed instead of silently falling back, terminal tabs show their full title on hover, and opening the chat no longer collapses the document panel.
