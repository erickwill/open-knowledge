---
"@inkeep/open-knowledge": patch
---

The share-receive "changed locally" panel no longer offers to enable auto-sync when it is already on. With sync enabled it now offers Sync now instead: the push publishes your local move/rename/delete, and the panel re-checks the branch and pivots to the honest outcome — including the "moved to <new path> — open it there?" redirect when the doc was renamed. With sync off, the Enable auto-sync flow is unchanged, and when the sync engine is unavailable or failing the panel defers to the sync badge rather than offering a dead button.
