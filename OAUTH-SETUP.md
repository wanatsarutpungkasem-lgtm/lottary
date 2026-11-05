# OAuth — สถานะ 5 พฤศจิกายน 2026

- GitHub: สร้าง Lucky By wanatsarut และเปิด provider ใน Supabase แล้ว ทดสอบถึงหน้ายินยอมอ่านอีเมล ยังไม่ยืนยัน callback เข้าบัญชีสำเร็จ
- Google: สร้างโปรเจกต์แยก Lucky By wanatsarut (decoded-reducer-513813-g2) และ Web client แล้ว บันทึก Secret ใน Supabase และเปิด provider แล้ว ทดสอบถึงหน้าเลือกบัญชี อยู่ใน Testing มีบัญชีเจ้าของเป็น test user ยังไม่เปิดผู้ใช้ทั่วไป
- Facebook: สร้างแอป 1157868366813336 แล้ว เพิ่ม email และ callback แล้ว อยู่ในสถานะไม่เผยแพร่ เจ้าของยืนยัน Meta แล้ว บันทึก Secret เฉพาะใน Supabase และเปิด provider แล้ว ทดสอบปุ่มแล้วถึงหน้า Facebook consent ซึ่งแจ้งว่าสิทธิ์บางส่วนต้องผ่านการตรวจพิจารณา ยังไม่ยืนยัน callback สำเร็จและยังไม่เปิดผู้ใช้ทั่วไป
- ไม่มีการเปิด billing และไม่แก้ไข OAuth ของ Sendfile
- Secret ไม่อยู่ในไฟล์เว็บ เอกสาร หรือ ZIP

Callback ของทั้งสาม: https://wabbwmoeuxszibgzolzx.supabase.co/auth/v1/callback

หน้าเว็บรับผล: https://wanatsarutpungkasem-lgtm.github.io/lottary/login.html
หน้าทดสอบ: http://127.0.0.1:4187/login.html

## งานคงเหลือก่อนเปิดสาธารณะ

ทดสอบให้กลับจาก provider แล้วแสดงบัญชีจริงได้ ตรวจ allowlist ของ Supabase ให้ครบ production/local รวม recovery เตรียมข้อมูล Branding Google ก่อน publish และทำข้อกำหนดเผยแพร่ Meta (ไอคอน นโยบายความเป็นส่วนตัว คำแนะนำลบข้อมูล หมวดหมู่ และขั้นตอนตรวจสอบที่ Meta กำหนด) ต้องใช้ข้อมูลจริงของเจ้าของ ไม่อ้างว่าผ่านแล้ว

การสมัครอีเมล/กู้รหัสผ่านยังรอ SMTP ตาม SMTP-SETUP.md ไม่ปิดการยืนยันอีเมลเพื่อเลี่ยงข้อจำกัด

โค้ดรุ่นนี้ยังไม่ถูกอัปโหลดไป GitHub Pages

ตรวจ Supabase redirect allowlist แล้วครบทั้ง 4 URL (production/local และ recovery)
