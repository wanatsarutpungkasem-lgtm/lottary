# ล่าสุด 3.21 — เส้นทางกิจกรรมและตู้รับใบ

เพิ่มตัวละครครั้งแรก ตู้ลูกบอลสี่เหลี่ยม ตู้รับใบ 28 ช่อง หน้าสักการะแยกและตู้บริจาคจำลอง รายละเอียด RELEASE-3.21.md; build 9 หน้า, tests 62 ผ่าน ยังไม่อัปโหลด frontend จริง

---

# สถานะล่าสุด 3.20 — 12 พฤศจิกายน 2026

ลานมงคลเพิ่มเครื่องสักการะ ตัวละครผู้ใหญ่ บรรยากาศ บันทึกในเครื่อง และลานร่วมจริงแบบเลือกเข้าร่วม อ่านรายละเอียดและข้อจำกัดที่ RELEASE-3.20.md

Backend broker พร้อมแล้ว; frontend ยังรอผู้ใช้อัปโหลด GitHub. ผ่าน unit/regression 59 รายการ และ live broker 7 จุด ตรวจขนาด 390/768/1440 ผ่านใน iframe. ยังไม่ได้ทดสอบโหลดพร้อมกันจำนวนมากหรือเซ็นเซอร์โทรศัพท์จริงทุกรุ่น.

---

# 3.19 — Reference-inspired Ganesha

12 November 2026. The supplied seated Ganesha illustration was used as a visual reference only. Its original raster file was not copied into the website. This is an original stylized geometric interpretation, not a scanned reconstruction or a claim to exact unseen-angle fidelity.

- Replaced the simple monochrome statue with a dedicated local 3D model: warm peach skin, four arms, sculpted ears, painted eye details, tapered curled trunk, crown, blue/gold halo, jewelry, offering bowl and pink lotus base.
- Bead chains use instancing. The model is bundled with the existing local Three.js scene; no external model/CDN/API is introduced.
- Added a semantic close-up toggle with camera reframing. Station overlays hide during close-up; direct activity links and prayer remain available. Return-to-center restores the courtyard camera. Close-up is disabled until the 3D scene is ready and when fallback is used.
- Existing siamsi 3D vessel, authentication, random outcomes and database behavior are preserved. No production deployment.

Validation: 52 tests passed and 8 routes built. Browser tested close-up, camera rotation and returning to the courtyard. Inspected 1280px and 390px layouts; mobile page width did not overflow. No new hardware performance claim. Mobile close-up screenshot saved for handoff.

---
# 3.18 — Realistic siamsi vessel

Scope: siamsi visual/interaction refinement before extending 3D across the application. Existing garden remains included; other activity logic preserved.

- Real local Three.js vessel with open outer/inner cylinder, wooden rim/base, deterministic procedural wood grain, curved Thai lettering and 28 closely packed bamboo sticks with lacquered red tips.
- Gesture spring motion drives the model tilt and individual stick rattle. The sampled card ID is passed into a dedicated lift/drop animation; animation does not select or filter results.
- Original phone-sensor session, drag and keyboard alternatives remain. Six beats are still required. Reduced motion snaps the selected stick; fallback DOM vessel is retained when WebGL cannot start or loses context.
- Self-hosted siamsi3d bundle is loaded after membership readiness and embedded into standalone output. No database/schema changes and no production deployment.
- Capped DPR 1.5, 1024 shadow map, soft contact shadow, low-rate idle rendering and pause when hidden/offscreen. Not a hardware FPS benchmark.

Validation: build 8 routes; 51 tests passed including standalone 3D integration and locked initial markup. JS syntax checked. Browser keyboard test stayed closed after four beats, reached six, completed reveal and opened matching leaf 14; close reset the counter. Render inspected at 1280px and 390px with no horizontal overflow at 390px or captured console errors. Phone hardware sensor behavior was not physically retested; existing sensor code and motion tests remain in place. Context-loss fallback reviewed in code, not forced in browser.

---
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

---
# 3.16 — Personal sanctuary prototype

Open garden.html through the local server or deployed dist. Main-page preview link and every More menu lead to the scene.

- CSS/DOM 2D personal scene, existing local Ganesha artwork, four interactive stations.
- Tap/click floor or use arrow/WASD keys while the map is focused to walk; choose a station to walk toward it.
- Direct links preserve access without walking. Actual ball, sticks and number activities remain on existing protected routes.
- Prayer opens an original blessing dialog after server membership verification. It does not change randomness or store ritual activity.
- Honors reduced motion and soft-effects preference; movement uses requestAnimationFrame only while walking and stops in hidden tabs.
- Shows only the current user's avatar. No multiplayer simulation, presence writes, chat, new database tables, or production deployment.

