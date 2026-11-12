const coats=['#76667e','#6a7665','#c5baa3','#4b596a','#704c50'],skins=['#e3b995','#bb8763','#85583f'];
export async function normalizeVisitorEvent(input,userId){
 if(!input||typeof input!=='object'||!['join','update','leave'].includes(input.kind))throw new Error('invalid event');
 if(typeof input.client_id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.client_id))throw new Error('invalid client');
 if(typeof userId!=='string'||!userId||!Number.isSafeInteger(input.seq)||input.seq<0||input.seq>1000000000)throw new Error('invalid sender');
 // The verified Auth user, not a client-supplied sender field, determines this opaque ID.
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(userId+':'+input.client_id));
 const sid=[...new Uint8Array(digest)].map(n=>n.toString(16).padStart(2,'0')).join('');
 if(input.kind==='leave')return {kind:'leave',sid,seq:input.seq};
 const alias=typeof input.alias==='string'?input.alias.normalize('NFC').replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g,'').trim().slice(0,16):'';
 if(!alias||typeof input.x!=='number'||typeof input.y!=='number'||!Number.isFinite(input.x)||!Number.isFinite(input.y))throw new Error('invalid visitor');
 return {kind:input.kind,seq:input.seq,peer:{sid,alias,x:Math.max(10,Math.min(90,input.x)),y:Math.max(53,Math.min(89,input.y)),color:coats.includes(input.color)?input.color:coats[0],skin:skins.includes(input.skin)?input.skin:skins[1],hairStyle:input.hairStyle==='tied'?'tied':'short',pose:input.pose==='wai'?'wai':'idle'}};
}
