import {fileURLToPath} from 'node:url';
import {buildSync} from 'esbuild';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const write=(path,value)=>writeFileSync(new URL(path,import.meta.url),value);
buildSync({entryPoints:[fileURLToPath(new URL('./src/supabase-entry.js',import.meta.url))],outfile:fileURLToPath(new URL('./dist/vendor/supabase.js',import.meta.url)),bundle:true,format:'esm',platform:'browser',minify:true,target:'es2022',legalComments:'eof'});
for(const [entry,out,globalName] of [['auth-offline-entry','auth-offline',undefined],['member-offline-entry','member-offline','LuckyMembership']])buildSync({entryPoints:[fileURLToPath(new URL('./src/'+entry+'.js',import.meta.url))],outfile:fileURLToPath(new URL('./dist/'+out+'.js',import.meta.url)),bundle:true,format:'iife',globalName,platform:'browser',minify:true,target:'es2022',legalComments:'eof'});
const securityPolicy="default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src https://wabbwmoeuxszibgzolzx.supabase.co; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'; worker-src 'none'; media-src 'none'";
const securityMeta=policy=>'<meta http-equiv="Content-Security-Policy" content="'+policy+'"><meta name="referrer" content="no-referrer">';
const root='https://wanatsarutpungkasem-lgtm.github.io/lottary/';
const pages=[['index','index','app'],['how-it-works','how',null],['zodiac','zodiac',null],['siamsi','siamsi','siamsi'],['lucky-numbers','lucky-numbers','numbers'],['about','about',null],['login','login','auth-page']];
const strip=s=>s.replace(/^import .*;$/gm,'').replaceAll('export function','function').replaceAll('export const','const');
const common=strip(read('./dist/backgrounds.js'))+'\n'+strip(read('./dist/preferences.js'));
const bundles={random:strip(read('./dist/random.js')),discovery:strip(read('./dist/discovery.js')),daily:strip(read('./dist/daily-state.js'))};
const image='data:image/jpeg;base64,'+readFileSync(new URL('./dist/assets/ganesha-background.jpg',import.meta.url)).toString('base64');
let standaloneCSS=read('./dist/style.css').replaceAll('assets/ganesha-background.jpg',image);
for(const file of ['mandala-background.svg','stars-background.svg','lotus-background.svg'])standaloneCSS=standaloneCSS.replaceAll('assets/'+file,'data:image/svg+xml;base64,'+readFileSync(new URL('./dist/assets/'+file,import.meta.url)).toString('base64'));
for(const [page,source,script] of pages){
 let html=read('./'+source+'.template.html').replace(/<script[^>]*>[\s\S]*?<\/script>/g,'');
 if(['index','siamsi','lucky-numbers'].includes(page)){html=html.replace('<main ', '<main hidden inert data-member-only ');html=html.replace(/(<main hidden)/, '<section class="wrap privacy-panel member-required" id="member-required"><h1>พื้นที่สำหรับสมาชิก</h1><p id="member-required-status" role="status">กรุณาเข้าสู่ระบบก่อนหมุนลูกบอล เขย่าเซียมซี หรือเปิดชุดเลข</p><a class="primary" href="login.html">เข้าสู่ระบบ / สมัครสมาชิก</a> <button type="button" class="text-button" id="member-check">ตรวจสอบอีกครั้ง</button><noscript><p>กรุณาเปิด JavaScript เพื่อยืนยันการเข้าสู่ระบบ</p></noscript></section>$1');}
 const title=html.match(/<title>(.*?)<\/title>/)[1];
 const description='Lucky By wanatsarut · ช่วงเวลาแห่งการลุ้นในสไตล์ของโอม ลูกบอลทอง เซียมซีข้อคิด และเลขสุ่มเพื่อความสนุก';
 const canonical=root+(page==='index'?'':page+'.html');
 const meta='<link rel="canonical" href="'+canonical+'"><meta property="og:type" content="website"><meta property="og:locale" content="th_TH"><meta property="og:site_name" content="Lucky By wanatsarut"><meta property="og:title" content="'+title+'"><meta property="og:description" content="'+description+'"><meta property="og:url" content="'+root+(page==='index'?'':page+'.html')+'"><meta property="og:image" content="'+root+'assets/share-card.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Lucky By wanatsarut ลูกบอลทองบนพื้นม่วง"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="'+title+'"><meta name="twitter:description" content="'+description+'"><meta name="twitter:image" content="'+root+'assets/share-card.png"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml">';
 html=html.replace('</head>',meta+'</head>');
 // Place policy before any resource so the browser applies it to the whole document.
 html=html.replace(/(<meta charset="UTF-8">)/i,'$1'+securityMeta(securityPolicy));
 if(!html.includes('name="description"'))html=html.replace('</head>','<meta name="description" content="'+description+'"></head>');
 const scripts='<script type="module" src="membership.js?v=3.9"></script>'+'<script type="module" src="preferences.js"></script>'+(script?'<script type="module" src="'+script+'.js"></script>':'');
 write('./dist/'+page+'.html',html.replace('</body>',scripts+'</body>').replace('href="style.css"','href="style.css?v=3.9"').replace('src="preferences.js"','src="preferences.js?v=3.9"').replace('src="'+script+'.js"','src="'+script+'.js?v=3.9"'));
 let offline=html.replace('<link rel="stylesheet" href="style.css">','<style>'+standaloneCSS+'</style>').replace('<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">','');
 let code=common;
 if(script==='auth-page'){code+='\n'+read('./dist/auth-offline.js');}else if(script){code+='\n'+read('./dist/member-offline.js')+'\nconst {saveMemberDraw,saveMemberKeep,requireMember,initMemberGate}=LuckyMembership;initMemberGate();';const dependencies=script==='app'?bundles.random+'\n'+strip(read('./dist/safe-state.js')):script==='siamsi'?strip(read('./dist/safe-state.js'))+'\n'+bundles.random+'\n'+bundles.discovery+'\n'+strip(read('./dist/siamsi-cards.js'))+'\n'+strip(read('./dist/motion.js')):bundles.random+'\n'+bundles.discovery+'\n'+bundles.daily;code+='\n(function(){'+dependencies+'\n'+strip(read('./dist/'+script+'.js'))+'})();';}
 const hash=createHash('sha256').update(code,'utf8').digest('base64');
 offline=offline.replace(securityMeta(securityPolicy),()=>securityMeta(securityPolicy.replace("script-src 'self'","script-src 'sha256-"+hash+"'")));
 offline=offline.replace('</body>',()=>'<script>'+code+'</script></body>').replaceAll('href="index.html','href="lucky-orbit-fixed.html');
 write('../'+(page==='index'?'lucky-orbit-fixed':page)+'.html',offline);
 if(page==='index')write('../lucky-orbit.html',offline);
}
console.log('Built 7 member-enabled routes and 7 standalone previews.');
