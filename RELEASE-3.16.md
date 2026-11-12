# 3.16 — Personal sanctuary prototype

Open garden.html through the local server or deployed dist. Main-page preview link and every More menu lead to the scene.

- CSS/DOM 2D personal scene, existing local Ganesha artwork, four interactive stations.
- Tap/click floor or use arrow/WASD keys while the map is focused to walk; choose a station to walk toward it.
- Direct links preserve access without walking. Actual ball, sticks and number activities remain on existing protected routes.
- Prayer opens an original blessing dialog after server membership verification. It does not change randomness or store ritual activity.
- Honors reduced motion and soft-effects preference; movement uses requestAnimationFrame only while walking and stops in hidden tabs.
- Shows only the current user's avatar. No multiplayer simulation, presence writes, chat, new database tables, or production deployment.

Validation: build 8 routes; 49 tests pass including locked initial garden markup; JS syntax check. Authenticated browser test covered selecting a station, arrival, prayer opening/closing, and navigation to the existing siamsi route. Desktop 1280px and mobile 390px inspected, no horizontal overflow at 390px; station targets exceed 48px. No captured console errors. This is a prototype, not a guarantee of performance on every device.
