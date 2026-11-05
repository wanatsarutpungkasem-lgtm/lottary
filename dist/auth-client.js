import {resolveAuthReturn} from './auth-redirect.js';
import {createClient} from './vendor/supabase.js';
import {authConfig} from './auth-config.js';
let client;
export function authClient(){return client??=createClient(authConfig.url,authConfig.key,{auth:{storageKey:'lucky-member-auth-v1',flowType:'pkce',autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}});}
export function authReturn(recovery=false){return resolveAuthReturn(globalThis.location?.origin,recovery);}
export async function memberUser(){const {data,error}=await authClient().auth.getUser();if(error||!data.user||data.user.is_anonymous)return null;return data.user;}
export async function saveMemberDraw(draw){
 const db=authClient(),user=await memberUser();if(!user)throw new Error('กรุณาเข้าสู่ระบบก่อนบันทึก');
 const {error}=await db.from('lucky_member_draws').insert({user_id:user.id,number:draw.number,player_name:draw.name.slice(0,40),zodiac:draw.sign||'none'});if(error)throw error;return true;
}
export async function saveMemberKeep(id){
 const db=authClient(),user=await memberUser();if(!user)throw new Error('กรุณาเข้าสู่ระบบก่อนบันทึก');
 const {error}=await db.from('lucky_member_keeps').upsert({user_id:user.id,leaf_id:id},{onConflict:'user_id,leaf_id',ignoreDuplicates:true});if(error)throw error;return true;
}
