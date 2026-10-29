// Motion is an input gesture only; result selection still uses Web Crypto.
export function createShakeDetector({threshold=7,releaseThreshold=3,minGap=260}={}){
 let gravity=null,latched=false,lastBeat=-Infinity,lastTime=null,source='';
 const vector=value=>value&&['x','y','z'].every(axis=>Number.isFinite(value[axis]))?[value.x,value.y,value.z]:null;
 return {feed(event,time){
  if(!Number.isFinite(time)||(lastTime!==null&&time<=lastTime))return {valid:false,beat:false,impulse:0};
  let values=vector(event?.acceleration),kind='linear';
  if(!values){values=vector(event?.accelerationIncludingGravity);kind='gravity';}
  if(!values)return {valid:false,beat:false,impulse:0};
  const dt=lastTime===null?16:Math.min(200,time-lastTime);lastTime=time;
  if(kind!==source){gravity=null;latched=false;source=kind;}
  if(kind==='gravity'){
   if(!gravity){gravity=[...values];return {valid:true,beat:false,impulse:0};}
   const residual=values.map((value,i)=>value-gravity[i]);const alpha=1-Math.exp(-dt/250);gravity=gravity.map((g,i)=>g+alpha*(values[i]-g));values=residual;
  }
  const magnitude=Math.hypot(...values),impulse=values.reduce((a,b)=>Math.abs(b)>Math.abs(a)?b:a,0);
  if(magnitude<=releaseThreshold)latched=false;
  const beat=!latched&&magnitude>=threshold&&time-lastBeat>=minGap;
  if(beat){latched=true;lastBeat=time;}
  return {valid:true,beat,impulse};
 }};
}
export function createMotionSession({target,MotionEvent,secureContext=true,onBeat=()=>{},onReady=()=>{},onState=()=>{},now=()=>performance.now(),setTimer=setTimeout,clearTimer=clearTimeout}){
 let serial=0,active=false,pending=false,handler=null,timer=null;
 function stop(state='stopped'){
  serial++;active=false;pending=false;if(handler)target.removeEventListener('devicemotion',handler);handler=null;
  if(timer!==null)clearTimer(timer);timer=null;onState(state);
 }
 async function start(){
  stop('idle');const request=++serial;pending=true;onState('requesting');
  if(!secureContext){stop('insecure');return false;}
  if(!MotionEvent){stop('unsupported');return false;}
  try{
   // Called directly within the click handler; no permission request on page load.
   const decision=typeof MotionEvent.requestPermission==='function'?await MotionEvent.requestPermission():'granted';
   if(request!==serial)return false;
   if(decision!=='granted'){stop('denied');return false;}
   pending=false;active=true;const detector=createShakeDetector();let ready=false,count=0;
   handler=event=>{
    if(!active)return;const sample=detector.feed(event,now());if(!sample.valid)return;
    if(!ready){ready=true;if(timer!==null)clearTimer(timer);timer=null;onReady();}
    if(sample.beat){count++;if(count>=6)stop('complete');onBeat(count,sample.impulse);}
   };
   target.addEventListener('devicemotion',handler,{passive:true});onState('listening');
   timer=setTimer(()=>{if(!ready&&active)stop('unavailable');},6000);
   return true;
  }catch{if(request===serial)stop('error');return false;}
 }
 return {start,stop,get running(){return active||pending;},get active(){return active;}};
}
