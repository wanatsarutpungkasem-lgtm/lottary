import {uniqueNumbers} from './discovery.js';
const $=id=>document.getElementById(id);let batch=[];
$('numbers-form').addEventListener('submit',event=>{
 event.preventDefault();$('numbers-generate').disabled=true;
 try{
  const digits=Number($('number-digits').value),count=Number($('number-count').value);batch=uniqueNumbers(digits,count);$('number-collection').replaceChildren();
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
 }catch(error){$('numbers-status').textContent=error.message;}finally{$('numbers-generate').disabled=false;}
});
$('numbers-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(batch.join('\n'));$('numbers-copy').textContent='คัดลอกทุกชุดแล้ว ✓';}catch{$('numbers-copy').textContent='กรุณาเลือกเลขแล้วคัดลอกเอง';}});
