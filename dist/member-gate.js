import {ensureCharacter} from './character-profile.js';
import {authClient,memberUser} from './auth-client.js';
let activeId=null,serial=0;
const protectedPage=()=>document.querySelector('[data-member-only]');
function loading(){
 const main=protectedPage();main.hidden=true;main.inert=true;
 document.getElementById('member-required').hidden=true;
 document.getElementById('member-loading').hidden=false;
 document.querySelector('.skip-link')?.setAttribute('href','#member-loading');
}
function lock(message='เข้าสู่ระบบเพื่อเริ่ม และเก็บผลที่ชอบไว้ในบัญชี'){
 const main=protectedPage();if(!main)return;
 main.hidden=true;main.inert=true;
 document.getElementById('member-loading').hidden=true;
 document.querySelector('.skip-link')?.setAttribute('href','#member-required');
 document.getElementById('member-required').hidden=false;
 document.getElementById('member-required-status').textContent=message;
 document.dispatchEvent(new CustomEvent('lucky-member-locked'));
}
export async function requireMember(){
 const user=await memberUser();
 if(!user){lock();return null;}
 if(activeId&&activeId!==user.id){location.reload();return null;}
 await ensureCharacter(user);return user;
}
export function initMemberGate(){
 const main=protectedPage();if(!main)return;
 let checking=null;
 const refresh=()=>{
  if(checking)return checking;
  const run=++serial;if(!activeId)loading();
  checking=(async()=>{
   const user=await memberUser();if(run!==serial)return;
   if(!user){lock();return;}
   if(activeId&&activeId!==user.id){location.reload();return;}
   await ensureCharacter(user);if(run!==serial)return;const first=!activeId;activeId=user.id;
   document.querySelector('.skip-link')?.setAttribute('href','#main-content');
   main.hidden=false;main.inert=false;
   document.getElementById('member-required').hidden=true;
   document.getElementById('member-loading').hidden=true;
   if(first)document.dispatchEvent(new CustomEvent('lucky-member-ready',{detail:{id:user.id}}));
  })().finally(()=>{checking=null;});
  return checking;
 };
 document.getElementById('member-check').addEventListener('click',refresh);
 authClient().auth.onAuthStateChange(event=>{
  if(event==='SIGNED_OUT'){serial++;lock();location.reload();}
  else if(event==='SIGNED_IN'||event==='USER_UPDATED')setTimeout(refresh,0);
 });
 window.addEventListener('pageshow',event=>{if(event.persisted)refresh();});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
 refresh();
}
