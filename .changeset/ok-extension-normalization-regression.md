---
"@inkeep/open-knowledge": patch
---

Restore two extension-normalization behaviors that regressed when the file tree
began preserving exact `.md` / `.mdx` document identities.

- Share-receive miss detection again recognizes an extension-bearing armed
  navigation against the resolver's extension-stripped missing target, so a
  moved or deleted shared doc renders the honest miss panel instead of falling
  into create-mode at the shared path.
- An extension-only file rename (same base name, `foo.md` to `foo.mdx`) once
  more performs the on-disk move without recording a phantom rename-history
  entry, since the two paths refer to the same logical document.
