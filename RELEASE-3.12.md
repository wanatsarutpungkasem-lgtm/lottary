# 3.12 — Navigation without wrong-state flashes / 11 พฤศจิกายน 2026

สาเหตุ: HTML เดิมเปิด guest landing และฟอร์ม login ไว้ตั้งแต่แรก ก่อน network getUser จะยืนยันบัญชี ส่วน header/gate/account ต่างเรียกตรวจสมาชิกซ้ำ และ pageshow/SIGNED_IN/visibility ทำให้สลับกลับ guest แม้เปิดหน้าที่ล็อกอินอยู่แล้ว

แก้: แสดง neutral loading แยกจาก guest/user ตั้งแต่ HTML แรก ซ่อน guest landing, login form และเนื้อหาส่วนตัวจนทราบสถานะ แชร์เฉพาะคำขอตรวจ getUser ที่เกิดพร้อมกัน ไม่ cache สิทธิ์ใน localStorage ไม่ข้าม server verification ไม่ล็อกหน้าที่กำลังใช้งานกลับ guest ตอนตรวจซ้ำบน focus ใช้ refresh เดียวเมื่อมีคำขอกำลังทำอยู่ และไม่โหลดประวัติซ้ำทุก focus

ออกจากระบบหรือแก้ผู้ใช้จะ invalidate คำขอเดิม ผลยืนยันที่มาหลัง sign-out ถูกทิ้ง ข้อมูลส่วนตัวไม่แสดงก่อนยืนยัน ลดการอ่าน OAuth settings เมื่ออยู่หน้าบัญชีที่ล็อกอินแล้ว

ตรวจ: 45 tests ผ่าน รวม concurrent request sharing, verification ใหม่สำหรับ action ถัดไป, invalidate ระหว่าง in-flight, HTML 初始 hidden/loading และ security เดิม
Browser จริงในพรีวิว: Google callback สำเร็จ → เซียมซี URL ตรง, guest hidden ระหว่าง pending → tool หลัง verified; บัญชีของฉัน: loginVisible false ทั้ง pending และ account-ready, accountVisible true เมื่อ verified

ยังมีเวลาโหลดไฟล์และตรวจบัญชีตามเครือข่าย แต่ไม่ใช้หน้าที่ผิดสถานะเป็น loading screen หน้า account ใช้ login.html เดียวกับระบบเดิม ซึ่งเป็น route บัญชีร่วม ไม่ใช่ redirect ไปหน้าแรก

รุ่นนี้ยังไม่อัปโหลดเว็บจริง อัปโหลดทั้ง source/dist แล้วรอ workflow ผ่านก่อนทดสอบ production
