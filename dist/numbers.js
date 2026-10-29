import {uniqueNumbers} from './discovery.js';
const $=id=>document.getElementById(id);let batch=[];
const quotaKey='lucky-number-daily-v1';
const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
let memory={date:today(),used:0};
function quota(){try{const value=JSON.parse(localStorage.getItem(quotaKey));return value&&value.date===today()?{date:today(),used:Math.max(0,Number(value.used)||0)}:{date:today(),used:0};}catch{return memory.date===today()?memory:{date:today(),used:0};}}
function refreshQuota(){const q=quota();$('number-quota').textContent='วันนี้เหลือ '+Math.max(0,3-q.used)+' / 3 ครั้ง · เริ่มรอบใหม่เที่ยงคืนเวลาไทย';$('numbers-generate').disabled=q.used>=3;}
function consume(){const q=quota();q.used++;memory=q;try{localStorage.setItem(quotaKey,JSON.stringify(q));}catch{}refreshQuota();}
refreshQuota();window.addEventListener('storage',refreshQuota);window.addEventListener('focus',refreshQuota);
$('numbers-form').addEventListener('submit',event=>{
 event.preventDefault();if(quota().used>=3){refreshQuota();$('numbers-status').textContent='ครบ 3 ครั้งของวันนี้แล้ว กลับมาเปิดชุดเลขใหม่วันพรุ่งนี้ได้ครับ';return;}$('numbers-generate').disabled=true;
 try{
  const digits=Number($('number-digits').value),count=Number($('number-count').value);batch=uniqueNumbers(digits,count);consume();$('number-collection').replaceChildren();
  batch.forEach((value,i)=>{
   const article=document.createElement('article');article.className='number-option';
   const label=document.createElement('h2');label.textContent='ชุดที่ '+(i+1);
   const balls=document.createElement('div');balls.className='result-balls';balls.setAttribute('aria-label',value.split('').join(' '));
   for(const digit of value){const ball=document.createElement('span');ball.className='result-ball';const face=document.createElement('span');face.className='ball-digit';face.textContent=digit;ball.append(face);balls.append(ball);}
   const button=document.createElement('button');button.className='text-button';button.type='button';button.textContent='คัดลอกชุดนี้';button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(value);button.textContent='คัดลอกแล้ว ✓';}catch{button.textContent='กรุณาเลือกเลขแล้วคัดลอกเอง';}});
   article.append(label,balls,button);$('number-collection').append(article);
  });
  const total=10**digits,fmt=n=>n.toLocaleString('th-TH',{maximumFractionDigits:6});
  $('number-probability').textContent='สมมติให้ผลเปรียบเทียบเป็นเลข '+digits+' หลักสุ่มเท่าเทียม 1 ชุด: แต่ละชุดมีโอกาสตรง '+fmt(100/total)+'% (1 ใน '+total.toLocaleString('th-TH')+') · โอกาสตรงหนึ่งใน '+count+' ชุดนี้รวม '+fmt(count*100/total)+'% ไม่ใช่ 80–90%';
  $('number-probability').hidden=false;$('numbers-copy').hidden=false;$('numbers-copy').textContent='คัดลอกทุกชุด';$('numbers-status').textContent='ได้ '+count+' ชุด · สุ่มใหม่ทุกครั้ง · ไม่มีชุดซ้ำภายในรอบ';
 }catch(error){$('numbers-status').textContent=error.message;}finally{refreshQuota();}
});
$('numbers-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(batch.join('\n'));$('numbers-copy').textContent='คัดลอกทุกชุดแล้ว ✓';}catch{$('numbers-copy').textContent='กรุณาเลือกเลขแล้วคัดลอกเอง';}});
