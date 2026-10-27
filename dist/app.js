import {randomDigits} from './random.js';
const $ = id => document.getElementById(id);
const key = 'lucky-orbit-history-v1';
let history = [], current = '', busy = false, storageOK = true;
try { const value = JSON.parse(localStorage.getItem(key) || '[]'); if(Array.isArray(value)) history=value.filter(x=>x&&typeof x.name==='string'&&/^\d{2}$|^\d{3}$|^\d{6}$/.test(x.number)&&Number.isFinite(x.time)).slice(0,200); } catch { storageOK=false; }
const positions=[[25,59],[43,64],[61,57],[12,45],[31,40],[52,42],[69,36],[20,22],[41,20],[60,16],[8,64],[46,2],[72,61],[28,76]];
positions.forEach(([x,y], i)=>{const b=document.createElement('span');b.className='ball';b.style.left=x+'%';b.style.top=y+'%';b.textContent=i%10;$('mixer').append(b);});
function name(){ return $('player').value.trim().normalize('NFC') || 'ผู้เล่น'; }
function time(t){return new Date(t).toLocaleString('th-TH',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});}
function renderHistory(){
 const items=history.filter(x=>x.name===name()).slice(0,8);$('history-list').replaceChildren();
 if(!items.length){const p=document.createElement('p');p.className='empty';p.textContent='ยังไม่มีการสุ่ม เริ่มเก็บเลขชุดแรกของคุณได้เลย ✧';$('history-list').append(p);}
 items.forEach(item=>{const card=document.createElement('article');card.className='history-item';const n=document.createElement('strong');n.textContent=item.number;const p=document.createElement('p');p.textContent=item.name+' · '+time(item.time);card.append(n,p);$('history-list').append(card);});
 $('clear').disabled=!items.length;
 $('history-note').textContent=storageOK?'แสดง 8 ครั้งล่าสุดของชื่อที่เลือก · เก็บรวมสูงสุด 200 รายการในเบราว์เซอร์นี้':'เบราว์เซอร์ไม่อนุญาตให้บันทึก ประวัติจะอยู่ชั่วคราวจนกว่าจะปิดหน้านี้';
}
function save(){try{localStorage.setItem(key,JSON.stringify(history));}catch{storageOK=false;}}
function showBalls(number){$('result-balls').replaceChildren();for(const [i,d] of [...number].entries()){const b=document.createElement('span');b.className='result-ball';b.style.animationDelay=(i*100)+'ms';b.textContent=d;$('result-balls').append(b);}}
function placeholders(){current='';$('copy').hidden=true;$('result-label').textContent='เลขชุดต่อไป กำลังรอคุณอยู่';$('result-note').textContent='หายใจลึก ๆ แล้วลองหมุนดูสักครั้ง';$('result-balls').replaceChildren();for(let i=0;i<Number(document.querySelector('[name=digits]:checked').value);i++){const b=document.createElement('span');b.className='result-ball placeholder';b.textContent='?';$('result-balls').append(b);}}
$('player').addEventListener('input',()=>{renderHistory();placeholders();});
document.querySelectorAll('[name=digits]').forEach(input=>input.addEventListener('change',placeholders));
$('draw-form').addEventListener('submit',async e=>{
 e.preventDefault();if(busy)return;busy=true;
 const player=name(), digits=Number(document.querySelector('[name=digits]:checked').value);
 $('draw').disabled=true;$('player').disabled=true;document.querySelectorAll('[name=digits]').forEach(x=>x.disabled=true);$('copy').hidden=true;current='';
 try {
  // Decide the result exactly once; the animation never changes or filters it.
  const number=randomDigits(digits);$('universe').classList.add('spinning');document.querySelector('.live-dot').textContent='กำลังหมุน';$('result-label').textContent='ลูกบอลกำลังหมุน…';$('result-note').textContent='กำลังเปิดเลขชุดใหม่ของคุณ';
  await new Promise(resolve=>setTimeout(resolve,matchMedia('(prefers-reduced-motion: reduce)').matches?150:2100));
  current=number;showBalls(number);$('result-label').textContent='เลขชุดนี้ของ '+player;$('result-note').textContent=digits+' หลัก · '+time(Date.now());$('copy').hidden=false;$('copy').textContent='คัดลอกเลข ↗';history.unshift({name:player,number,time:Date.now()});history=history.slice(0,200);save();renderHistory();
 }catch(error){$('result-label').textContent='ยังสุ่มไม่สำเร็จ';$('result-note').textContent=error.message;}
 finally{busy=false;$('draw').disabled=false;$('player').disabled=false;document.querySelectorAll('[name=digits]').forEach(x=>x.disabled=false);$('universe').classList.remove('spinning');document.querySelector('.live-dot').textContent='พร้อมหมุน';}
});
$('copy').addEventListener('click',async()=>{if(!current)return;try{await navigator.clipboard.writeText(current);$('copy').textContent='คัดลอกแล้ว ✓';}catch{$('copy').textContent='คัดลอกไม่ได้ กรุณาเลือกเลขแล้วคัดลอกเอง';}});
$('clear').addEventListener('click',()=>{history=history.filter(x=>x.name!==name());save();renderHistory();});
renderHistory();
