import {providerAvailability,prepareOAuth} from './oauth.js';
import {authClient,memberUser,authReturn} from './auth-client.js';
import {cards} from './siamsi-cards.js';
const $=id=>document.getElementById(id),db=authClient();
let mode='login',busy=false,currentUser=null,recoveryReady=false,viewSerial=0;
const status=(message,bad=false)=>{$('auth-status').textContent=message;$('auth-status').dataset.error=String(bad);};
function friendly(error){const code=error?.code;return ({access_denied:'คุณยกเลิกการเข้าสู่ระบบ ลองเลือกช่องทางอีกครั้งได้ครับ',provider_disabled:'ช่องทางนี้ยังไม่เปิดให้บริการ',identity_provider_error:'ผู้ให้บริการเข้าสู่ระบบตอบกลับไม่สำเร็จ กรุณาลองใหม่',email_address_not_authorized:'ระบบส่งอีเมลยังไม่เปิดให้ผู้ใช้ทั่วไป กรุณารอเจ้าของเว็บตั้งค่า',email_address_invalid:'กรุณาตรวจรูปแบบอีเมลอีกครั้ง',invalid_credentials:'อีเมลหรือรหัสผ่านไม่ถูกต้อง',email_not_confirmed:'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ',over_email_send_rate_limit:'ส่งอีเมลถี่เกินไป กรุณารอสักครู่แล้วลองใหม่',over_request_rate_limit:'ทำรายการถี่เกินไป กรุณารอสักครู่',weak_password:'รหัสผ่านไม่ผ่านข้อกำหนดความปลอดภัย กรุณาเปลี่ยนรหัสผ่าน',signup_disabled:'ขณะนี้ยังไม่เปิดรับสมัครสมาชิก',otp_expired:'ลิงก์หมดอายุแล้ว กรุณาขอลิงก์ใหม่',flow_state_not_found:'เปิดลิงก์ในเบราว์เซอร์ที่ส่งคำขอ หรือขอลิงก์ใหม่',flow_state_expired:'ลิงก์หมดอายุแล้ว กรุณาขอลิงก์ใหม่'})[code]||'ทำรายการไม่สำเร็จ กรุณาตรวจอินเทอร์เน็ตแล้วลองใหม่ หากยังพบปัญหาให้ติดต่อเจ้าของเว็บ';}
function setMode(next){
 if(busy)return;mode=next;status('');$('auth-form').reset();
 for(const tab of document.querySelectorAll('[data-auth-mode]')){const active=tab.dataset.authMode===mode;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;}
 $('auth-name-wrap').hidden=mode!=='signup';$('auth-confirm-wrap').hidden=!['signup','update'].includes(mode);$('auth-password-wrap').hidden=mode==='reset';$('auth-show').closest('label').hidden=mode==='reset';$('auth-email-wrap').hidden=mode==='update';$('auth-tabs').hidden=['reset','update'].includes(mode);$('oauth-panel').hidden=['reset','update'].includes(mode);
 $('auth-email').required=mode!=='update';$('auth-password').required=mode!=='reset';$('auth-password').minLength=mode==='login'?1:12;$('auth-password').autocomplete=mode==='login'?'current-password':'new-password';$('auth-confirm').required=['signup','update'].includes(mode);$('auth-confirm').minLength=12;
 $('auth-submit').textContent=({login:'เข้าสู่ระบบ',signup:'สร้างบัญชีของฉัน',reset:'ส่งลิงก์ตั้งรหัสผ่านใหม่',update:'บันทึกรหัสผ่านใหม่'})[mode];
 $('auth-heading').textContent=({login:'ยินดีต้อนรับกลับมา',signup:'เริ่มช่วงเวลาของคุณ',reset:'ตั้งรหัสผ่านใหม่',update:'เลือกรหัสผ่านใหม่'})[mode];
 $('auth-content').setAttribute('aria-labelledby',mode==='signup'?'tab-signup':mode==='login'?'tab-login':'auth-heading');
 $('auth-back').hidden=!['reset','update'].includes(mode);$('auth-reset').hidden=mode!=='login';$('auth-resend').hidden=mode!=='login';
 $('auth-hint').textContent=mode==='signup'?'ใช้อีเมลที่รับข้อความได้ และรหัสผ่านอย่างน้อย 12 ตัวอักษร':mode==='reset'?'รับลิงก์ทางอีเมล แล้วเปิดในเบราว์เซอร์เดียวกับที่ส่งคำขอ':mode==='update'?'รหัสผ่านใหม่อย่างน้อย 12 ตัวอักษร':'บัญชีของคุณเก็บประวัติเลขและใบที่เลือกไว้ข้ามเครื่อง';
}
for(const tab of document.querySelectorAll('[data-auth-mode]')){tab.addEventListener('click',()=>setMode(tab.dataset.authMode));tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=tab.dataset.authMode==='login'?'signup':'login';setMode(event.key==='Home'?'login':event.key==='End'?'signup':next);document.querySelector('[data-auth-mode="'+mode+'"]').focus();});}
$('auth-reset').addEventListener('click',()=>setMode('reset'));$('auth-back').addEventListener('click',()=>setMode('login'));
$('auth-show').addEventListener('change',()=>{for(const id of ['auth-password','auth-confirm'])$(id).type=$('auth-show').checked?'text':'password';});
function lock(value){busy=value;for(const control of $('auth-form').elements)control.disabled=value;for(const tab of document.querySelectorAll('[data-auth-mode]'))tab.disabled=value;for(const id of ['auth-reset','auth-resend','auth-back'])$(id).disabled=value;updateOAuthButtons();}
$('auth-form').addEventListener('submit',async event=>{
 event.preventDefault();if(busy)return;if(mode==='update'&&!recoveryReady){status('กรุณาขอลิงก์ตั้งรหัสผ่านใหม่ก่อน',true);return;}
 const email=$('auth-email').value.trim(),password=$('auth-password').value,display=$('auth-name').value.trim();
 if(['signup','update'].includes(mode)&&password!==$('auth-confirm').value){status('รหัสผ่านทั้งสองช่องไม่ตรงกัน',true);$('auth-confirm').focus();return;}
 lock(true);status('กำลังตรวจสอบ…');
 try{
  if(mode==='login'){const {error}=await db.auth.signInWithPassword({email,password});if(error)throw error;$('auth-password').value='';await showAccount();}
  else if(mode==='signup'){const {data,error}=await db.auth.signUp({email,password,options:{emailRedirectTo:authReturn(),data:{display_name:display}}});if(error)throw error;$('auth-form').reset();if(data.session)await showAccount();else status('หากอีเมลนี้สมัครได้ ระบบจะส่งลิงก์ยืนยัน กรุณาตรวจกล่องจดหมายและอีเมลขยะ แล้วเปิดในเบราว์เซอร์นี้');}
  else if(mode==='reset'){const {error}=await db.auth.resetPasswordForEmail(email,{redirectTo:authReturn(true)});if(error)throw error;status('หากมีบัญชีที่ใช้อีเมลนี้ ระบบจะส่งลิงก์ตั้งรหัสผ่านใหม่ กรุณาตรวจกล่องจดหมายและอีเมลขยะ');}
  else {const {error}=await db.auth.updateUser({password});if(error)throw error;recoveryReady=false;$('auth-form').reset();await showAccount();$('member-status').textContent='เปลี่ยนรหัสผ่านสำเร็จ';}
 }catch(error){status(friendly(error),true);}finally{lock(false);}
});
$('auth-resend').addEventListener('click',async()=>{if(busy)return;const email=$('auth-email').value.trim();if(!$('auth-email').reportValidity())return;lock(true);try{const {error}=await db.auth.resend({type:'signup',email,options:{emailRedirectTo:authReturn()}});if(error)throw error;status('หากบัญชียังรอยืนยัน ระบบจะส่งลิงก์ให้ กรุณาตรวจอีเมล');}catch(error){status(friendly(error),true);}finally{lock(false);}});
async function showAccount(){
 const serial=++viewSerial,user=await memberUser();if(serial!==viewSerial)return;
 currentUser=user;$('member-panel').hidden=!user;$('auth-panel').hidden=Boolean(user)&&!recoveryReady;
 if(!user){$('member-draws').replaceChildren();$('member-keeps').replaceChildren();return;}
 $('member-email').textContent=user.email||'บัญชีสมาชิก';$('member-status').textContent='กำลังโหลดข้อมูลของคุณ…';
 const [profile,draws,keeps]=await Promise.all([db.from('lucky_member_profiles').select('display_name,zodiac').eq('user_id',user.id).maybeSingle(),db.from('lucky_member_draws').select('id,number,player_name,zodiac,created_at').eq('user_id',user.id).order('created_at',{ascending:false}).limit(50),db.from('lucky_member_keeps').select('leaf_id,created_at').eq('user_id',user.id).order('created_at',{ascending:false}).limit(28)]);
 if(serial!==viewSerial||currentUser?.id!==user.id)return;
 $('member-name').value=profile.data?.display_name||String(user.user_metadata?.display_name||'').slice(0,40);$('member-zodiac').value=profile.data?.zodiac||'none';
 $('member-draws').replaceChildren();for(const row of draws.data||[]){const item=document.createElement('article'),n=document.createElement('strong'),p=document.createElement('p'),button=document.createElement('button');item.className='member-draw';n.textContent=row.number;p.textContent=row.player_name+' · '+new Date(row.created_at).toLocaleString('th-TH');button.type='button';button.textContent='ลบรายการนี้';button.className='text-button';button.addEventListener('click',async()=>{button.disabled=true;const {error}=await db.from('lucky_member_draws').delete().eq('id',row.id).eq('user_id',user.id);if(error){$('member-status').textContent='ลบไม่สำเร็จ กรุณาลองใหม่';button.disabled=false;}else item.remove();});item.append(n,p,button);$('member-draws').append(item);}
 if(!draws.data?.length){const p=document.createElement('p');p.textContent='ยังไม่มีเลขที่บันทึกหลังเข้าสู่ระบบ';$('member-draws').append(p);}
 $('member-keeps').replaceChildren();for(const row of keeps.data||[]){const card=cards[row.leaf_id-1];if(!card)continue;const item=document.createElement('article'),h=document.createElement('h3'),p=document.createElement('p'),remove=document.createElement('button');item.className='saved-leaf';h.textContent='ใบที่ '+card.id+' · '+card.title;p.textContent=card.reading;remove.type='button';remove.className='text-button';remove.textContent='ลบจากบัญชี';remove.addEventListener('click',async()=>{remove.disabled=true;const {error}=await db.from('lucky_member_keeps').delete().eq('user_id',user.id).eq('leaf_id',card.id);if(error){$('member-status').textContent='ลบไม่สำเร็จ';remove.disabled=false;}else item.remove();});item.append(h,p,remove);$('member-keeps').append(item);}
 $('member-status').textContent=[profile,draws,keeps].some(x=>x.error)?'โหลดข้อมูลบางส่วนไม่สำเร็จ กรุณารีเฟรช':'ข้อมูลสมาชิกของคุณ · แสดงเลขล่าสุดสูงสุด 50 รายการ';
}
$('member-profile').addEventListener('submit',async event=>{event.preventDefault();if(!currentUser)return;const button=$('profile-save');button.disabled=true;try{const {error}=await db.from('lucky_member_profiles').upsert({user_id:currentUser.id,display_name:$('member-name').value.trim(),zodiac:$('member-zodiac').value},{onConflict:'user_id'});if(error)throw error;$('member-status').textContent='บันทึกข้อมูลส่วนตัวแล้ว';}catch{$('member-status').textContent='บันทึกไม่สำเร็จ กรุณาลองใหม่';}finally{button.disabled=false;}});
$('member-logout').addEventListener('click',async()=>{const button=$('member-logout');button.disabled=true;const {error}=await db.auth.signOut({scope:'local'});if(error){$('member-status').textContent='ออกจากระบบไม่สำเร็จ กรุณาลองใหม่';button.disabled=false;return;}currentUser=null;++viewSerial;$('member-draws').replaceChildren();$('member-keeps').replaceChildren();$('member-profile').reset();$('auth-panel').hidden=false;$('member-panel').hidden=true;setMode('login');status('ออกจากระบบบนเครื่องนี้แล้ว');button.disabled=false;});
db.auth.onAuthStateChange((event)=>{if(event==='PASSWORD_RECOVERY'){recoveryReady=true;setTimeout(()=>{$('member-panel').hidden=true;$('auth-panel').hidden=false;setMode('update');},0);}else if(['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event)){setTimeout(()=>{if(!recoveryReady)showAccount().catch(()=>status('โหลดข้อมูลไม่สำเร็จ กรุณารีเฟรช',true));},0);}});

let oauthEnabled={google:false,github:false,facebook:false},oauthChecking=false;
function updateOAuthButtons(){for(const button of document.querySelectorAll('[data-oauth]'))button.disabled=busy||oauthChecking||!oauthEnabled[button.dataset.oauth];$('oauth-retry').disabled=busy||oauthChecking;}
async function refreshOAuth(){if(oauthChecking||busy)return;oauthChecking=true;updateOAuthButtons();try{
 oauthEnabled=await providerAvailability();
 for(const [name,enabled] of Object.entries(oauthEnabled))document.querySelector('[data-oauth-status="'+name+'"]').textContent=enabled?'พร้อมเชื่อมต่อ':'ยังไม่เปิดให้บริการ';
 $('oauth-status').textContent=Object.values(oauthEnabled).some(Boolean)?'เลือกบัญชีที่ต้องการ ระบบจะพาไปยืนยันกับผู้ให้บริการ':'ช่องทางบัญชีภายนอกกำลังตั้งค่า กรุณารอเปิดช่องทางเข้าสู่ระบบ';
}catch{for(const text of document.querySelectorAll('[data-oauth-status]'))text.textContent='ตรวจสถานะไม่สำเร็จ';$('oauth-status').textContent='ตรวจการเชื่อมต่อไม่ได้ กรุณาลองใหม่';oauthEnabled={google:false,github:false,facebook:false};}finally{oauthChecking=false;updateOAuthButtons();}}
for(const button of document.querySelectorAll('[data-oauth]'))button.addEventListener('click',async()=>{
 const provider=button.dataset.oauth;if(busy||!oauthEnabled[provider])return;
 if(location.protocol==='file:'){$('oauth-status').textContent='กรุณาเปิดผ่านเว็บจริงหรือพรีวิวในเครื่อง เพื่อเข้าสู่ระบบด้วยบัญชีภายนอก';return;}
 lock(true);$('oauth-status').textContent='กำลังเชื่อมต่อ '+button.querySelector('b').textContent+'…';
 try{const destination=await prepareOAuth(db,provider,authReturn());$('auth-password').value='';$('auth-confirm').value='';location.assign(destination);}catch(error){$('oauth-status').textContent='เชื่อมต่อไม่สำเร็จ กรุณาตรวจสถานะหรือลองใหม่';lock(false);}
});
$('oauth-retry').addEventListener('click',refreshOAuth);
refreshOAuth();

setMode('login');
(async()=>{try{const {error}=await db.auth.getSession();if(error){status(friendly(error),true);return;}if(!recoveryReady)await showAccount();const u=new URL(location.href),fragment=new URLSearchParams(u.hash.slice(1)),code=u.searchParams.get('error_code')||fragment.get('error_code');if(code)status(friendly({code}),true);if(u.searchParams.has('code')||u.hash||code){for(const key of ['code','error','error_code','error_description','access_token','refresh_token'])u.searchParams.delete(key);u.hash='';history.replaceState(null,'',u.pathname+u.search);}}catch{status('เชื่อมต่อระบบสมาชิกไม่ได้ กรุณาตรวจอินเทอร์เน็ตแล้วรีเฟรช',true);}})();
