import * as T from 'three';

// Original physical installations. Reference photographs inform proportions only;
// no photograph, merchant branding, payment instruction or third-party text is used.
export function createTempleInstallations(){
 const material=(color,metalness=0,roughness=.7)=>new T.MeshStandardMaterial({color,metalness,roughness});
 const gold=material('#bd9646',.7,.34),edge=material('#d8bc75',.65,.33),steel=material('#9b9e97',.8,.3),dark=material('#222724',.35,.6),cream=material('#eadcb5',.15,.3),paper=material('#e9e1cc',0,.94),red=material('#672c28',.05,.76);
 const geo={};
 const geometry=(key,make)=>geo[key]||(geo[key]=make());
 function add(g,m,parent,x=0,y=0,z=0){const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 const box=(w,h,d,m,p,x=0,y=0,z=0)=>add(geometry(`b:${w}:${h}:${d}`,()=>new T.BoxGeometry(w,h,d)),m,p,x,y,z);
 const sphere=(r,m,p,x,y,z)=>add(geometry('s:'+r,()=>new T.SphereGeometry(r,18,12)),m,p,x,y,z);
 const cylinder=(a,b,h,m,p,x,y,z)=>add(geometry(`c:${a}:${b}:${h}`,()=>new T.CylinderGeometry(a,b,h,24)),m,p,x,y,z);
 function label(text,w,h,parent,x,y,z,{bg='#262823',fg='#e9d6a1',size=42}={}){
  const c=document.createElement('canvas');c.width=512;c.height=Math.max(96,Math.round(512*h/w));const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle='#ad8c4d';ctx.lineWidth=5;ctx.strokeRect(9,9,c.width-18,c.height-18);ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`600 ${size}px Tahoma, Thonburi, sans-serif`;ctx.fillText(text,c.width/2,c.height/2,c.width-38);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const plane=add(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:texture}),parent,x,y,z);plane.castShadow=false;return plane;
 }
 const grain=document.createElement('canvas');grain.width=256;grain.height=512;const ctx=grain.getContext('2d');ctx.fillStyle='#6d432a';ctx.fillRect(0,0,256,512);for(let i=0;i<95;i++){const x=(i*43.71)%256;ctx.strokeStyle=i%2?'rgba(224,159,88,.10)':'rgba(33,19,12,.14)';ctx.lineWidth=1+(i%3)*.7;ctx.beginPath();ctx.moveTo(x,0);ctx.bezierCurveTo(x+Math.sin(i)*8,170,x-Math.cos(i)*7,350,x,512);ctx.stroke();}const woodMap=new T.CanvasTexture(grain);woodMap.colorSpace=T.SRGBColorSpace;const wood=new T.MeshStandardMaterial({color:'#bb966f',map:woodMap,roughness:.73});

 // Rectangular glass tank with structural rails, mechanical crank and retrieval tray.
 const ball=new T.Group();ball.name='gold-ball-cabinet';
 box(1.65,.13,1.15,dark,ball,0,.075,0);box(1.5,.96,1.02,gold,ball,0,.61,0);box(1.56,.09,1.08,steel,ball,0,1.12,0);
 box(1.58,.16,1.09,edge,ball,0,3.06,0);box(1.46,.07,.98,gold,ball,0,3.17,0);
 const glass=new T.MeshPhysicalMaterial({color:'#e0ece4',transparent:true,opacity:.13,roughness:.12,metalness:0,depthWrite:false,side:T.DoubleSide});
 for(const x of [-.72,.72])for(const z of [-.48,.48])box(.065,1.84,.065,steel,ball,x,2.08,z);
 box(1.43,1.82,.018,glass,ball,0,2.08,.49);box(1.43,1.82,.018,glass,ball,0,2.08,-.49);for(const x of [-.735,.735])box(.018,1.82,.96,glass,ball,x,2.08,0);
 box(1.37,.06,.92,dark,ball,0,1.19,0);
 for(let layer=0;layer<4;layer++)for(let i=0;i<6;i++){const col=i%3,row=Math.floor(i/3);const x=(col-1)*.43+(layer%2?.04:-.03),z=(row-.5)*.43+Math.sin(i*2.7+layer)*.035,y=1.42+layer*.34+Math.sin(i+layer)*.025;sphere(.225,(i+layer)%3?gold:cream,ball,x,y,z);}
 box(.65,.65,.06,steel,ball,0,.72,.54);const crank=cylinder(.23,.23,.06,dark,ball,0,.76,.59);crank.rotation.x=Math.PI/2;box(.33,.065,.11,steel,ball,0,.76,.66);sphere(.062,dark,ball,.16,.76,.69);box(.33,.035,.035,dark,ball,0,.98,.59);
 box(.64,.28,.035,dark,ball,0,.25,.536);box(.68,.045,.24,steel,ball,0,.115,.63);box(.65,.045,.055,steel,ball,0,.29,.58);label('ลูกบอลทอง',1.12,.24,ball,0,2.88,.513,{size:70});
 // Subtle front lock adds physical detail without advertising payment.
 const lock=cylinder(.055,.055,.025,steel,ball,-.54,.7,.53);lock.rotation.x=Math.PI/2;box(.018,.055,.02,dark,ball,-.54,.7,.55);

 // A 4 × 7 numbered cabinet. Each slot contains a visible stack of paper leaves.
 const cabinet=new T.Group();cabinet.name='fortune-leaf-cabinet';
 box(2.64,.16,.94,wood,cabinet,0,.1,0);box(2.5,2.62,.12,wood,cabinet,0,1.48,-.38);
 for(const x of [-1.22,1.22])box(.13,2.64,.84,wood,cabinet,x,1.49,0);
 box(2.68,.14,.98,wood,cabinet,0,2.88,0);box(2.48,.33,.86,wood,cabinet,0,2.64,0);label('รับใบเซียมซี',2.23,.28,cabinet,0,2.65,.441,{bg:'#672c28',fg:'#f1dbac',size:56});
 const firstY=.44,stepY=.287,stepX=.58,slots=[];
 for(let row=0;row<7;row++){
  const y=firstY+(6-row)*stepY;box(2.34,.045,.76,wood,cabinet,0,y-.1,.035);
  for(let col=0;col<4;col++){
   const x=(col-1.5)*stepX,n=col*7+row+1;slots[n]={x,y};
   box(.48,.075,.51,paper,cabinet,x,y-.04,.07);box(.46,.018,.48,paper,cabinet,x+.007,y+.011,.085);
   // Stacked sheets have a few restrained edge lines rather than text copied from a temple.
   for(let j=0;j<2;j++)box(.46,.004,.012,cream,cabinet,x,y-.063+j*.025,.33);
   label(String(n),.27,.10,cabinet,x,y-.12,.443,{bg:'#795134',fg:'#f7e7b9',size:80});
  }
 }
 for(const x of [-.58,0,.58])box(.035,2.05,.76,wood,cabinet,x,1.37,.035);
 box(2.35,.27,.77,wood,cabinet,0,.255,.035);
 const highlight=new T.Group();highlight.visible=false;cabinet.add(highlight);const glow=new T.MeshStandardMaterial({color:'#ffdd7c',emissive:'#dfa92d',emissiveIntensity:1.1,roughness:.4});for(const x of [-.26,.26])box(.024,.21,.025,glow,highlight,x,0,.465);for(const y of [-.105,.105])box(.54,.024,.025,glow,highlight,0,y,.465);

 const donation=new T.Group();donation.name='symbolic-donation-box';box(1.3,.13,1.02,dark,donation,0,.075,0);box(1.13,1.3,.87,wood,donation,0,.79,0);box(1.25,.1,.98,edge,donation,0,1.49,0);box(.42,.018,.07,dark,donation,0,1.549,0);label('ตู้บริจาคจำลอง',.99,.32,donation,0,1.04,.445,{size:51});label('ไม่มีการรับเงินจริง',.99,.25,donation,0,.69,.445,{bg:'#473c2d',size:45});box(.59,.13,.025,gold,donation,0,.32,.45);
 const info=new T.Group();info.name='temple-info-stand';cylinder(.43,.52,.1,dark,info,0,.05,0);box(.09,.95,.09,gold,info,0,.55,0);box(1.15,.8,.12,wood,info,0,1.36,0);label('ข้อปฏิบัติในลาน',1.03,.27,info,0,1.57,.067,{size:53});label('สงบใจ • เคารพกัน',1.03,.28,info,0,1.22,.067,{bg:'#473c2d',size:49});
 return {ball,cabinet,donation,info,highlightLeaf(number){const n=Number(number),slot=Number.isInteger(n)?slots[n]:null;highlight.visible=!!slot;if(slot)highlight.position.set(slot.x,slot.y,0);}};
}
