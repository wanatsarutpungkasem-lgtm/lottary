import {welcomeHTML} from './src/welcome.js';
import {fileURLToPath} from 'node:url';
import {buildSync} from 'esbuild';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const write=(path,value)=>writeFileSync(new URL(path,import.meta.url),value);
buildSync({entryPoints:[fileURLToPath(new URL('./src/supabase-entry.js',import.meta.url))],outfile:fileURLToPath(new URL('./dist/vendor/supabase.js',import.meta.url)),bundle:true,format:'esm',platform:'browser',minify:true,target:'es2022',legalComments:'eof'});
for(const [entry,out,globalName] of [['auth-offline-entry','auth-offline',undefined],['member-offline-entry','member-offline','LuckyMembership']])buildSync({entryPoints:[fileURLToPath(new URL('./src/'+entry+'.js',import.meta.url))],outfile:fileURLToPath(new URL('./dist/'+out+'.js',import.meta.url)),bundle:true,format:'iife',globalName,platform:'browser',minify:true,target:'es2022',legalComments:'eof'});
buildSync({entryPoints:[fileURLToPath(new URL('./src/garden-scene.js',import.meta.url))],outfile:fileURLToPath(new URL('./dist/vendor/garden3d.js',import.meta.url)),bundle:true,format:'iife',globalName:'LuckyGarden',footer:{js:'globalThis.LuckyGarden=LuckyGarden;'},platform:'browser',minify:true,target:'es2022',legalComments:'eof'});
buildSync({entryPoints:[fileURLToPath(new URL('./src/siamsi-scene.js',import.meta.url))],outfile:fileURLToPath(new URL('./dist/vendor/siamsi3d.js',import.meta.url)),bundle:true,format:'iife',globalName:'LuckyVessel',footer:{js:'globalThis.LuckyVessel=LuckyVessel;'},platform:'browser',minify:true,target:'es2022',legalComments:'eof'});
const securityPolicy="default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src https://wabbwmoeuxszibgzolzx.supabase.co; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'; worker-src 'none'; media-src 'none'";
const securityMeta=policy=>'<meta http-equiv="Content-Security-Policy" content="'+policy+'"><meta name="referrer" content="no-referrer">';
const root='https://wanatsarutpungkasem-lgtm.github.io/lottary/';
const pages=[['index','index','app'],['how-it-works','how',null],['zodiac','zodiac',null],['siamsi','siamsi','siamsi'],['lucky-numbers','lucky-numbers','numbers'],['about','about',null],['login','login','auth-page'],['garden','garden','garden'],['worship','worship','garden']];
const strip=s=>s.replace(/^import .*;$/gm,'').replaceAll('export function','function').replaceAll('export const','const');
const common=strip(read('./dist/backgrounds.js'))+'\n'+strip(read('./dist/preferences.js'));
const bundles={random:strip(read('./dist/random.js')),discovery:strip(read('./dist/discovery.js')),daily:strip(read('./dist/daily-state.js'))};
const image='data:image/jpeg;base64,'+readFileSync(new URL('./dist/assets/ganesha-background.jpg',import.meta.url)).toString('base64');
let standaloneCSS=read('./dist/style.css').replaceAll('assets/ganesha-background.jpg',image);
for(const file of ['mandala-background.svg','stars-background.svg','lotus-background.svg'])standaloneCSS=standaloneCSS.replaceAll('assets/'+file,'data:image/svg+xml;base64,'+readFileSync(new URL('./dist/assets/'+file,import.meta.url)).toString('base64'));
for(const [page,source,script] of pages){
 const pagePolicy=['garden','worship'].includes(page)?securityPolicy.replace('connect-src https://wabbwmoeuxszibgzolzx.supabase.co;', 'connect-src https://wabbwmoeuxszibgzolzx.supabase.co wss://wabbwmoeuxszibgzolzx.supabase.co;'):securityPolicy;
 let html=read('./'+source+'.template.html').replace(/<script[^>]*>[\s\S]*?<\/script>/g,'');
 if(['index','siamsi','lucky-numbers','garden','worship'].includes(page)){html=html.replace('href="#main-content"','href="#member-loading"');html=html.replace('<main ', '<main hidden inert data-member-only ');html=html.replace(/(<main hidden)/,'<section class="wrap member-loading" id="member-loading" role="status" tabindex="-1"><span class="loading-emblem" aria-hidden="true">✧</span><p>กำลังเตรียมพื้นที่ของคุณ…</p><div class="loading-lines" aria-hidden="true"><i></i><i></i><i></i></div><noscript><p>กรุณาเปิด JavaScript เพื่อเข้าสู่ระบบและใช้งาน</p></noscript></section>'+welcomeHTML(['garden','worship'].includes(page)?'index':page).replace('id="member-required"','id="member-required" hidden')+'$1');}
 html=html.replace('data-member-link href=', 'data-member-link hidden href=');
 const title=html.match(/<title>(.*?)<\/title>/)[1];
 const description='Lucky By wanatsarut · ช่วงเวลาแห่งการลุ้นในสไตล์ของโอม ลูกบอลทอง เซียมซีข้อคิด และเลขสุ่มเพื่อความสนุก';
 const canonical=root+(page==='index'?'':page+'.html');
 const meta='<link rel="canonical" href="'+canonical+'"><meta property="og:type" content="website"><meta property="og:locale" content="th_TH"><meta property="og:site_name" content="Lucky By wanatsarut"><meta property="og:title" content="'+title+'"><meta property="og:description" content="'+description+'"><meta property="og:url" content="'+root+(page==='index'?'':page+'.html')+'"><meta property="og:image" content="'+root+'assets/share-card.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Lucky By wanatsarut ลูกบอลทองบนพื้นม่วง"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="'+title+'"><meta name="twitter:description" content="'+description+'"><meta name="twitter:image" content="'+root+'assets/share-card.png"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml">';
 html=html.replace('</head>',meta+'<link rel="modulepreload" href="vendor/supabase.js"><link rel="modulepreload" href="auth-client.js"><link rel="modulepreload" href="member-access.js"></head>');
 // Place policy before any resource so the browser applies it to the whole document.
 html=html.replace(/(<meta charset="UTF-8">)/i,'$1'+securityMeta(pagePolicy));
 if(!html.includes('name="description"'))html=html.replace('</head>','<meta name="description" content="'+description+'"></head>');
 const scripts='<script type="module" src="membership.js?v=3.21"></script>'+'<script type="module" src="preferences.js"></script>'+(script?'<script type="module" src="'+script+'.js"></script>':'');
 write('./dist/'+page+'.html',html.replace('</body>',scripts+'</body>').replace('href="style.css"','href="style.css?v=3.21"').replace('src="preferences.js"','src="preferences.js?v=3.21"').replace('src="'+script+'.js"','src="'+script+'.js?v=3.21"'));
 let offline=html.replaceAll('src="assets/ganesha-background.jpg"','src="'+image+'"').replace(/<link rel="modulepreload"[^>]*>/g,'').replace('<link rel="stylesheet" href="style.css">','<style>'+standaloneCSS+'</style>').replace('<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">','');
 let code=common;
 if(script==='auth-page'){code+='\n'+read('./dist/auth-offline.js');}else if(script){code+='\n'+read('./dist/member-offline.js')+'\nconst {authClient,saveMemberDraw,saveMemberKeep,requireMember,initMemberGate,ensureCharacter}=LuckyMembership;';const dependencies=script==='garden'?read('./dist/vendor/garden3d.js')+'\n'+strip(read('./dist/garden-state.js'))+'\n'+strip(read('./dist/temple-journey.js'))+'\n'+strip(read('./dist/garden-presence.js')):script==='app'?bundles.random+'\n'+strip(read('./dist/player-name.js'))+'\n'+strip(read('./dist/safe-state.js')):script==='siamsi'?read('./dist/vendor/siamsi3d.js')+'\n'+strip(read('./dist/temple-journey.js'))+'\n'+strip(read('./dist/safe-state.js'))+'\n'+bundles.random+'\n'+bundles.discovery+'\n'+strip(read('./dist/siamsi-cards.js'))+'\n'+strip(read('./dist/motion.js')):bundles.random+'\n'+bundles.discovery+'\n'+bundles.daily;code+='\n(function(){'+dependencies+'\n'+strip(read('./dist/'+script+'.js')).replace("import('./vendor/garden3d.js?v=3.21')",'Promise.resolve()').replace("import('./vendor/siamsi3d.js?v=3.21')",'Promise.resolve()')+'})();';}
 const hash=createHash('sha256').update(code,'utf8').digest('base64');
 offline=offline.replace(securityMeta(pagePolicy),()=>securityMeta(pagePolicy.replace("script-src 'self'","script-src 'sha256-"+hash+"'")));
 offline=offline.replace('</body>',()=>'<script>'+code+'</script></body>').replaceAll('href="index.html','href="lucky-orbit-fixed.html');
 write('../'+(page==='index'?'lucky-orbit-fixed':page)+'.html',offline);
 if(page==='index')write('../lucky-orbit.html',offline);
}
console.log('Built 9 routes and 9 standalone previews.');
