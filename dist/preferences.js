import {resolveBackground,backgroundLabels} from './backgrounds.js';
(()=>{
 const root=document.documentElement,key='lucky-preferences-v1';
 let prefs={sound:false,soft:false,large:false,background:"daily"};try{const saved=JSON.parse(localStorage.getItem(key));if(saved)prefs={sound:saved.sound===true,soft:saved.soft===true,large:saved.large===true,background:["daily","ganesha","mandala","stars","lotus"].includes(saved.background)?saved.background:"daily"};}catch{}
 const scene=document.getElementById('setting-background');const sessionScene=resolveBackground('daily');
 const sound=document.getElementById('setting-sound'),soft=document.getElementById('setting-soft'),large=document.getElementById('setting-large');
 function apply(){scene.value=prefs.background;const selected=prefs.background==='daily'?sessionScene:resolveBackground(prefs.background);root.dataset.scene=selected;document.getElementById('background-status').textContent=(prefs.background==='daily'?'วันนี้: ':'เลือกไว้: ')+backgroundLabels[selected];root.dataset.effects=prefs.soft?'soft':'full';sound.checked=prefs.sound;soft.checked=prefs.soft;large.checked=prefs.large;root.dataset.type=prefs.large?'large':'normal';}
 function save(){try{localStorage.setItem(key,JSON.stringify(prefs));}catch{}apply();}
 large.addEventListener('change',()=>{prefs.large=large.checked;save();});
 scene.addEventListener('change',()=>{prefs.background=scene.value;save();});
 let audio;
 function unlock(){try{const Audio=window.AudioContext||window.webkitAudioContext;if(Audio){audio||=new Audio();if(audio.state==='suspended')audio.resume().catch(()=>{});}}catch{}}
 sound.addEventListener('change',()=>{prefs.sound=sound.checked;if(prefs.sound)unlock();save();if(prefs.sound)play('wood');});soft.addEventListener('change',()=>{prefs.soft=soft.checked;save();});
 document.addEventListener('pointerdown',()=>{if(prefs.sound)unlock();},{passive:true});document.addEventListener('keydown',()=>{if(prefs.sound)unlock();});
 function tone(freq,start,duration,type='sine',volume=.035){if(!audio||audio.state!=='running')return;const osc=audio.createOscillator(),gain=audio.createGain();osc.type=type;osc.frequency.setValueAtTime(freq,start);gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(volume,start+.008);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);osc.connect(gain);gain.connect(audio.destination);osc.start(start);osc.stop(start+duration+.01);}
 function play(kind){if(!prefs.sound||!audio)return;const t=audio.currentTime;if(kind==='wood'){tone(520,t,.065,'triangle',.025);tone(780,t+.025,.045,'triangle',.012);}else [523.25,659.25,783.99].forEach((freq,i)=>tone(freq,t+i*.09,.65));}
 document.addEventListener('lucky-sound',event=>play(event.detail));apply();
 const share=document.getElementById('share-site');share?.addEventListener('click',async()=>{const url='https://wanatsarutpungkasem-lgtm.github.io/lottary/';try{if(navigator.share)await navigator.share({title:'Lucky By wanatsarut',text:'ช่วงเวลาแห่งการลุ้น ในสไตล์ของโอม',url});else{await navigator.clipboard.writeText(url);share.textContent='คัดลอกลิงก์แล้ว ✓';}}catch(error){if(error.name!=='AbortError')share.textContent='คัดลอกลิงก์จากแถบที่อยู่ได้เลย';}});
})();
(()=>{const menus=[...document.querySelectorAll('.nav-menu,.ambience-menu')];for(const menu of menus)menu.addEventListener('toggle',()=>{if(menu.open)for(const other of menus)if(other!==menu)other.open=false;});document.addEventListener('click',event=>{for(const menu of menus)if(!menu.contains(event.target))menu.open=false;});document.addEventListener('keydown',event=>{if(event.key==='Escape')for(const menu of menus)if(menu.open){menu.open=false;menu.querySelector('summary').focus();}});})();

// Small, self-hosted accents. Never affect the random result or page controls.
(()=>{
 const calm=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.effects==='soft';
 for(const stage of document.querySelectorAll('.universe,.ritual-halo')){
  const aura=document.createElement('div');aura.className='orbit-atmosphere';aura.setAttribute('aria-hidden','true');
  for(let i=0;i<12;i++){const star=document.createElement('i');star.style.cssText=`--i:${i};--x:${8+(i*29)%84}%;--y:${6+(i*37)%88}%;--delay:${-(i*.73)}s`;aura.append(star);}stage.prepend(aura);
 }
 // Content stays in place: no scroll-entry observer or whole-panel translations.

})();

// Pause decorative loops in background tabs without affecting random outcomes.
(()=>{const update=()=>{document.documentElement.dataset.motionPaused=String(document.hidden);};document.addEventListener('visibilitychange',update);update();})();

// Acknowledge route clicks immediately while the browser loads and verifies auth.
(()=>{
 const status=document.createElement('div');status.className='route-status';status.hidden=true;status.setAttribute('role','status');status.textContent='กำลังเปิดหน้า…';document.body.append(status);
 document.addEventListener('click',event=>{
  const link=event.target.closest?.('a[href]');if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target||link.hasAttribute('download'))return;
  const next=new URL(link.href,location.href);
  if(next.origin!==location.origin||next.pathname===location.pathname||!next.pathname.endsWith('.html'))return;
  status.hidden=false;
 });
 window.addEventListener('pageshow',()=>{status.hidden=true;});
})();
