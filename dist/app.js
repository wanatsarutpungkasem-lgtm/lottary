import {randomDigits} from './random.js';
const $ = id => document.getElementById(id);
const signs={
 none:['✧','ช่วงเวลาของคุณ','ตั้งความปรารถนาดี ๆ ให้ตัวเอง แล้วเริ่มหมุน'],
 aries:['♈︎','ราศีเมษ · ธาตุไฟ','เริ่มจากก้าวเล็ก ๆ ที่คุณเลือกได้'],
 taurus:['♉︎','ราศีพฤษภ · ธาตุดิน','ให้เวลากับสิ่งที่คุณอยากเห็นเติบโต'],
 gemini:['♊︎','ราศีเมถุน · ธาตุลม','เปิดใจรับมุมมองที่ต่างจากเดิม'],
 cancer:['♋︎','ราศีกรกฎ · ธาตุน้ำ','ดูแลหัวใจตัวเองเหมือนที่ดูแลคนสำคัญ'],
 leo:['♌︎','ราศีสิงห์ · ธาตุไฟ','ให้ความสามารถของคุณได้มีพื้นที่เปล่งประกาย'],
 virgo:['♍︎','ราศีกันย์ · ธาตุดิน','ความก้าวหน้าเล็กน้อยก็มีความหมาย'],
 libra:['♎︎','ราศีตุลย์ · ธาตุลม','เว้นพื้นที่ให้ทั้งเหตุผลและความรู้สึก'],
 scorpio:['♏︎','ราศีพิจิก · ธาตุน้ำ','วางสิ่งเก่าเพื่อเปิดพื้นที่ให้สิ่งใหม่'],
 sagittarius:['♐︎','ราศีธนู · ธาตุไฟ','อนุญาตให้ตัวเองลองเส้นทางใหม่'],
 capricorn:['♑︎','ราศีมังกร · ธาตุดิน','ก้าวอย่างสม่ำเสมอในจังหวะของตัวเอง'],
 aquarius:['♒︎','ราศีกุมภ์ · ธาตุลม','ให้คุณค่ากับสิ่งที่ทำให้คุณแตกต่าง'],
 pisces:['♓︎','ราศีมีน · ธาตุน้ำ','อ่อนโยนกับความฝันและความรู้สึกของตัวเอง']
};
function setSign(){const sign=signs[$('zodiac').value]||signs.none;$('sign-glyph').textContent=sign[0];$('sign-title').textContent=sign[1];$('sign-thought').textContent=sign[2];}
const requestedSign=new URLSearchParams(location.search).get('sign');
if(requestedSign&&Object.hasOwn(signs,requestedSign))$('zodiac').value=requestedSign;
setSign();
$('zodiac').addEventListener('change',()=>{setSign();placeholders();});
const key = 'lucky-orbit-history-v1';
let history = [], current = '', busy = false, storageOK = true;
try { const value = JSON.parse(localStorage.getItem(key) || '[]'); if(Array.isArray(value)) history=value.filter(x=>x&&typeof x.name==='string'&&/^\d{2}$|^\d{3}$|^\d{6}$/.test(x.number)&&Number.isFinite(x.time)).slice(0,200); } catch { storageOK=false; }
const ballPalette=[['#fff2bf','#e5b851','#8b5817']];
function paintBall(ball,digit){
 const colors=ballPalette[Number(digit)%ballPalette.length];
 ball.style.setProperty('--ball-hi',colors[0]);ball.style.setProperty('--ball-color',colors[1]);ball.style.setProperty('--ball-dark',colors[2]);
 const label=document.createElement('span');label.className='ball-digit';label.textContent=digit;ball.replaceChildren(label);
}
const positions=[[25,59],[43,64],[61,57],[12,45],[31,40],[52,42],[69,36],[20,22],[41,20],[60,16],[8,64],[46,2],[72,61],[28,76]];
positions.forEach(([x,y], i)=>{const b=document.createElement('span');b.className='ball';b.style.left=x+'%';b.style.top=y+'%';paintBall(b,String(i%10));$('mixer').append(b);});
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
let ballAnimations=[];
function startMixing(){
 const size=$('mixer').getBoundingClientRect().width;
 $('mixer').querySelectorAll('.ball').forEach((ball,i)=>{
  const [x,y]=positions[i], dx=x-40.5, dy=y-40.5;
  const radius=Math.hypot(dx,dy), start=Math.atan2(dy,dx);
  const frames=Array.from({length:49},(_,j)=>{
   const progress=j/48, wave=Math.sin(progress*Math.PI), angle=start+progress*Math.PI*6+Math.sin(progress*Math.PI*4+i*.5)*wave*.35;
   const r=radius+(28-radius)*wave;
   const depth=Math.sin(angle);
   return {transform:`translate3d(${(40.5+Math.cos(angle)*r-x)*size/100}px,${(40.5+Math.sin(angle)*r-y)*size/100}px,0) scale(${1+depth*.1*wave}) rotate(${progress*1080}deg)`,filter:`brightness(${1+depth*.15*wave})`};
  });
  ballAnimations.push(ball.animate(frames,{duration:2000+(i%4)*130,iterations:Infinity,easing:'linear'}));
 });
}
function stopMixing(){
 ballAnimations.forEach(animation=>{
  const ball=animation.effect.target, pose=getComputedStyle(ball).transform;
  animation.cancel();
  ball.animate([{transform:pose},{transform:'none'}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'});
 });ballAnimations=[];
}
async function revealDraw(number,reduced){
 $('result-balls').replaceChildren();
 const slots=[...number].map(()=>{const b=document.createElement('span');b.className='result-ball placeholder';b.textContent='?';$('result-balls').append(b);return b;});
 for(let i=0;i<slots.length;i++){
  if(!reduced){if(i===slots.length-1)document.getElementById('movable-machine').classList.add('reveal-flash','ceremony-finale');slots[i].classList.add('awaiting');await pause(i===0?350:480);}
  slots[i].className='result-ball revealed';paintBall(slots[i],number[i]);
  $('result-label').textContent=`กำลังเปิดลูกที่ ${i+1} จาก ${slots.length}`;
 }
}
function name(){ return $('player').value.trim().normalize('NFC') || 'ผู้เล่น'; }
function time(t){return new Date(t).toLocaleString('th-TH',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});}
function renderHistory(){
 const items=history.filter(x=>x.name===name()).slice(0,8);$('history-list').replaceChildren();
 if(!items.length){const p=document.createElement('p');p.className='empty';p.textContent='ยังไม่มีการสุ่ม เริ่มเก็บเลขชุดแรกของคุณได้เลย ✧';$('history-list').append(p);}
 items.forEach(item=>{const card=document.createElement('article');card.className='history-item';const n=document.createElement('strong');n.textContent=item.number;const p=document.createElement('p');p.textContent=item.name+' · '+(item.sign&&signs[item.sign]&&item.sign!=='none'?signs[item.sign][0]+' ':'')+time(item.time);card.append(n,p);$('history-list').append(card);});
 $('clear').disabled=!items.length;
 $('history-note').textContent=storageOK?'แสดง 8 ครั้งล่าสุดของชื่อที่เลือก · เก็บรวมสูงสุด 200 รายการในเบราว์เซอร์นี้':'เบราว์เซอร์ไม่อนุญาตให้บันทึก ประวัติจะอยู่ชั่วคราวจนกว่าจะปิดหน้านี้';
}
function save(){try{localStorage.setItem(key,JSON.stringify(history));}catch{storageOK=false;}}
const drawDialog=$('draw-dialog');
function openDrawDialog(number,player,signKey){
 $('popup-player').textContent='เลขชุดนี้ของ '+player;
 $('popup-balls').replaceChildren();
 for(const digit of number){const ball=document.createElement('span');ball.className='result-ball';paintBall(ball,digit);$('popup-balls').append(ball);}
 $('popup-balls').setAttribute('aria-label','เลขที่สุ่มได้ '+number.split('').join(' '));
 $('popup-sign').textContent=signKey!=='none'?signs[signKey][0]+' '+signs[signKey][1]:'';
 $('popup-copy').textContent='คัดลอกเลข';
 drawDialog.showModal();document.body.classList.add('modal-open');
}
function closeDrawDialog(){drawDialog.close();}
$('popup-close').addEventListener('click',closeDrawDialog);
$('popup-done').addEventListener('click',closeDrawDialog);
drawDialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');$('draw').focus({preventScroll:true});});
drawDialog.addEventListener('click',event=>{if(event.target===drawDialog){const rect=drawDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeDrawDialog();}});
$('popup-copy').addEventListener('click',async()=>{if(!current)return;try{await navigator.clipboard.writeText(current);$('popup-copy').textContent='คัดลอกแล้ว ✓';}catch{$('popup-copy').textContent='กรุณาเลือกเลขแล้วคัดลอกเอง';}});
function showBalls(number){$('result-balls').replaceChildren();for(const [i,d] of [...number].entries()){const b=document.createElement('span');b.className='result-ball';b.style.animationDelay=(i*100)+'ms';paintBall(b,d);$('result-balls').append(b);}}
function placeholders(){current='';$('copy').hidden=true;$('result-label').textContent='เลขชุดต่อไป กำลังรอคุณอยู่';$('result-note').textContent='หายใจลึก ๆ แล้วลองหมุนดูสักครั้ง';$('result-balls').replaceChildren();for(let i=0;i<Number(document.querySelector('[name=digits]:checked').value);i++){const b=document.createElement('span');b.className='result-ball placeholder';b.textContent='?';$('result-balls').append(b);}}
$('player').addEventListener('input',()=>{renderHistory();placeholders();});
document.querySelectorAll('[name=digits]').forEach(input=>input.addEventListener('change',placeholders));
$('draw-form').addEventListener('submit',async e=>{
 e.preventDefault();if(busy)return;busy=true;
 const signKey=$('zodiac').value;
 const player=name(), digits=Number(document.querySelector('[name=digits]:checked').value);
 $('draw').disabled=true;$('player').disabled=true;$('zodiac').disabled=true;document.querySelectorAll('[name=digits]').forEach(x=>x.disabled=true);$('copy').hidden=true;current='';
 try {
  // Decide the result exactly once; the animation never changes or filters it.
  const number=randomDigits(digits), reduced=(matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.effects==='soft');
  document.getElementById('movable-machine').classList.remove('reveal-flash','ceremony-finale');$('universe').classList.remove('celebrate');$('universe').classList.add('spinning');document.getElementById('movable-machine').classList.add('draw-ceremony');
  document.querySelector('.live-dot').textContent='กำลังหมุน';$('result-label').textContent='เริ่มเขย่าลูกบอล…';$('result-note').textContent='รอลุ้นเลขของคุณทีละลูก';
  if(!reduced)startMixing();
  await pause(reduced?100:1100);
  $('result-label').textContent='ลูกบอลกำลังรวมตัว…';$('universe').classList.add('peak');
  await pause(reduced?0:1100);
  $('universe').classList.add('revealing');document.querySelector('.live-dot').textContent='เปิดผลทีละลูก';
  await revealDraw(number,reduced);
  current=number;document.dispatchEvent(new CustomEvent('lucky-sound',{detail:'reveal'}));$('universe').classList.add('celebrate');$('result-label').textContent='เลขชุดนี้ของ '+player;$('result-note').textContent=digits+' หลัก · '+(signKey!=='none'?signs[signKey][0]+' '+signs[signKey][1].split(' · ')[0]+' · ':'')+time(Date.now());$('copy').hidden=false;$('copy').textContent='คัดลอกเลข ↗';history.unshift({name:player,number,time:Date.now(),sign:signKey});history=history.slice(0,200);save();renderHistory();
  await pause(reduced?0:1100);
  openDrawDialog(number,player,signKey);
 }catch(error){$('result-label').textContent='ยังสุ่มไม่สำเร็จ';$('result-note').textContent=error.message;}
 finally{stopMixing();busy=false;$('draw').disabled=false;$('player').disabled=false;$('zodiac').disabled=false;document.querySelectorAll('[name=digits]').forEach(x=>x.disabled=false);$('universe').classList.remove('spinning','peak','revealing');document.getElementById('movable-machine').classList.remove('draw-ceremony');document.querySelector('.live-dot').textContent='พร้อมหมุน';}
});
$('copy').addEventListener('click',async()=>{if(!current)return;try{await navigator.clipboard.writeText(current);$('copy').textContent='คัดลอกแล้ว ✓';}catch{$('copy').textContent='คัดลอกไม่ได้ กรุณาเลือกเลขแล้วคัดลอกเอง';}});
$('clear').addEventListener('click',()=>{history=history.filter(x=>x.name!==name());save();renderHistory();});
renderHistory();

// Move only from the dedicated handle. Form controls keep their normal gestures.
const movable=$('movable-machine'),handle=$('drag-handle');
let offset={x:0,y:0},drag=null;
function placeMachine(x,y){
 const rect=movable.getBoundingClientRect();
 const originX=rect.left-offset.x,originY=rect.top-offset.y;
 const grip=handle.getBoundingClientRect();
 // Keep a usable piece of the handle inside the current viewport.
 const minX=24-originX, maxX=Math.max(minX,window.innerWidth-160-originX);
 const minY=12-originY,maxY=Math.max(minY,window.innerHeight-64-originY);
 offset={x:Math.max(minX,Math.min(maxX,x)),y:Math.max(minY,Math.min(maxY,y))};
 movable.style.transform=`translate3d(${offset.x}px,${offset.y}px,0)`;
 $('restore-floating').hidden=offset.x===0&&offset.y===0;
}
function resetMachine(){offset={x:0,y:0};movable.style.transform='';$('restore-floating').hidden=true;}
handle.addEventListener('pointerdown',event=>{if(event.button!==0)return;drag={id:event.pointerId,x:event.clientX,y:event.clientY,baseX:offset.x,baseY:offset.y};handle.setPointerCapture(event.pointerId);movable.classList.add('is-dragging');event.preventDefault();});
handle.addEventListener('pointermove',event=>{if(!drag||event.pointerId!==drag.id)return;placeMachine(drag.baseX+event.clientX-drag.x,drag.baseY+event.clientY-drag.y);});
function endDrag(){drag=null;movable.classList.remove('is-dragging');}
handle.addEventListener('pointerup',endDrag);handle.addEventListener('pointercancel',endDrag);handle.addEventListener('lostpointercapture',endDrag);
handle.addEventListener('keydown',event=>{const delta=event.shiftKey?40:12;const steps={ArrowLeft:[-delta,0],ArrowRight:[delta,0],ArrowUp:[0,-delta],ArrowDown:[0,delta]};if(event.key==='Home'){event.preventDefault();resetMachine();}else if(steps[event.key]){event.preventDefault();const [x,y]=steps[event.key];placeMachine(offset.x+x,offset.y+y);}});
$('reset-machine').addEventListener('click',resetMachine);
$('restore-floating').addEventListener('click',resetMachine);
$('toggle-machine').addEventListener('click',()=>{const content=$('machine-content');content.hidden=!content.hidden;$('toggle-machine').setAttribute('aria-expanded',String(!content.hidden));$('toggle-machine').textContent=content.hidden?'แสดงเครื่องสุ่ม':'ชมพื้นหลัง';if(content.hidden)resetMachine();});
window.addEventListener('resize',resetMachine);
