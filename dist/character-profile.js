// Character choices describe an avatar, not a person's gender identity. Stored locally only.
export function readCharacter(storage,id){try{const v=JSON.parse(storage.getItem('lucky-character-'+id)||'null');return v?.version===1&&['masculine','feminine','free'].includes(v.preset)&&typeof v.alias==='string'&&v.alias.trim()?{version:1,preset:v.preset,alias:v.alias.trim().slice(0,16)}:null;}catch{return null;}}
let setup=null;
export function ensureCharacter(user,{edit=false}={}){
 const existing=readCharacter(localStorage,user.id);if(existing&&!edit)return Promise.resolve(existing);if(setup)return setup;
 setup=new Promise(resolve=>{
 const dialog=document.createElement('dialog');dialog.className='character-dialog';dialog.setAttribute('aria-labelledby','character-title');
 const title=document.createElement('h2');title.id='character-title';title.textContent='สร้างตัวละครของคุณ';
 const intro=document.createElement('p');intro.textContent='เลือกต้นแบบที่ชอบ แล้วปรับแต่งให้เป็นคุณได้ทุกแบบ ไม่จำเป็นต้องตรงกับเพศของคุณ';
 const form=document.createElement('form');const label=document.createElement('label');label.htmlFor='character-alias';label.textContent='ชื่อเล่นตัวละคร';const input=document.createElement('input');input.id='character-alias';input.required=true;input.maxLength=16;input.autocomplete='nickname';input.value=existing?.alias||'';
 const field=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent='ต้นแบบตัวละคร';field.append(legend);
 for(const [value,text]of [['masculine','ตัวละครชาย'],['feminine','ตัวละครหญิง'],['free','อิสระ · LGBTQ+']]){const item=document.createElement('label'),radio=document.createElement('input');radio.type='radio';radio.name='preset';radio.value=value;radio.required=true;radio.checked=existing?.preset===value;item.append(radio,document.createTextNode(text));field.append(item);}
 const note=document.createElement('p');note.className='panel-footnote';note.textContent='จำตัวละครในเบราว์เซอร์นี้เท่านั้น ชื่อเล่นจะแสดงต่อคนอื่นเมื่อคุณเลือกเข้าลานร่วม';
 const status=document.createElement('p');status.setAttribute('role','status');const submit=document.createElement('button');submit.type='submit';submit.className='welcome-cta';submit.textContent='ใช้ตัวละครนี้';
 form.append(label,input,field,note,status,submit);dialog.append(title,intro,form);document.body.append(dialog);dialog.addEventListener('cancel',event=>event.preventDefault());dialog.showModal();
 form.addEventListener('submit',event=>{event.preventDefault();const alias=input.value.normalize('NFC').replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g,'').trim().slice(0,16);if(!alias){status.textContent='กรุณาใส่ชื่อเล่นก่อนครับ';return;}const preset=new FormData(form).get('preset');if(!['masculine','feminine','free'].includes(preset))return;const profile={version:1,preset,alias};try{localStorage.setItem('lucky-character-'+user.id,JSON.stringify(profile));localStorage.setItem('lucky-member-player-'+user.id,alias);const key='lucky-sanctuary-look-'+user.id;if(!existing||existing.preset!==preset)localStorage.setItem(key,JSON.stringify({color:preset==='free'?'#76667e':preset==='feminine'?'#704c50':'#4b596a',skin:'#bb8763',hairStyle:preset==='feminine'?'tied':'short'}));}catch{status.textContent='เครื่องนี้จำตัวละครไม่ได้ รอบหน้าจะต้องสร้างใหม่';}dialog.close();dialog.remove();setup=null;resolve(profile);document.dispatchEvent(new CustomEvent('lucky-character-ready',{detail:profile}));});
 });return setup;
}
