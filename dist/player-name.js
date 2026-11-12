export function normalizePlayerName(value){
 if(typeof value!=='string')return '';
 const name=value.trim().normalize('NFC');
 if(name.length>40||!name.replace(/[\s\u200B-\u200D\u2060\uFEFF]/gu,''))return '';
 return name;
}
export function selectPlayerName(saved,profile){return normalizePlayerName(saved)||normalizePlayerName(profile);}
