import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const write=(path,value)=>writeFileSync(new URL(path,import.meta.url),value);
const root='https://wanatsarutpungkasem-lgtm.github.io/lottary/';
const pages=[['index','index','app'],['how-it-works','how',null],['zodiac','zodiac',null],['siamsi','siamsi','siamsi'],['lucky-numbers','lucky-numbers','numbers'],['about','about',null]];
const strip=s=>s.replace(/^import .*;$/gm,'').replaceAll('export function','function').replaceAll('export const','const');
const common=strip(read('./dist/backgrounds.js'))+'\n'+strip(read('./dist/preferences.js'));
const bundles={random:strip(read('./dist/random.js')),discovery:strip(read('./dist/discovery.js')),daily:strip(read('./dist/daily-state.js'))};
const image='data:image/jpeg;base64,'+readFileSync(new URL('./dist/assets/ganesha-background.jpg',import.meta.url)).toString('base64');
let standaloneCSS=read('./dist/style.css').replaceAll('assets/ganesha-background.jpg',image);
for(const file of ['mandala-background.svg','stars-background.svg','lotus-background.svg'])standaloneCSS=standaloneCSS.replaceAll('assets/'+file,'data:image/svg+xml;base64,'+readFileSync(new URL('./dist/assets/'+file,import.meta.url)).toString('base64'));
for(const [page,source,script] of pages){
 let html=read('./'+source+'.template.html').replace(/<script[^>]*>[\s\S]*?<\/script>/g,'');
 const title=html.match(/<title>(.*?)<\/title>/)[1];
 const description='Lucky By wanatsarut · ช่วงเวลาแห่งการลุ้นในสไตล์ของโอม ลูกบอลทอง เซียมซีข้อคิด และเลขสุ่มเพื่อความสนุก';
 const meta='<meta property="og:type" content="website"><meta property="og:locale" content="th_TH"><meta property="og:site_name" content="Lucky By wanatsarut"><meta property="og:title" content="'+title+'"><meta property="og:description" content="'+description+'"><meta property="og:url" content="'+root+(page==='index'?'':page+'.html')+'"><meta property="og:image" content="'+root+'assets/share-card.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Lucky By wanatsarut ลูกบอลทองบนพื้นม่วง"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="'+title+'"><meta name="twitter:description" content="'+description+'"><meta name="twitter:image" content="'+root+'assets/share-card.png"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml">';
 html=html.replace('</head>',meta+'</head>');
 if(!html.includes('name="description"'))html=html.replace('</head>','<meta name="description" content="'+description+'"></head>');
 const scripts='<script type="module" src="preferences.js"></script>'+(script?'<script type="module" src="'+script+'.js"></script>':'');
 write('./dist/'+page+'.html',html.replace('</body>',scripts+'</body>').replace('href="style.css"','href="style.css?v=3.4"').replace('src="preferences.js"','src="preferences.js?v=3.4"').replace('src="'+script+'.js"','src="'+script+'.js?v=3.4"'));
 let offline=html.replace('<link rel="stylesheet" href="style.css">','<style>'+standaloneCSS+'</style>').replace('<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">','');
 let code=common;
 if(script){const dependencies=script==='app'?bundles.random:script==='siamsi'?bundles.random+'\n'+bundles.discovery+'\n'+strip(read('./dist/siamsi-cards.js'))+'\n'+strip(read('./dist/motion.js')):bundles.random+'\n'+bundles.discovery+'\n'+bundles.daily;code+='\n(function(){'+dependencies+'\n'+strip(read('./dist/'+script+'.js'))+'})();';}
 offline=offline.replace('</body>',()=>'<script>'+code+'</script></body>').replaceAll('href="index.html','href="lucky-orbit-fixed.html');
 write('../'+(page==='index'?'lucky-orbit-fixed':page)+'.html',offline);
 if(page==='index')write('../lucky-orbit.html',offline);
}
console.log('Built 6 lean GitHub Pages routes and 6 standalone previews.');
