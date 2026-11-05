# 3.8 — Social login

เพิ่ม Google, GitHub, Facebook ผ่าน Supabase Auth โดยใช้ PKCE ตรวจ URL ก่อน redirect และตรวจสถานะ provider จาก backend จริง เก็บ Client Secret เฉพาะ Supabase เพิ่มหน้ารับผล localhost เฉพาะ origin ที่อนุมัติและอธิบายข้อมูล social login ในความเป็นส่วนตัว

ทดสอบอัตโนมัติ 39 รายการผ่าน ทดสอบ browser ถึงหน้าเลือกบัญชี Google และ consent GitHub/Facebook ยังไม่ยืนยัน callback จบ Google อยู่ Testing และ Facebook ยังต้องผ่านข้อกำหนดตรวจพิจารณา ดู OAUTH-SETUP.md อีเมลยังต้องตั้ง SMTP

ยังไม่ได้เผยแพร่ GitHub Pages อัปโหลดไฟล์รุ่นนี้ตาม workflow เดิมก่อนใช้ production
