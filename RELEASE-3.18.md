# 3.18 — Realistic siamsi vessel

Scope: siamsi visual/interaction refinement before extending 3D across the application. Existing garden remains included; other activity logic preserved.

- Real local Three.js vessel with open outer/inner cylinder, wooden rim/base, deterministic procedural wood grain, curved Thai lettering and 28 closely packed bamboo sticks with lacquered red tips.
- Gesture spring motion drives the model tilt and individual stick rattle. The sampled card ID is passed into a dedicated lift/drop animation; animation does not select or filter results.
- Original phone-sensor session, drag and keyboard alternatives remain. Six beats are still required. Reduced motion snaps the selected stick; fallback DOM vessel is retained when WebGL cannot start or loses context.
- Self-hosted siamsi3d bundle is loaded after membership readiness and embedded into standalone output. No database/schema changes and no production deployment.
- Capped DPR 1.5, 1024 shadow map, soft contact shadow, low-rate idle rendering and pause when hidden/offscreen. Not a hardware FPS benchmark.

Validation: build 8 routes; 51 tests passed including standalone 3D integration and locked initial markup. JS syntax checked. Browser keyboard test stayed closed after four beats, reached six, completed reveal and opened matching leaf 14; close reset the counter. Render inspected at 1280px and 390px with no horizontal overflow at 390px or captured console errors. Phone hardware sensor behavior was not physically retested; existing sensor code and motion tests remain in place. Context-loss fallback reviewed in code, not forced in browser.
