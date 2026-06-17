---
"@inkeep/open-knowledge-server": patch
---

fix(open-knowledge): honor nested .gitignore/.okignore depth when filtering content for sync

Patterns from a nested ignore file (for example `.blob-storage/` declared in `public/agents/.gitignore`) are flattened into the project-root ignore matcher by prefixing each with the file's directory. The prefix used to inject an embedded slash unconditionally, which the `ignore` library reads as root-anchored — silently collapsing a "match at any depth" basename rule down to "this exact level only." A `.blob-storage/` rule then matched `<dir>/.blob-storage` but missed `<dir>/agents-api/.blob-storage` one level deeper, so the sync walker gathered a git-ignored path and handed it to `git add`, which rejected it with the `addIgnoredFile` advice surfaced in the sync panel.

Non-anchored nested patterns now keep matching at any depth below their directory, while anchored patterns (leading or embedded slash) stay scoped to their own level. This restores parity between the content walker and `git add` (precedent #55) so gitignored paths are no longer offered for staging.
