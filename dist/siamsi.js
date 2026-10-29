import {secureIndex} from './discovery.js';
const cards=[
 {title:'ก้าวด้วยความไม่ประมาท',reading:'หลักความไม่ประมาทชวนให้มีสติและใส่ใจกับสิ่งที่กำลังทำ แทนการปล่อยให้ความเผลอไผลนำการกระทำ',action:'ก่อนตัดสินใจหนึ่งเรื่อง ลองตรวจข้อมูลและผลกระทบที่คุณรู้ได้จริง',reference:'อัปปมาทวรรค — คำอธิบายอรรถกถาธรรมบท ภาค 2 โดยกองวิชาการ มจร.',url:'https://acd.mcu.ac.th/?p=1957'},
 {title:'ค่อย ๆ ฝึกใจให้มั่นคง',reading:'จิตตวรรคกล่าวถึงจิตที่ควบคุมได้ยาก และคุณค่าของการฝึกจิตให้ตรงและสงบ',action:'พักจากหน้าจอสักครู่ แล้วสังเกตลมหายใจโดยไม่ต้องรีบตัดสินความรู้สึก',reference:'พระไตรปิฎก ฉบับหลวง เล่ม 25 ข้อ 13 — จิตตวรรค',url:'https://84000.org/tipitaka/read/v.php?A=366&B=25&Z=394&pagebreak=0'},
 {title:'ฟังคำเตือนที่ช่วยให้เติบโต',reading:'ปัณฑิตวรรคให้คุณค่ากับการคบผู้มีปัญญาที่ชี้ข้อบกพร่องและช่วยเตือนสติ',action:'นึกถึงคำแนะนำหนึ่งอย่างที่มีเหตุผล แล้วเลือกสิ่งเล็ก ๆ ที่คุณปรับปรุงได้',reference:'ธรรมบท ปัณฑิตวรรค คาถา 76 — ฉบับมหาจุฬาลงกรณราชวิทยาลัย',url:'https://84000.org/tipitaka/pitaka_item/m_line.php?A=1372&B=25'},
 {title:'สร้างที่พึ่งจากการฝึกตน',reading:'อัตตวรรคชี้ให้เห็นความสำคัญของการดูแลและฝึกตน รวมถึงการเริ่มปฏิบัติด้วยตนเอง',action:'เลือกหนึ่งเรื่องที่คุณลงมือทำได้วันนี้ โดยไม่ต้องรอให้ทุกอย่างพร้อม',reference:'ธรรมบท อัตตวรรค — พระไตรปิฎกฉบับหลวง เล่ม 25 ข้อ 22',url:'https://84000.org/tipitaka/book/v.php?A=692&B=25&Z=720'},
 {title:'ตอบความร้อนด้วยความเย็น',reading:'โกธวรรคกล่าวถึงการละความโกรธและการไม่ใช้ความโกรธตอบโต้ความโกรธ',action:'หากกำลังไม่พอใจ ลองเว้นจังหวะก่อนตอบ และค่อยสื่อสารประเด็นที่จำเป็นอย่างสุภาพ',reference:'ธรรมบท โกธวรรค — พระไตรปิฎกฉบับหลวง เล่ม 25 ข้อ 27',url:'https://84000.org/tipitaka/read/v.php?A=863&B=25&Z=895&pagebreak=0'},
 {title:'ไม่ผัดวันของความดี',reading:'ปาปวรรคแนะนำให้เร่งทำความดีและห้ามใจจากการทำสิ่งไม่ดี',action:'ทำสิ่งดีที่ไม่ต้องใช้เงินสักอย่าง เช่น รักษาคำพูด ช่วยงาน หรือขอบคุณใครสักคน',reference:'ธรรมบท ปาปวรรค — พระไตรปิฎกฉบับหลวง เล่ม 25 ข้อ 19',url:'https://84000.org/tipitaka/read/byitem.php?book=25&item=19&items=1&mode=bracket'}
];
const $=id=>document.getElementById(id),dialog=$('siamsi-dialog');let busy=false,current='';
for(const id of ['paper-close','paper-done'])$(id).addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');$('shake').focus({preventScroll:true});});
$('shake').addEventListener('click',async()=>{
 if(busy)return;busy=true;$('shake').disabled=true;
 try{
  const index=secureIndex(cards.length),card=cards[index],reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('fallen-stick').classList.remove('drawn');$('cylinder').classList.add('shaking');$('shake-status').textContent='กำลังเขย่ากระบอก…';
  await new Promise(resolve=>setTimeout(resolve,reduced?100:2100));
  $('cylinder').classList.remove('shaking');$('stick-number').textContent=String(index+1);$('fallen-stick').classList.add('drawn');$('shake-status').textContent='ได้ใบข้อคิดที่ '+(index+1);
  await new Promise(resolve=>setTimeout(resolve,reduced?0:750));
  $('paper-number').textContent='ใบข้อคิดของเว็บไซต์ · '+(index+1)+' / '+cards.length;
  $('paper-title').textContent=card.title;$('paper-reading').textContent=card.reading;$('paper-action').textContent=card.action;$('paper-reference').textContent=card.reference;$('paper-link').href=card.url;
  current=card.title+'\n'+card.reading+'\nลองนำไปใช้: '+card.action+'\nที่มา: '+card.reference+'\n'+card.url+'\nสรุปโดย Lucky By wanatsarut — ไม่ใช่ชุดคำทำนายของวัด';
  $('paper-copy').textContent='คัดลอกข้อคิด';dialog.showModal();document.body.classList.add('modal-open');
 }catch(error){$('shake-status').textContent=error.message;}finally{busy=false;$('shake').disabled=false;$('cylinder').classList.remove('shaking');}
});
$('paper-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(current);$('paper-copy').textContent='คัดลอกแล้ว ✓';}catch{$('paper-copy').textContent='กรุณาเลือกข้อความแล้วคัดลอกเอง';}});
