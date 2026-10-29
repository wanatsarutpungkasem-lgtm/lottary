import {uniqueNumbers} from './discovery.js';
import {bangkokDay,normalizeDaily,recordDaily} from './daily-state.js';
const $=id=>document.getElementById(id),quotaKey='lucky-number-daily-v1';
let batch=[],memory=normalizeDaily(null),storageOK=true,generating=false;
function quota(){if(!storageOK)return normalizeDaily(memory);try{const raw=localStorage.getItem(quotaKey);return normalizeDaily(raw?JSON.parse(raw):memory);}catch{storageOK=false;return normalizeDaily(memory);}}
function refreshQuota(){const q=quota();$('number-quota').textContent='วันนี้เหลือ '+(3-q.used)+' / 3 ครั้ง · เริ่มรอบใหม่เที่ยงคืนเวลาไทย';$('numbers-generate').disabled=generating||q.used>=3;$('number-storage').textContent=storageOK?'บันทึกเลขล่าสุดและจำนวนครั้งไว้ในเบราว์เซอร์นี้ · ไม่ซิงก์ข้ามเครื่อง':'เบราว์เซอร์ไม่อนุญาตให้บันทึก เลขและจำนวนครั้งจะอยู่เฉพาะหน้านี้';}
function render(last,restored=false){
 batch=[...last.batch];$('number-collection').replaceChildren();
 $('number-digits').value=String(last.digits);$('number-count').value=String(batch.length);
 batch.forEach((value,i)=>{
  const article=document.createElement('article');article.className='number-option';
  const label=document.createElement('h2');label.textContent='ชุดที่ '+(i+1);
  const balls=document.createElement('div');balls.className='result-balls';balls.setAttribute('aria-label',value.split('').join(' '));
  for(const digit of value){const ball=document.createElement('span');ball.className='result-ball';const face=document.createElement('span');face.className='ball-digit';face.textContent=digit;ball.append(face);balls.append(ball);}
  const button=document.createElement('button');button.className='text-button';button.type='button';button.textContent='คัดลอกชุดนี้';button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(value);button.textContent='คัดลอกแล้ว ✓';}catch{button.textContent='กรุณาเลือกเลขแล้วคัดลอกเอง';}});
  article.append(label,balls,button);$('number-collection').append(article);
 });
 const total=10**last.digits,fmt=n=>n.toLocaleString('th-TH',{maximumFractionDigits:6});
 $('number-probability').textContent='หากเปรียบเทียบกับผลสุ่มเท่าเทียมหนึ่งชุดที่มี '+last.digits+' หลัก: โอกาสตรงแต่ละชุด '+fmt(100/total)+'% · โอกาสตรงหนึ่งใน '+batch.length+' ชุดนี้รวม '+fmt(batch.length*100/total)+'% ไม่ใช่โอกาสรวมของรางวัลทุกประเภท';
 $('number-probability').hidden=false;$('numbers-copy').hidden=false;$('numbers-copy').textContent='คัดลอกทุกชุด';
 $('numbers-status').textContent=(restored?'เลขล่าสุดที่บันทึกไว้':'เปิดเลขแล้ว '+batch.length+' ชุด')+' · '+new Date(last.time).toLocaleString('th-TH',{timeZone:'Asia/Bangkok',dateStyle:'medium',timeStyle:'short'});
}
function sync(){const q=quota();if(q.last)render(q.last,true);refreshQuota();}
sync();window.addEventListener('storage',event=>{if(event.key===quotaKey||event.key===null)sync();});window.addEventListener('focus',refreshQuota);setInterval(refreshQuota,30000);
$('numbers-form').addEventListener('submit',async event=>{
 event.preventDefault();if(generating)return;generating=true;refreshQuota();
 const generate=()=>{
  const q=quota();if(q.used>=3)throw new Error('ครบ 3 ครั้งของวันนี้แล้ว เลขล่าสุดยังคัดลอกได้ กลับมาเปิดชุดใหม่พรุ่งนี้ครับ');
  const digits=Number($('number-digits').value),count=Number($('number-count').value);
  const last={digits,batch:uniqueNumbers(digits,count),time:Date.now()};
  const next=recordDaily(q,last);memory=next;
  try{localStorage.setItem(quotaKey,JSON.stringify(next));}catch{storageOK=false;}
  render(last);document.dispatchEvent(new CustomEvent('lucky-sound',{detail:'reveal'}));
 };
 try{if(navigator.locks?.request)await navigator.locks.request(quotaKey,generate);else generate();}catch(error){$('numbers-status').textContent=error.message;}finally{generating=false;refreshQuota();}
});
$('numbers-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(batch.join('\n'));$('numbers-copy').textContent='คัดลอกทุกชุดแล้ว ✓';}catch{$('numbers-copy').textContent='กรุณาเลือกเลขแล้วคัดลอกเอง';}});
