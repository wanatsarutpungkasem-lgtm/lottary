// Stored browser data is untrusted. Keep only expected primitive fields.
export function readHistory(raw){
 if(typeof raw!=='string'||raw.length>1000000)return [];
 let value;try{value=JSON.parse(raw);}catch{return [];}
 if(!Array.isArray(value))return [];
 const signs=new Set(['none','aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces']);
 return value.slice(0,200).filter(v=>v&&typeof v==='object'&&typeof v.name==='string'&&v.name.length<=120&&typeof v.number==='string'&&/^(?:\d{2}|\d{3}|\d{6})$/.test(v.number)&&Number.isFinite(v.time)&&v.time>=0&&v.time<=8640000000000000).map(v=>({name:v.name,number:v.number,time:v.time,sign:signs.has(v.sign)?v.sign:'none'}));
}
export function readKeeps(raw){
 if(typeof raw!=='string'||raw.length>100000)return [];
 let value;try{value=JSON.parse(raw);}catch{return [];}
 if(!Array.isArray(value))return [];
 const seen=new Set();
 return value.slice(0,200).filter(v=>{if(!v||typeof v!=='object'||!Number.isInteger(v.id)||v.id<1||v.id>28||!Number.isFinite(v.time)||v.time<0||seen.has(v.id))return false;seen.add(v.id);return true;}).slice(0,28).map(v=>({id:v.id,time:v.time}));
}
