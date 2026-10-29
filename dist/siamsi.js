import {secureIndex} from './discovery.js';
import {cards} from './siamsi-cards.js';
import {createMotionSession} from './motion.js';
const $=id=>document.getElementById(id),dialog=$('siamsi-dialog');
let busy=false,ready=false,current='',currentCard=null,choice='',saved=[],saveOK=true;
const savedKey='lucky-siamsi-keeps-v1';
try{const value=JSON.parse(localStorage.getItem(savedKey)||'[]');if(Array.isArray(value))saved=value.filter(v=>Number.isInteger(v.id)&&v.id>=1&&v.id<=28&&Number.isFinite(v.time)).slice(0,28);}catch{saveOK=false;}
function showCard(card,kept=false){
 if(motion.running)motion.stop('stopped');
 currentCard=card;choice=kept?'keep':'';$('paper-number').textContent='ใบที่ '+card.id+' จาก 28 ใบ';$('paper-tone').textContent=card.tone;$('paper-title').textContent=card.title;$('paper-reading').textContent=card.reading;$('paper-action').textContent=card.action;$('paper-wish').textContent=card.wish;
 current='Lucky By wanatsarut · ใบที่ '+card.id+'\n'+card.title+'\n\n'+card.reading+'\n\nลองนำไปใช้: '+card.action+'\n\n'+card.wish+'\n\nข้อคิดเพื่อทบทวนตัวเอง ไม่ใช่คำพยากรณ์';
 $('paper-copy').textContent='คัดลอกข้อความ';$('paper-keep').disabled=kept;$('paper-keep').textContent=kept?'เก็บใบนี้แล้ว ✓':'เก็บใบนี้ไว้กับใจ';$('paper-choice-status').textContent=kept?'ใบที่คุณเลือกเก็บไว้':'';dialog.showModal();document.body.classList.add('modal-open');
}
for(const id of ['paper-close','paper-done'])$(id).addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');$('shake').focus({preventScroll:true});$('shake-status').textContent=choice==='keep'?'เก็บใบนี้ไว้แล้ว เปิดอ่านได้ด้านล่าง':choice==='leave'?'วางใบนี้ไว้ที่เว็บแล้ว ก้าวต่ออย่างเบาใจ':'ปิดใบข้อคิดแล้ว ยังไม่ได้เก็บใบนี้';});
async function reveal(){if(busy)return;busy=true;$('shake').disabled=true;$('motion-start').disabled=true;try{const card=cards[secureIndex(cards.length)],soft=matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.effects==='soft';$('ritual-step').textContent='๓ · รับข้อคิดที่ตรงใจ';$('fallen-stick').classList.remove('drawn');$('cylinder').classList.add('shaking');await new Promise(r=>setTimeout(r,soft?0:300));$('cylinder').classList.remove('shaking');$('stick-number').textContent=card.id;$('fallen-stick').classList.add('drawn');await new Promise(r=>setTimeout(r,soft?0:800));document.dispatchEvent(new CustomEvent('lucky-sound',{detail:'reveal'}));showCard(card);}catch(error){$('shake-status').textContent=error.message;}finally{busy=false;$('shake').disabled=false;$('motion-start').disabled=false;$('cylinder').classList.remove('shaking');}}
$('paper-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(current);$('paper-copy').textContent='คัดลอกแล้ว ✓';}catch{$('paper-copy').textContent='เลือกข้อความแล้วคัดลอกเองได้ครับ';}});
function renderSaved(){
 $('saved-leaves').replaceChildren();$('saved-note').textContent=saveOK?'เก็บเฉพาะเบราว์เซอร์นี้ ล้างข้อมูลเว็บไซต์แล้วจะหาย':'บันทึกถาวรไม่ได้ กรุณาดาวน์โหลดใบไว้ในเครื่อง';
 if(!saved.length){const text=document.createElement('p');text.className='saved-empty';text.textContent='ยังไม่มีใบที่เก็บไว้ หากข้อคิดใบไหนตรงใจ ค่อยเลือกเก็บกลับไปกับคุณ';$('saved-leaves').append(text);}
 for(const item of saved){const card=cards[item.id-1];const article=document.createElement('article'),title=document.createElement('h3'),note=document.createElement('p'),open=document.createElement('button'),remove=document.createElement('button');article.className='saved-leaf';title.textContent='ใบที่ '+card.id+' · '+card.title;note.textContent=card.wish;open.textContent='เปิดอ่าน';remove.textContent='วางใบนี้ไว้';open.className=remove.className='text-button';open.addEventListener('click',()=>showCard(card,true));remove.addEventListener('click',()=>{saved=saved.filter(v=>v.id!==card.id);persist();$('saved-message').textContent='วางใบที่ '+card.id+' ไว้แล้ว ขอให้ก้าวต่ออย่างเบาใจ';});article.append(title,note,open,remove);$('saved-leaves').append(article);}
}
function persist(){try{localStorage.setItem(savedKey,JSON.stringify(saved));saveOK=true;}catch{saveOK=false;}renderSaved();}
$('paper-keep').addEventListener('click',()=>{if(!currentCard)return;saved=[{id:currentCard.id,time:Date.now()},...saved.filter(v=>v.id!==currentCard.id)];persist();choice='keep';$('paper-keep').disabled=true;$('paper-keep').textContent='เก็บใบนี้แล้ว ✓';$('paper-choice-status').textContent=saveOK?'เก็บไว้ในเบราว์เซอร์แล้ว':'บันทึกไม่ได้ กรุณาดาวน์โหลดไว้ในเครื่อง';});
$('paper-leave').addEventListener('click',()=>{if(currentCard){saved=saved.filter(v=>v.id!==currentCard.id);persist();}choice='leave';dialog.close();});
$('paper-download').addEventListener('click',()=>{if(!currentCard)return;const url=URL.createObjectURL(new Blob([current],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Lucky-By-wanatsarut-leaf-'+currentCard.id+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
renderSaved();
const surface=$('shake-surface'),cylinder=$('cylinder');
let held=false,lastX=0,anchorX=0,direction=0,beats=0,pointer=null;
let tilt=0,velocity=0,targetTilt=0,sway=0,targetSway=0,frame=0,previous=0;
function animate(now){
 const step=previous?Math.min(2,(now-previous)/16.67):1;previous=now;
 velocity+=(targetTilt-tilt)*.14*step;velocity*=Math.pow(.69,step);tilt+=velocity*step;sway+=(targetSway-sway)*Math.min(1,.2*step);
 const soft=matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.effects==='soft';
 cylinder.style.transform='translateX(calc(-50% + '+(soft?sway*.2:sway)+'px)) rotate('+(soft?tilt*.18:tilt)+'deg)';
 cylinder.style.setProperty('--rattle',Math.max(-13,Math.min(13,-velocity*3))+'deg');
 if(held||Math.abs(targetTilt-tilt)>.05||Math.abs(velocity)>.05||Math.abs(targetSway-sway)>.05)frame=requestAnimationFrame(animate);else{frame=0;previous=0;cylinder.style.transform='';cylinder.style.setProperty('--rattle','0deg');}
}
function wake(){if(!frame)frame=requestAnimationFrame(animate);}
function release(announce=true){held=false;pointer=null;surface.classList.remove('is-held');targetTilt=targetSway=0;wake();if(announce&&!busy&&beats<6)$('shake-status').textContent='จับกระบอกแล้วเขย่าต่ออีก '+(6-beats)+' จังหวะ';}
function resetShake(){release(false);beats=0;direction=0;$('shake-progress').value=0;$('fallen-stick').classList.remove('drawn');}
function beat(){beats++;document.dispatchEvent(new CustomEvent('lucky-sound',{detail:'wood'}));$('shake-progress').value=beats;$('shake-status').textContent='เขย่าแล้ว '+beats+' / 6 จังหวะ';if(beats>=6){release();reveal();}}
surface.addEventListener('pointerdown',event=>{if(motion.running)return;if(!ready){$('shake-status').textContent='กดตั้งจิตก่อน แล้วค่อยจับกระบอกเขย่าครับ';return;}if(busy||held||event.isPrimary===false||event.button!==0)return;if(beats>=6)resetShake();held=true;pointer=event.pointerId;lastX=anchorX=event.clientX;surface.setPointerCapture(pointer);surface.classList.add('is-held');$('shake-status').textContent='ลากสลับซ้าย–ขวาเพื่อเขย่า';wake();});
surface.addEventListener('pointermove',event=>{if(!held||busy||event.pointerId!==pointer)return;const movement=event.clientX-lastX,dx=event.clientX-anchorX;lastX=event.clientX;targetTilt=Math.max(-24,Math.min(24,targetTilt*.55+movement*1.1));targetSway=Math.max(-28,Math.min(28,dx*.55));if(Math.abs(dx)>=28){const next=Math.sign(dx);if(next!==direction){direction=next;beat();}anchorX=event.clientX;}});
for(const type of ['pointerup','pointercancel','lostpointercapture'])surface.addEventListener(type,event=>{if(event.pointerId===pointer)release();});
$('shake').addEventListener('click',()=>{if(busy)return;if(motion.running)motion.stop('stopped');$('motion-status').textContent='กำลังใช้วิธีลากบนหน้าจอ · กดปุ่มโทรศัพท์เพื่อเปลี่ยนกลับ';resetShake();ready=true;$('ritual-step').textContent='๒ · จับกระบอกแล้วเขย่า';$('shake').textContent='ตั้งจิตแล้ว · พร้อมเขย่า ↔';$('shake-status').textContent='ลากกระบอกสลับซ้าย–ขวา หรือใช้ปุ่มลูกศรซ้าย–ขวาบนคีย์บอร์ด';$('shake').focus();});
$('shake').addEventListener('keydown',event=>{if(motion.running||!ready||busy||!['ArrowLeft','ArrowRight'].includes(event.key)||event.repeat)return;event.preventDefault();const next=event.key==='ArrowLeft'?-1:1;if(next===direction)return;direction=next;targetTilt=next*20;targetSway=next*10;wake();beat();});
$('shake').addEventListener('keyup',()=>{targetTilt=targetSway=0;wake();});
dialog.addEventListener('close',()=>{$('motion-status').textContent='หากต้องการเขย่าเครื่องอีกครั้ง กดปุ่มโทรศัพท์เพื่อเริ่มใหม่';resetShake();ready=false;$('ritual-step').textContent='๑ · ตั้งจิตก่อนเริ่ม';$('shake').textContent='ใช้วิธีลากบนหน้าจอแทน';});

// Motion data stays on this device and is never used to choose the result.
const motion=createMotionSession({target:window,MotionEvent:window.DeviceMotionEvent,secureContext:window.isSecureContext,
 onReady(){if(!busy)$('motion-status').textContent='เซนเซอร์พร้อมแล้ว จับโทรศัพท์ให้มั่น แล้วเขย่าเบา ๆ 6 จังหวะ';},
 onBeat(count,impulse){if(!ready||busy||dialog.open)return;targetTilt=Math.max(-22,Math.min(22,impulse*1.7));targetSway=targetTilt*.6;wake();beat();setTimeout(()=>{targetTilt=targetSway=0;wake();},120);},
 onState(state){
  const listening=state==='listening'||state==='requesting';$('motion-stop').hidden=!listening;$('motion-start').disabled=state==='requesting'||busy;
  $('motion-start').textContent=state==='requesting'?'กำลังขอสิทธิ์เซนเซอร์…':state==='listening'?'📱 เริ่มเขย่าโทรศัพท์ใหม่':'📱 ตั้งจิต · เขย่าด้วยโทรศัพท์';
  const text={idle:'',requesting:'อนุญาตการเคลื่อนไหวเมื่อเบราว์เซอร์ถาม เพื่อใช้การเขย่าเครื่อง',listening:'กำลังรอสัญญาณจากเครื่อง… ถือให้มั่นแล้วเขย่าเบา ๆ',denied:'ยังไม่ได้รับอนุญาตให้ใช้การเคลื่อนไหว กดเพื่อลองใหม่ หรือใช้วิธีลากแทน',unsupported:'เครื่องหรือเบราว์เซอร์นี้ไม่รองรับการเขย่าโทรศัพท์ ใช้วิธีลากแทนได้',insecure:'เปิดเว็บผ่าน HTTPS เพื่อใช้การเขย่าโทรศัพท์ หรือใช้วิธีลากแทน',unavailable:'ยังไม่พบข้อมูลเซนเซอร์ ลองเปิดเว็บโดยตรงในเบราว์เซอร์ แล้วกดอีกครั้ง หรือใช้วิธีลากแทน',error:'เปิดเซนเซอร์ไม่สำเร็จ ลองใหม่หรือใช้วิธีลากแทนได้',paused:'หยุดเซนเซอร์เมื่อออกจากหน้าแล้ว กดปุ่มเพื่อเริ่มใหม่',stopped:'หยุดการเขย่าโทรศัพท์แล้ว',complete:'ครบ 6 จังหวะแล้ว กำลังเปิดใบข้อคิด'};
  $('motion-status').textContent=text[state]||'';
  if(!listening&&state!=='complete'&&state!=='idle')ready=false;
 }
});
$('motion-start').addEventListener('click',()=>{if(busy||dialog.open)return;resetShake();ready=true;$('ritual-step').textContent='๒ · เขย่าโทรศัพท์เบา ๆ';$('shake-status').textContent='รอการเขย่าจากโทรศัพท์';motion.start();});
$('motion-stop').addEventListener('click',()=>{motion.stop('stopped');release(false);});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&motion.running){motion.stop('paused');release(false);}});
window.addEventListener('pagehide',()=>motion.stop('paused'));
window.addEventListener('resize',()=>{if(held)release(false);});

// Draw the souvenir locally. No remote image, font, or rendering service.
$('paper-image').addEventListener('click',async()=>{
 if(!currentCard)return;const card={...currentCard},button=$('paper-image');button.disabled=true;button.textContent='กำลังเตรียมภาพของคุณ…';
 try{
  if(document.fonts?.ready)await document.fonts.ready;
  const canvas=document.createElement('canvas');canvas.width=1080;let ctx=canvas.getContext('2d');if(!ctx)throw new Error('เบราว์เซอร์นี้ไม่รองรับการสร้างภาพ');
  const family='Tahoma, Thonburi, system-ui, sans-serif';
  function lines(text,size,bold=false){ctx.font=(bold?'600 ':'400 ')+size+'px '+family;const segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter('th',{granularity:'word'}):null;const units=segmenter?Array.from(segmenter.segment(text),s=>s.segment):Array.from(text);const out=[];let line='';for(const unit of units){if(ctx.measureText(line+unit).width>844&&line){out.push(line.trimEnd());line=unit.trimStart();}else line+=unit;}if(line)out.push(line);return out;}
  const title=lines(card.title,56,true),reading=lines(card.reading,38),action=lines(card.action,38),wish=lines(card.wish,35);
  canvas.height=740+title.length*76+reading.length*65+action.length*65+wish.length*58;
  ctx=canvas.getContext('2d');const gradient=ctx.createLinearGradient(0,0,1080,canvas.height);gradient.addColorStop(0,'#fcf2dc');gradient.addColorStop(1,'#eddbb7');ctx.fillStyle=gradient;ctx.fillRect(0,0,1080,canvas.height);
  ctx.strokeStyle='#ac8248';ctx.lineWidth=3;ctx.strokeRect(36,36,1008,canvas.height-72);ctx.strokeStyle='#c8a970';ctx.lineWidth=1;ctx.strokeRect(49,49,982,canvas.height-98);
  for(const x of [75,1005])for(const y of [75,canvas.height-75]){ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);ctx.strokeStyle='#a97e40';ctx.strokeRect(-12,-12,24,24);ctx.restore();}
  ctx.fillStyle='#7c5b32';ctx.font='500 28px '+family;ctx.fillText('LUCKY BY WANATSARUT',112,135);ctx.font='400 32px '+family;ctx.fillText('เซียมซีข้อคิด · ใบที่ '+card.id+' / 28',112,205);
  let y=285;function write(values,size,lineHeight,color,bold=false){ctx.fillStyle=color;ctx.font=(bold?'600 ':'400 ')+size+'px '+family;for(const line of values){ctx.fillText(line,112,y);y+=lineHeight;}}
  write(title,56,76,'#712c24',true);y+=24;ctx.strokeStyle='#b39464';ctx.beginPath();ctx.moveTo(112,y);ctx.lineTo(956,y);ctx.stroke();y+=80;
  write(reading,38,65,'#3c3025');y+=38;write(['ลองนำไปใช้'],34,58,'#793c2b',true);write(action,38,65,'#3c3025');y+=44;write(wish,35,58,'#78552c');
  ctx.font='400 25px '+family;ctx.fillStyle='#76634b';ctx.fillText('ข้อคิดเพื่อทบทวนตัวเอง ไม่ใช่คำพยากรณ์',112,canvas.height-150);ctx.fillText('เก็บสิ่งที่ตรงใจ แล้วก้าวต่ออย่างเบาใจ',112,canvas.height-105);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('สร้างภาพไม่สำเร็จ ลองดาวน์โหลดข้อความแทนได้ครับ');const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='Lucky-By-wanatsarut-leaf-'+card.id+'-v3.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('paper-choice-status').textContent='ส่งภาพ PNG ให้เบราว์เซอร์ดาวน์โหลดแล้ว';
 }catch(error){$('paper-choice-status').textContent=error.message;}finally{button.disabled=false;button.textContent='บันทึกใบนี้เป็นภาพ PNG';}
});
