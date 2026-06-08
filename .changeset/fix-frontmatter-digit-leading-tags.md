---
"@inkeep/open-knowledge-core": patch
"@inkeep/open-knowledge-app": patch
---

Allow digit-leading tags (like the year `2026`) in a document's frontmatter `tags:` field. The property panel previously rejected them with "Tags must start with a letter…", even though a year is a legitimate tag. The frontmatter tag grammar is now more permissive than the inline `#tag` grammar: a frontmatter tag may start with a letter or a digit, while inline `#tag` in prose still requires a leading letter (so `#123` stays plain text and does not collide with issue-reference conventions).
