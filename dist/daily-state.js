export function bangkokDay(now=new Date()){
 return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}
export function normalizeDaily(value,day=bangkokDay()){
 const used=value?.date===day&&Number.isInteger(value.used)?Math.min(3,Math.max(0,value.used)):0;
 const last=value?.last;
 const valid=last&&[2,3,6].includes(last.digits)&&Array.isArray(last.batch)&&[1,3,5].includes(last.batch.length)&&last.batch.every(n=>typeof n==='string'&&new RegExp('^\\d{'+last.digits+'}$').test(n))&&new Set(last.batch).size===last.batch.length&&Number.isFinite(last.time);
 return {date:day,used,last:valid?{digits:last.digits,batch:[...last.batch],time:last.time}:null};
}
export function recordDaily(value,last,day=bangkokDay()){
 const state=normalizeDaily(value,day);
 if(state.used>=3)throw new Error('ครบ 3 ครั้งของวันนี้แล้ว กลับมาใหม่วันพรุ่งนี้ได้ครับ');
 const checked=normalizeDaily({last},day).last;
 if(!checked)throw new Error('ไม่สามารถบันทึกชุดเลขนี้ได้');
 return {date:day,used:state.used+1,last:checked};
}
