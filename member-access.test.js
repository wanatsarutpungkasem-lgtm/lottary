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
 for(const page of ['index','siamsi','lucky-numbers']){
  const html=readFileSync('dist/'+page+'.html','utf8');assert.match(html,/<main hidden inert data-member-only /);assert.match(html,/id="member-required"/);assert.match(html,/membership.js/);
 }
});
