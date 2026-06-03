---
"@inkeep/open-knowledge-desktop": patch
---

Custom DMG install window: the mounted disk image now shows the standard "drag the app onto Applications" layout, with the app icon and the `/Applications` alias positioned over a background image.

Configured via electron-builder's `dmg` block (installer-window size, icon coordinates, `background`). The committed background is a schematic placeholder; final branded artwork drops into `packages/desktop/build/dmg-background.png` + `dmg-background@2x.png` (540x380 / 1080x760). Iterate on the layout locally with `bun run build:mac:unsigned`.
