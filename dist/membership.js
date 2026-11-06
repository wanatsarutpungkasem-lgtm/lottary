import {initMemberGate} from './member-gate.js';
import {authClient,memberUser} from './auth-client.js';
const links=[...document.querySelectorAll('[data-member-link]')];
const loginPage=location.pathname.endsWith('/login.html');
let refreshSerial=0;
for(const link of links){
 const button=document.createElement('button');button.type='button';button.className='member-link member-logout';button.textContent='ออกจากระบบ';button.hidden=true;button.dataset.memberLogout='';
 const notice=document.createElement('span');notice.className='member-nav-status';notice.setAttribute('role','status');
 link.after(button,notice);
 button.addEventListener('click',async()=>{
  if(button.disabled)return;button.disabled=true;button.textContent='กำลังออก…';notice.textContent='';
  try{const {error}=await authClient().auth.signOut({scope:'local'});if(error)throw error;await refresh();location.assign('login.html');}
  catch{notice.textContent='ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง';}
  finally{button.disabled=false;button.textContent='ออกจากระบบ';}
 });
}
async function refresh(){
 const run=++refreshSerial;let user=null;try{user=await memberUser();}catch{}
 if(run!==refreshSerial)return;
 for(const link of links){
  link.hidden=!user&&(loginPage||!!document.querySelector('[data-member-only]'));
  link.textContent=user?'บัญชีของฉัน':'เข้าสู่ระบบ';link.setAttribute('aria-label',user?'บัญชีสมาชิกของฉัน':'เข้าสู่ระบบสมาชิก');
 }
 for(const button of document.querySelectorAll('[data-member-logout]'))button.hidden=!user;
}
if(links.length){refresh();authClient().auth.onAuthStateChange(()=>{setTimeout(refresh,0);});}
initMemberGate();
