# ความปลอดภัย — Lucky By wanatsarut 3.5

## สิ่งที่ทำในไฟล์เว็บแล้ว

- Content Security Policy ผ่าน meta อยู่ก่อนทรัพยากรในทุกหน้า: อนุญาต JavaScript จาก origin เดียวกัน บล็อก inline script/eval, network connections, form submissions, object, frame และ worker
- รูปภาพอนุญาตจาก origin เดียวกัน, data และ blob เพื่อรองรับภาพในโปรเจกต์และการดาวน์โหลด สไตล์ยังต้องอนุญาต inline เพื่อรองรับ CSS variables และภาพเคลื่อนไหวเดิม ไม่ใช่ strict CSP ที่กำจัด inline style ทั้งหมด
- หน้า standalone ใช้ SHA-256 ของ inline script ที่สร้างจริง ไม่เปิด unsafe-inline ให้ JavaScript
- Referrer policy เป็น no-referrer
- ตรวจรูปแบบข้อมูล localStorage: ตัด field ที่ไม่รู้จัก จำกัดจำนวน/ขนาด ตรวจหมายเลข เวลา และใบเซียมซี รวมถึงข้อมูล null/ซ้ำ/เสียหาย
- ข้อมูลผู้ใช้แสดงด้วย textContent และ DOM methods ไม่มีการเพิ่ม HTML หรือ eval จากข้อความผู้ใช้
- ไม่เพิ่มรหัสผ่านผู้ดูแลใน JavaScript ไม่ฝัง secret หรือสร้างหน้าล็อกอินปลอมเพื่ออ้างว่าป้องกันการแก้โค้ด

## ขอบเขต

คนเปิดเว็บหรือใช้ Inspect เปลี่ยน HTML ในเครื่องตัวเองได้ การป้องกันในหน้านี้ไม่ใช่สิทธิ์แก้ repository บน GitHub โควตาและข้อมูลใน localStorage ยังแก้/ล้างได้ ไม่ใช่การยืนยันตัวบุคคล

CSP ไม่ป้องกันผู้ที่ได้สิทธิ์เขียน repository แล้ว และไม่ครอบคลุมทุกช่องโหว่ จึงไม่รับรองว่าป้องกันการโจมตีได้ 100%

GitHub Pages ชุดนี้ใช้ CSP meta; ไม่อ้างว่าตั้ง custom HTTP response headers แล้ว ไม่เพิ่ม frame-ancestors หรือ X-Frame-Options ลง meta เพราะไม่บังคับใช้จากตำแหน่งนั้น การบล็อกเว็บอื่นฝังหน้าเราอย่างครบถ้วนต้องใช้บริการที่ตั้ง response headers ได้

CSP และการยืนยัน GitHub ไม่ใช่การขอทบทวนคำเตือน Facebook ดู FACEBOOK-LINK-REVIEW.md แยกต่างหาก

## เจ้าของต้องยืนยันใน GitHub — ยังไม่ได้เปลี่ยนการตั้งค่าบัญชี

1. Account Settings > Password and authentication: ตั้งค่า 2FA ด้วย authenticator/security key หรือวิธีที่ GitHub มีให้ และเก็บ recovery codes ในที่ปลอดภัย เจ้าของต้องทำขั้นตอนยืนยันเอง ไม่ส่งรหัส OTP/recovery codes ให้ผู้อื่น
2. Account Settings > Sessions / Applications / SSH and GPG keys: ตรวจ session, app และ key ที่มีสิทธิ์ ดู security log หากพบกิจกรรมผิดปกติ เพิกถอนเฉพาะรายการที่ยืนยันแล้วว่าไม่ใช่ของตน
3. Repository Settings > Collaborators: ตรวจว่ามีเฉพาะคนที่ตั้งใจให้แก้เว็บ
4. Repository Settings > Rules > Rulesets: หากมีให้ใช้ ให้สร้าง branch ruleset สำหรับ main ป้องกัน deletion และ force push พิจารณา Require a pull request before merging เมื่อพร้อมเปลี่ยนขั้นตอนอัปโหลดไปใช้ branch + PR อย่าบังคับ review จากคนอื่นหากทำงานคนเดียวและไม่มี reviewer
5. Repository Settings > Pages: ตรวจแหล่ง Deploy ให้ถูก และ Enforce HTTPS ตามตัวเลือกที่ GitHub อนุญาต
6. ตรวจ Actions, deploy keys, installed apps และสิทธิ์ token เป็นระยะ อย่าอัปโหลด .env, private key หรือ access token ขึ้น repository หากเคยเผย secret แล้ว การลบไฟล์อย่างเดียวไม่พอ ต้องเพิกถอน/หมุน secret นั้น

ยังไม่ได้ตรวจหรือยืนยันสถานะ 2FA, ruleset, collaborators และการตั้งค่าอื่นข้างต้น ไม่ควรถือว่าเปิดไว้แล้วเพียงเพราะอัปโหลด ZIP

## หากพบช่องโหว่

แจ้งเจ้าของผ่านช่องทางส่วนตัวที่ตกลงไว้ ระบุหน้าที่พบ ขั้นตอนทำซ้ำ และผลกระทบ อย่าโพสต์รหัสผ่าน token ข้อมูลส่วนตัว หรือวิธีใช้โจมตีจริงใน issue สาธารณะ ยังไม่ได้เปิดช่องทาง private vulnerability reporting ของ GitHub ให้ repository นี้

## ผลทดสอบ

Build ผ่านและทดสอบอัตโนมัติ 33 ข้อ รวม CSP ของทั้ง 6 หน้า, hash ของ standalone, รูปแบบข้อมูลเสียหาย และตรวจ sink ที่เสี่ยง

รอบนี้ยังไม่ได้ทดสอบการบังคับ CSP ในเบราว์เซอร์จริง เพราะ browser use ถูกปิดในการตั้งค่า ผลทดสอบอัตโนมัติไม่ใช่ penetration test หลัง Deploy ต้องตรวจหมุนเลข เขย่า เก็บใบ ดาวน์โหลดภาพ คัดลอก และเมนูตั้งค่าบนมือถือจริงอีกครั้ง

## แหล่งอ้างอิง

- https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository
- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/reviewing-your-ssh-keys
- https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
- https://developer.chrome.com/docs/privacy-security/csp
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors
