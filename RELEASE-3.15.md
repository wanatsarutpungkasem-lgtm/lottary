# 3.15 — Stable buttons and panels

- Draw button disables and acknowledges the click before awaiting server membership verification; restores on denial or connection failure.
- Remove whole-panel scroll-entry effects and IntersectionObserver setup to prevent panels moving after they become visible.
- Remove backdrop blur on large panels and modal backdrops; keep idle halo static and run atmospheric particles during the draw only.
- Remove hover lift and sheen on primary controls; retain clear color feedback.
- Show route-loading notice immediately for ordinary same-origin HTML link clicks; preserve browser navigation and modifier-key behavior.

Validation: build and 48 automated tests passed; local authenticated account route, settings menu, and full draw-to-popup checked. No captured console errors. Browser network verification still requires a connection. This is not a frame-rate benchmark and has not been deployed to production.
