---
"@inkeep/open-knowledge-app": patch
---

Fix the fullscreen graph overlay's header on macOS desktop. The "GRAPH" title row now vertically aligns with the window's traffic lights: the overlay is `fixed inset-0` so it starts at the raw window top, 8px above where the normal editor chrome row sits (inside `SidebarInset`'s `m-2`), so its header reproduces that 8px inset and matches the chrome row's height — landing the title on the same midline the traffic lights are tuned to. The header continues to reserve the traffic-light footprint so the title never overlaps the buttons.

Window dragging works again in fullscreen graph mode, and the Explore/Orphans/Hubs tabs are reliably clickable. The overlay paints over the editor's `-webkit-app-region: drag` chrome; previously those drag regions showed through and silently converted clicks on the mode tabs into window drags. The header is now scoped like the editor header — the header row is the drag region and the controls cluster opts back out with `no-drag` — so the window stays draggable by the header while the tabs and buttons receive clicks.
