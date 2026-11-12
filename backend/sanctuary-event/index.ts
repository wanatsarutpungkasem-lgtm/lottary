import {normalizeVisitorEvent} from './protocol.js';
const origins=new Set(['https://wanatsarutpungkasem-lgtm.github.io','http://127.0.0.1:4187','http://localhost:4187']);
const rate=new Map<string,{start:number,count:number}>();
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get('Origin')||'';
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','Access-Control-Allow-Origin':origins.has(origin)?origin:'https://wanatsarutpungkasem-lgtm.github.io','Access-Control-Allow-Headers':'authorization, apikey, x-client-info, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
 const response=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers});
 if(origin&&!origins.has(origin))return response(403,{error:'Origin not allowed'});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return response(405,{error:'POST required'});
 const authorization=req.headers.get('Authorization')||'';if(!authorization.startsWith('Bearer '))return response(401,{error:'Sign in required'});
 const url=Deno.env.get('SUPABASE_URL')||'',key=Deno.env.get('SUPABASE_ANON_KEY')||'',secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';
 if(!url||!key||!secret)return response(503,{error:'Sanctuary unavailable'});
 try{
  const auth=await fetch(url+'/auth/v1/user',{headers:{apikey:key,Authorization:authorization},signal:AbortSignal.timeout(8000)});
  if(!auth.ok)return response(401,{error:'Sign in required'});const user=await auth.json();if(!user.id||user.is_anonymous===true)return response(403,{error:'Members only'});
  const now=Date.now(),previous=rate.get(user.id),bucket=previous&&now-previous.start<10000?previous:{start:now,count:0};bucket.count++;rate.set(user.id,bucket);if(bucket.count>25)return response(429,{error:'Please wait before updating'});
  if(rate.size>1000)for(const [id,b]of rate)if(now-b.start>30000)rate.delete(id);
  const reader=req.body?.getReader();if(!reader)return response(400,{error:'Body required'});let length=0;const chunks:Uint8Array[]=[];while(true){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>4096){await reader.cancel();return response(413,{error:'Payload too large'});}chunks.push(value);}
  const all=new Uint8Array(length);let offset=0;for(const chunk of chunks){all.set(chunk,offset);offset+=chunk.length;}
  let event;try{event=await normalizeVisitorEvent(JSON.parse(new TextDecoder().decode(all)),user.id);}catch{return response(400,{error:'Invalid visitor state'});}
  // Only this authenticated broker can publish. Browser clients have read permission only.
  const published=await fetch(url+'/realtime/v1/api/broadcast',{method:'POST',headers:{apikey:secret,Authorization:'Bearer '+secret,'Content-Type':'application/json'},body:JSON.stringify({messages:[{topic:'lucky-sanctuary-v320',event:'visitor',payload:event,private:true}]}),signal:AbortSignal.timeout(8000)});
  if(!published.ok)return response(502,{error:'Could not update sanctuary'});
  return response(200,event);
 }catch{return response(503,{error:'Sanctuary connection unavailable'});}
});
