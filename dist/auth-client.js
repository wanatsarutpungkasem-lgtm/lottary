import {createMemberResolver} from './member-access.js';
import {resolveAuthReturn} from './auth-redirect.js';
import {createClient} from './vendor/supabase.js';
import {authConfig} from './auth-config.js';
let client;
const resolveMember=createMemberResolver(()=>authClient().auth.getUser());
export function authClient(){if(!client){client=createClient(authConfig.url,authConfig.key,{auth:{storageKey:'lucky-member-auth-v1',flowType:'pkce',autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}});client.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT'||event==='USER_UPDATED')resolveMember.invalidate();});}return client;}
export function authReturn(recovery=false){return resolveAuthReturn(globalThis.location?.origin,recovery);}
export function memberUser(){return resolveMember();}
export async function saveMemberDraw(draw){
 const db=authClient(),user=await memberUser();if(!user)throw new Error('กรุณาเข้าสู่ระบบก่อนบันทึก');
 const {error}=await db.from('lucky_member_draws').insert({user_id:user.id,number:draw.number,player_name:draw.name.slice(0,40),zodiac:draw.sign||'none'});if(error)throw error;return true;
}
export async function saveMemberKeep(id){
 const db=authClient(),user=await memberUser();if(!user)throw new Error('กรุณาเข้าสู่ระบบก่อนบันทึก');
 const {error}=await db.from('lucky_member_keeps').upsert({user_id:user.id,leaf_id:id},{onConflict:'user_id,leaf_id',ignoreDuplicates:true});if(error)throw error;return true;
}