Validation: build 8 routes; 49 tests pass including locked initial garden markup; JS syntax check. Authenticated browser test covered selecting a station, arrival, prayer opening/closing, and navigation to the existing siamsi route. Desktop 1280px and mobile 390px inspected, no horizontal overflow at 390px; station targets exceed 48px. No captured console errors. This is a prototype, not a guarantee of performance on every device.

---
# 3.15 — Stable buttons and panels

- Draw button disables and acknowledges the click before awaiting server membership verification; restores on denial or connection failure.
- Remove whole-panel scroll-entry effects and IntersectionObserver setup to prevent panels moving after they become visible.
- Remove backdrop blur on large panels and modal backdrops; keep idle halo static and run atmospheric particles during the draw only.
- Remove hover lift and sheen on primary controls; retain clear color feedback.
- Show route-loading notice immediately for ordinary same-origin HTML link clicks; preserve browser navigation and modifier-key behavior.

Validation: build and 48 automated tests passed; local authenticated account route, settings menu, and full draw-to-popup checked. No captured console errors. Browser network verification still requires a connection. This is not a frame-rate benchmark and has not been deployed to production.

---
# 3.14 — Smooth interaction

- Preload same-origin authentication modules to reduce dependency discovery delay; server verification remains required.
- Remove animated brightness filters from 14 mixing balls and batch transform reads before settling animations.
- Shorten decorative entry/settle transitions; keep text immediately readable.
- Pause atmospheric CSS loops when the tab is hidden; reduce mobile particles and backdrop blur.
- Preserve random generation, membership checks, and database behavior.

Validation: build completed; 48 tests passed. Local authenticated preview completed a draw and result popup without captured console errors. No device frame-rate guarantee or production deployment is claimed.

---

# ล่าสุด 3.13 — ชื่อเล่นก่อนสุ่ม

เพิ่มการตรวจชื่อและเติมจากบัญชี จำชื่อแยกบัญชีต่อเบราว์เซอร์ ทดสอบ 48 ผ่านและ browser preview สำเร็จ ดู RELEASE-3.13.md ยังไม่ deploy

# ล่าสุด 3.12 — ตัด guest/login flash ระหว่างเปลี่ยนหน้า

45 tests ผ่าน ตรวจพรีวิว signed-in เซียมซีและบัญชีสำเร็จ รายละเอียด RELEASE-3.12.md ยังไม่ deploy

# ล่าสุด 3.11 — Welcome first / 11 พฤศจิกายน 2026

ปรับหน้า guest เป็นภาพและการ์ดกิจกรรม ปรับเมนูมือถือและความอ่านง่าย แก้ Privacy ตามระบบปัจจุบัน ทดสอบ 42 ผ่าน ดู RELEASE-3.11.md ยังไม่ได้ deploy

# ล่าสุด 3.10 / 6 พฤศจิกายน 2026

ปุ่มมีโลโก้และสีแต่ละบริการ เพิ่มออกจากระบบแถบบนสำหรับสมาชิก ซ่อนเข้าสู่ระบบซ้ำ ดู RELEASE-3.10.md ยังไม่ deploy

# ล่าสุด 3.9 — ต้องล็อกอินก่อนใช้ฟังก์ชัน / 5 พฤศจิกายน 2026

ทดสอบบัญชีจริงและบันทึก/อ่านข้อมูล Supabase สำเร็จแล้ว ออกจากระบบล็อกทั้งสามหน้า ชุดทดสอบ 42 ผ่าน ขอบเขตข้อมูลและการทดสอบดู RELEASE-3.9.md ยังไม่ได้ deploy GitHub Pages

# สถานะ OAuth รุ่น 3.8 — 5 พฤศจิกายน 2026

Google และ GitHub เปิด provider แล้ว แต่ยังไม่ทดสอบ callback จบ Facebook เชื่อม Secret และเปิด provider แล้ว ยังไม่เผยแพร่แอป Meta รายละเอียดใน OAUTH-SETUP.md ไม่ได้ Deploy เว็บจริง ชุดทดสอบ 39 ผ่าน

# สถานะล่าสุด — รุ่น 3.7 / 5 พฤศจิกายน 2026

Backend Auth และตารางสมาชิกจริงสร้างแล้วใน testwebsite; เพิ่ม URL ยืนยันอีเมลแล้วหลังเจ้าของยืนยัน ยังไม่ Deploy หน้าเว็บ และยังรอเจ้าของตั้งค่า SMTP ก่อนเปิดสมัครทั่วไป ตาม SMTP-SETUP.md

ผลตรวจ: อัตโนมัติ 33 ข้อผ่าน; 7 หน้า × 4 ขนาด = 28 กรณี ไม่มีล้นแนวนอน; Auth ปฏิเสธล็อกอินทดสอบที่ไม่ถูกต้อง; SQL RLS ownership ผ่านและ rollback fixtures ทั้งหมด ยังไม่ได้ทดสอบอีเมล signup/recovery ครบวงจรเพราะ SMTP ยังไม่มี

