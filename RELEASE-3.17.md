# 3.17 — Real 3D sanctuary and new visitor

Mode: custom personal sanctuary; direct edits to existing static HTML/esbuild project. No production deployment.

| Route | Goal | Scene / camera | Controls | Fallback |
|---|---|---|---|---|
| garden.html | Walk, pray, choose activity | Real Three.js/WebGL floating courtyard, pavilion, stylized elephant-headed golden statue, trees, lanterns and installations; orthographic camera with left/right controls and portrait framing | Floor raycasting, semantic station buttons, keyboard movement, four robe colors | Original personal 2D scene and direct activity links if WebGL or module loading fails |
| index.html / siamsi.html / lucky-numbers.html | Existing activities | Existing presentation preserved | Existing member checks | Existing errors and direct navigation |
| login.html / informational routes | Account and information | Existing presentation preserved | Existing forms and navigation | Existing states |

Implementation: Three.js 0.180.0 pinned and locally bundled (about 509 KB raw), loaded only on the sanctuary route after membership readiness. New articulated chibi visitor; model and environment constructed from geometry, no remote avatar asset or new user account. Prayer is symbolic and never alters random probabilities. No new database tables or presence writes. Mandatory library license retained in dist/licenses.

Performance: DPR capped at 1.5; one 1024px shadow map, no postprocessing. Frame submissions are capped near 10 fps while idle and up to 60 while walking; stop when hidden/offscreen. These are scheduling caps, not measured device FPS. Reduced motion snaps walking and preserves all links. Mobile retains scrolling gestures.

QA: 50 automated tests passed; build generated 8 routes and standalone previews. Browser rendered actual geometry, station walking/arrival, floor picking, clothing change, camera turn and member-verified prayer dialog. Inspected 1280px and 390px layouts; no horizontal overflow at 390px. No captured console errors. Fixed roof obstruction, overlapping mobile labels and blank framebuffer after viewport changes; retested desktop-to-mobile-to-desktop rendering. WebGL failure/context-loss path reviewed in code, not forced in the browser. No all-device performance guarantee.
