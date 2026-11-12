import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeVisitorEvent} from './backend/sanctuary-event/protocol.js';
const base={kind:'join',client_id:'12345678-1234-1234-1234-123456789abc',seq:1,alias:'ทดสอบ',x:50,y:77};
test('verified user determines sender and client cannot forge identity',async()=>{const a=await normalizeVisitorEvent({...base,sid:'victim',user_id:'victim',email:'private'},'user-a');const b=await normalizeVisitorEvent(base,'user-b');assert.notEqual(a.peer.sid,b.peer.sid);assert.match(a.peer.sid,/^[a-f0-9]{64}$/);assert.deepEqual(Object.keys(a.peer).sort(),['sid','alias','x','y','color','skin','hairStyle','pose'].sort());assert.deepEqual(a,await normalizeVisitorEvent(base,'user-a'));});
test('visitor input rejects invalid sequence, client and coordinates',async()=>{for(const change of [{seq:-1},{seq:1.5},{client_id:'victim'},{x:NaN},{y:'77'},{alias:''}])await assert.rejects(normalizeVisitorEvent({...base,...change},'user-a'));});
test('coordinates are bounded and leave reveals only opaque sender',async()=>{const a=await normalizeVisitorEvent({...base,x:999,y:-10},'user-a');assert.equal(a.peer.x,90);assert.equal(a.peer.y,53);const b=await normalizeVisitorEvent({...base,kind:'leave'},'user-a');assert.deepEqual(b,{kind:'leave',sid:a.peer.sid,seq:1});});
