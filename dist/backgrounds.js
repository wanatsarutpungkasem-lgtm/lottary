export const backgroundLabels={ganesha:'พระพิฆเนศ · ม่วงทอง',mandala:'มณฑลแสงทอง',stars:'วงโคจรดวงดาว',lotus:'บัวแสงมงคล'};
export function resolveBackground(mode='daily',now=new Date()){
 const themes=Object.keys(backgroundLabels);
 if(themes.includes(mode))return mode;
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const value=type=>Number(parts.find(part=>part.type===type).value);
 const day=Math.floor(Date.UTC(value('year'),value('month')-1,value('day'))/86400000);
 return themes[((day%themes.length)+themes.length)%themes.length];
}
