import {authClient} from './auth-client.js';
import {verifiedMember} from './member-access.js';
let activeId=null,serial=0;
const protectedPage=()=>document.querySelector('[data-member-only]');
function lock(message='เข้าสู่ระบบก่อนใช้งาน'){
 const main=protectedPage();if(!main)return;
 main.hidden=true;main.inert=true;
 const panel=document.getElementById('member-required');panel.hidden=false;
 document.getElementById('member-required-status').textContent=message;
 document.dispatchEvent(new CustomEvent('lucky-member-locked'));
}
export async function requireMember(){
 const user=await verifiedMember(()=>authClient().auth.getUser());
 if(!user){lock('กรุณาเข้าสู่ระบบก่อนใช้งาน หรือเชื่อมต่ออินเทอร์เน็ตแล้วลองอีกครั้ง');return null;}
 if(activeId&&activeId!==user.id){location.reload();return null;}
 return user;
}
export function initMemberGate(){
 const main=protectedPage();if(!main)return;
 const refresh=async()=>{
  const run=++serial;lock('กำลังตรวจสอบการเข้าสู่ระบบ…');
  const user=await requireMember();if(run!==serial)return;
  if(user){activeId=user.id;main.hidden=false;main.inert=false;document.getElementById('member-required').hidden=true;document.dispatchEvent(new CustomEvent('lucky-member-ready',{detail:{id:user.id}}));}
 };
 document.getElementById('member-check').addEventListener('click',refresh);
 authClient().auth.onAuthStateChange((event)=>{
  if(event==='SIGNED_OUT'){serial++;lock();location.reload();}
  else if(event==='SIGNED_IN'||event==='USER_UPDATED')setTimeout(refresh,0);
 });
 window.addEventListener('pageshow',refresh);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
 refresh();
}
