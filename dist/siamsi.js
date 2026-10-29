import {secureIndex} from './discovery.js';
const cards=[
 {title:'ก้าวด้วยความไม่ประมาท',reading:'ใส่ใจกับสิ่งที่กำลังทำ และให้เวลาตัวเองพิจารณาก่อนตัดสินใจ',action:'ก่อนตัดสินใจหนึ่งเรื่อง ลองตรวจข้อมูลและผลกระทบที่คุณรู้ได้จริง'},
 {title:'ค่อย ๆ ฝึกใจให้มั่นคง',reading:'วันที่ความคิดวุ่นวาย ลองหยุดพักและกลับมาใส่ใจกับสิ่งตรงหน้า',action:'พักจากหน้าจอสักครู่ แล้วสังเกตลมหายใจโดยไม่ต้องรีบตัดสินความรู้สึก'},
 {title:'ฟังคำเตือนที่ช่วยให้เติบโต',reading:'คำแนะนำที่มีเหตุผลอาจช่วยให้มองเห็นสิ่งที่เรามองข้าม ลองรับฟังแล้วค่อยพิจารณา',action:'นึกถึงคำแนะนำหนึ่งอย่างที่มีเหตุผล แล้วเลือกสิ่งเล็ก ๆ ที่คุณปรับปรุงได้'},
 {title:'สร้างที่พึ่งจากการฝึกตน',reading:'เริ่มดูแลตัวเองจากเรื่องเล็ก ๆ ที่ทำได้ และค่อย ๆ ฝึกอย่างสม่ำเสมอ',action:'เลือกหนึ่งเรื่องที่คุณลงมือทำได้วันนี้ โดยไม่ต้องรอให้ทุกอย่างพร้อม'},
 {title:'ตอบความร้อนด้วยความเย็น',reading:'เมื่ออารมณ์ร้อน การเว้นจังหวะอาจช่วยให้เลือกคำพูดและการกระทำได้รอบคอบขึ้น',action:'หากกำลังไม่พอใจ ลองเว้นจังหวะก่อนตอบ และค่อยสื่อสารประเด็นที่จำเป็นอย่างสุภาพ'},
 {title:'ไม่ผัดวันของความดี',reading:'วันนี้ลองทำสิ่งที่เป็นประโยชน์เล็ก ๆ สักอย่าง โดยเริ่มจากสิ่งที่อยู่ใกล้ตัว',action:'ทำสิ่งดีที่ไม่ต้องใช้เงินสักอย่าง เช่น รักษาคำพูด ช่วยงาน หรือขอบคุณใครสักคน'}
];
const $=id=>document.getElementById(id),dialog=$('siamsi-dialog');let busy=false,current='';
for(const id of ['paper-close','paper-done'])$(id).addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');$('shake').focus({preventScroll:true});});
async function reveal(){
 if(busy)return;busy=true;$('shake').disabled=true;
 try{
  const index=secureIndex(cards.length),card=cards[index],reduced=(matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.effects==='soft');
  $('fallen-stick').classList.remove('drawn');$('cylinder').classList.add('shaking');$('shake-status').textContent='กำลังเขย่ากระบอก…';
  await new Promise(resolve=>setTimeout(resolve,reduced?0:300));
  $('cylinder').classList.remove('shaking');$('stick-number').textContent=String(index+1);$('fallen-stick').classList.add('drawn');$('shake-status').textContent='ได้ใบข้อคิดที่ '+(index+1);
  await new Promise(resolve=>setTimeout(resolve,reduced?0:750));
  $('paper-number').textContent='ใบข้อคิดของเว็บไซต์ · '+(index+1)+' / '+cards.length;
  $('paper-title').textContent=card.title;$('paper-reading').textContent=card.reading;$('paper-action').textContent=card.action;
  current=card.title+'\n'+card.reading+'\nลองนำไปใช้: '+card.action+'\nสรุปโดย Lucky By wanatsarut — ไม่ใช่ชุดคำทำนายของวัด';
  document.dispatchEvent(new CustomEvent('lucky-sound',{detail:'reveal'}));$('paper-copy').textContent='คัดลอกข้อคิด';dialog.showModal();document.body.classList.add('modal-open');
 }catch(error){$('shake-status').textContent=error.message;}finally{busy=false;$('shake').disabled=false;$('cylinder').classList.remove('shaking');}
}
$('paper-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(current);$('paper-copy').textContent='คัดลอกแล้ว ✓';}catch{$('paper-copy').textContent='กรุณาเลือกข้อความแล้วคัดลอกเอง';}});

const surface=$('shake-surface'),cylinder=$('cylinder');
let held=false,lastX=0,anchorX=0,direction=0,beats=0,pointer=null;
let tilt=0,velocity=0,targetTilt=0,sway=0,targetSway=0,frame=0,previous=0;
function animate(now){
 const step=previous?Math.min(2,(now-previous)/16.67):1;previous=now;
 velocity+=(targetTilt-tilt)*.14*step;velocity*=Math.pow(.69,step);tilt+=velocity*step;sway+=(targetSway-sway)*Math.min(1,.2*step);
 const soft=matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.effects==='soft';
 cylinder.style.transform='translateX('+(soft?sway*.2:sway)+'px) rotate('+(soft?tilt*.18:tilt)+'deg)';
 cylinder.style.setProperty('--rattle',Math.max(-13,Math.min(13,-velocity*3))+'deg');
 if(held||Math.abs(targetTilt-tilt)>.05||Math.abs(velocity)>.05||Math.abs(targetSway-sway)>.05)frame=requestAnimationFrame(animate);else{frame=0;previous=0;cylinder.style.transform='';cylinder.style.setProperty('--rattle','0deg');}
}
function wake(){if(!frame)frame=requestAnimationFrame(animate);}
function release(){held=false;pointer=null;surface.classList.remove('is-held');targetTilt=targetSway=0;wake();if(!busy&&beats<6)$('shake-status').textContent='จับกระบอกแล้วเขย่าต่ออีก '+(6-beats)+' จังหวะ';}
function resetShake(){release();beats=0;direction=0;$('shake-progress').value=0;$('fallen-stick').classList.remove('drawn');}
function beat(){beats++;document.dispatchEvent(new CustomEvent('lucky-sound',{detail:'wood'}));$('shake-progress').value=beats;$('shake-status').textContent='เขย่าแล้ว '+beats+' / 6 จังหวะ';if(beats>=6){release();reveal();}}
surface.addEventListener('pointerdown',event=>{if(busy||held||event.isPrimary===false||event.button!==0)return;if(beats>=6)resetShake();held=true;pointer=event.pointerId;lastX=anchorX=event.clientX;surface.setPointerCapture(pointer);surface.classList.add('is-held');$('shake-status').textContent='ลากสลับซ้าย–ขวาเพื่อเขย่า';wake();});
surface.addEventListener('pointermove',event=>{if(!held||busy||event.pointerId!==pointer)return;const movement=event.clientX-lastX,dx=event.clientX-anchorX;lastX=event.clientX;targetTilt=Math.max(-24,Math.min(24,targetTilt*.55+movement*1.1));targetSway=Math.max(-28,Math.min(28,dx*.55));if(Math.abs(dx)>=28){const next=Math.sign(dx);if(next!==direction){direction=next;beat();}anchorX=event.clientX;}});
for(const type of ['pointerup','pointercancel','lostpointercapture'])surface.addEventListener(type,event=>{if(event.pointerId===pointer)release();});
$('shake').addEventListener('click',()=>{if(busy)return;resetShake();$('shake-status').textContent='ลากกระบอกสลับซ้าย–ขวา หรือใช้ปุ่มลูกศรซ้าย–ขวาบนคีย์บอร์ด';$('shake').focus();});
$('shake').addEventListener('keydown',event=>{if(busy||!['ArrowLeft','ArrowRight'].includes(event.key)||event.repeat)return;event.preventDefault();const next=event.key==='ArrowLeft'?-1:1;if(next===direction)return;direction=next;targetTilt=next*20;targetSway=next*10;wake();beat();});
$('shake').addEventListener('keyup',()=>{targetTilt=targetSway=0;wake();});
dialog.addEventListener('close',resetShake);