## ประวัติงานก่อนหน้า

# Lucky By wanatsarut — 31 ตุลาคม 2026

## รุ่น 3.4.1 พร้อมอัปโหลด ยังไม่ Deploy
- ตรวจลิงก์ในภาพ Facebook: HTTPS 200 และไม่มี redirect ในคำขอที่ตรวจ
- คำเตือนอยู่ใน Facebook ไม่ใช่ UI ของเว็บ ยังยืนยันสาเหตุรายบัญชีหรือสถานะการจัดประเภทใน Meta ไม่ได้
- เพิ่ม canonical ให้ตรงกับ og:url ทั้งหกหน้า ไม่รับรองว่าจะลบคำเตือนของ Meta
- Build ผ่าน และทดสอบอัตโนมัติ 27 ข้อผ่าน
- รายงานและข้อความสำหรับแจ้ง Meta: FACEBOOK-LINK-REVIEW.md
- Browser use ถูกปิด จึงไม่ได้ทดสอบ UI จริงในรอบนี้

## ต้องทำต่อ
- เจ้าของอัปโหลด ZIP รวม dist รอ Actions สำเร็จ
- ตรวจ Sharing Debugger สำหรับข้อมูลตัวอย่าง และรายงานปัญหาคำเตือนกับ Facebook หากยังพบ
- ตรวจมือถือจริงและเขย่าด้วยเซนเซอร์ยังคงเป็นขั้นตอนตรวจรับที่ต้องทำ
- บังคับชื่อ/ราศีทุกครั้งยังพักไว้ตามคำขอเดิม

## รุ่น 3.5 — เพิ่มการป้องกันหน้าเว็บ
- CSP meta ทุกหน้า และ hash สำหรับ standalone; no-referrer
- ตรวจข้อมูลประวัติและใบที่เก็บไว้ก่อนใช้ เพิ่ม safe-state.js
- Build และทดสอบ 33 ข้อผ่าน ยังไม่ได้ทดสอบ CSP ผ่าน UI เพราะ browser use ถูกปิด
- SECURITY.md ระบุการป้องกัน ข้อจำกัด และขั้นตอนเจ้าของยืนยัน 2FA/สิทธิ์ GitHub
- ยังไม่ได้ตั้งค่าบัญชี GitHub ไม่ได้ Deploy และไม่รับรองว่า Facebook จะเลิกเตือน
- ชุดล่าสุด: lucky-by-wanatsarut-v35-security-github.zip

## 5 พฤศจิกายน 2026 — รุ่น 3.6 พร้อมอัปโหลด
- UI/UX Pro Max: Midnight Sanctuary ธีมม่วงทองทั้งหกหน้า
- หัวเว็บ การ์ดเข้ากิจกรรม ฟอร์ม ปุ่ม ตัวอักษร และป๊อปอัปปรับใหม่
- เพิ่ม skip link และ SVG ตั้งค่า; เก็บ CSP และระบบสุ่มเดิม
- อัตโนมัติ 33 ข้อผ่าน; browser responsive 30 กรณีผ่าน สุ่มจริงใน browser เปิด 6 หลักได้ ไม่มี console error
- ไฟล์ล่าสุด lucky-by-wanatsarut-v36-midnight-sanctuary-github.zip ยังไม่ได้ Deploy
- ยังต้องทดสอบมือถือจริง และการบังคับชื่อ/ราศียังคงพักไว้

## รุ่น 3.7 — สมาชิกจริง / รอ SMTP ก่อนเปิดสาธารณะ
- เจ้าของเลือกใช้ testwebsite และอนุญาตเพิ่ม redirect URLs ของ Lucky สองรายการ บันทึกแล้ว
- สมัคร/ล็อกอิน/ยืนยันอีเมล/กู้รหัสผ่าน/ออกจากระบบด้วย Supabase Auth ผ่าน SDK ทางการ self-host
- ตาราง lucky_member_profiles, lucky_member_draws, lucky_member_keeps สร้างบนบริการจริง เปิด RLS จำกัดเจ้าของ
- SQL ownership test ผ่านและ rollback ข้อมูลทดสอบทั้งหมด
- Guest ใช้งานเดิมได้ เก็บข้อมูลใหม่ลงบัญชีเมื่อเข้าสู่ระบบ ไม่ย้ายประวัติเดิมอัตโนมัติ
- API จริงปฏิเสธข้อมูลล็อกอินทดสอบที่ไม่ถูกต้อง; ยังไม่มีการทดสอบบัญชีใหม่และอีเมลครบวงจร
- เจ้าของยังไม่มี SMTP และขอให้เตรียมขั้นตอน ดู SMTP-SETUP.md ต้องทำก่อนเปิดสมัครทั่วไป
- ยังไม่ Deploy ไป GitHub และยังไม่เปิด Google/LINE
