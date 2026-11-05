import {initMemberGate} from './member-gate.js';
import {authClient,memberUser} from './auth-client.js';
const links=[...document.querySelectorAll('[data-member-link]')];
async function refresh(){try{const user=await memberUser();for(const link of links){link.textContent=user?'บัญชีของฉัน':'เข้าสู่ระบบ';link.setAttribute('aria-label',user?'บัญชีสมาชิกของฉัน':'เข้าสู่ระบบสมาชิก');}}catch{for(const link of links)link.textContent='เข้าสู่ระบบ';}}
if(links.length){refresh();authClient().auth.onAuthStateChange(()=>{setTimeout(refresh,0);});}

initMemberGate();
