import test from 'node:test';
import assert from 'node:assert/strict';
import {memberAction,verifiedMember} from './dist/member-access.js';
import {readFileSync} from 'node:fs';
test('guest, anonymous, rejected and unreachable auth never run an action',async()=>{
 for(const getUser of [async()=>({data:{user:null}}),async()=>({data:{user:{id:'anon',is_anonymous:true}}}),async()=>({data:{user:{id:'forged'}},error:new Error('expired')}),async()=>{throw Error('offline');}]){
  let runs=0,denied=0;await memberAction(getUser,()=>runs++,()=>denied++);assert.equal(runs,0);assert.equal(denied,1);
 }
});
test('a verified member can perform the action with the verified identity',async()=>{
 const user={id:'verified-member',is_anonymous:false};let actual;
 await memberAction(async()=>({data:{user}}),value=>{actual=value;});assert.equal(actual,user);
 assert.equal(await verifiedMember(async()=>({data:{user:{email:'not-an-identity'}}})),null);
});
test('protected routes are locked in HTML before JavaScript loads',()=>{
 for(const page of ['index','siamsi','lucky-numbers','garden','worship']){
  const html=readFileSync('dist/'+page+'.html','utf8');assert.match(html,/<main hidden inert data-member-only /);assert.match(html,/id="member-required"/);assert.match(html,/membership.js/);
 }
});

test('concurrent checks share one request but later actions verify again',async()=>{
 const {createMemberResolver}=await import('./dist/member-access.js');let calls=0,finish;
 const resolve=createMemberResolver(()=>{calls++;return new Promise(r=>{finish=r;});});
 const first=resolve(),second=resolve();assert.equal(calls,1);
 finish({data:{user:{id:'member'}}});assert.equal((await first).id,'member');await second;
 const later=resolve();assert.equal(calls,2);finish({data:{user:{id:'member'}}});await later;
});
test('sign-out invalidates an in-flight verification',async()=>{
 const {createMemberResolver}=await import('./dist/member-access.js');let finish;
 const resolve=createMemberResolver(()=>new Promise(r=>{finish=r;}));const old=resolve();resolve.invalidate();
 finish({data:{user:{id:'old-member'}}});assert.equal(await old,null);
});
test('initial page HTML shows only neutral loading until auth is known',()=>{
 for(const page of ['index','siamsi','lucky-numbers','garden','worship']){
  const html=readFileSync('dist/'+page+'.html','utf8');assert.match(html,/id="member-required" hidden/);assert.match(html,/id="member-loading"/);
 }
 const login=readFileSync('dist/login.html','utf8');assert.match(login,/id="auth-panel" hidden/);assert.match(login,/id="member-panel" hidden/);assert.match(login,/id="auth-loading"/);
});

// New scene must be protected just like the activities it links to.
test('sanctuary starts locked and offers real activity destinations',()=>{
 const html=readFileSync('dist/garden.html','utf8');
 assert.match(html,/<main hidden inert data-member-only/);
 assert.match(html,/id="member-required" hidden/);
 for(const route of ['index.html','siamsi.html','lucky-numbers.html'])assert.ok(html.includes('href="'+route+'"'));
 assert.match(html,/src="garden.js\?v=/);
});
test('3D scene is self-hosted and embedded in the standalone garden',()=>{
 const html=readFileSync('dist/garden.html','utf8');
 assert.match(html,/id="visitor-color"/);
 const script=readFileSync('dist/garden.js','utf8');
 assert.ok(script.includes("import('./vendor/garden3d.js?v=3.21')"));
 const bundle=readFileSync('dist/vendor/garden3d.js','utf8');
 assert.ok(bundle.includes('globalThis.LuckyGarden=LuckyGarden'));
 const offline=readFileSync('../garden.html','utf8');
 assert.ok(offline.includes('globalThis.LuckyGarden=LuckyGarden'));
 assert.ok(!offline.includes("import('./vendor/garden3d.js?v=3.21')"));
});

test('siamsi embeds its local 3D vessel without changing member protection',()=>{
 const html=readFileSync('dist/siamsi.html','utf8');
 assert.match(html,/<main hidden inert data-member-only/);
 assert.match(html,/id="vessel-render-status"/);
 const offline=readFileSync('../siamsi.html','utf8');
 assert.ok(offline.includes('globalThis.LuckyVessel=LuckyVessel'));
 assert.ok(!offline.includes("import('./vendor/siamsi3d.js?v=3.21')"));
});

test('garden exposes an accessible close-up control with a local model bundle',()=>{
 const html=readFileSync('dist/garden.html','utf8');
 assert.match(html,/id="view-altar" disabled[^>]*aria-pressed="false"/);
 const bundle=readFileSync('dist/vendor/garden3d.js','utf8');
 assert.ok(bundle.includes('setCloseup'));
 assert.ok(bundle.includes('reference-inspired-ganesha'));
});
