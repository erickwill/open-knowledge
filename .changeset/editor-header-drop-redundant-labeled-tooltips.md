---
"@inkeep/open-knowledge": patch
"@inkeep/open-knowledge-core": patch
"@inkeep/open-knowledge-server": patch
"@inkeep/open-knowledge-app": patch
"@inkeep/open-knowledge-desktop": patch
---

Drop the redundant hover tooltip from the editor toolbar's labeled actions. The "Open with AI" and "Share" buttons already show their name as visible text, so the tooltip that repeated that same text on hover was noise. Icon-only toolbar controls (the sync-status cloud, settings, help) keep their tooltips, since the tooltip is the only place their name appears.
