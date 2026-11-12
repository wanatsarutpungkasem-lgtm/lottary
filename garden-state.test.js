import test from 'node:test';
import assert from 'node:assert/strict';
import {appearance,cleanAlias,cleanNote,peerPayload} from './dist/garden-state.js';
import {createAdultVisitor} from './src/adult-visitor.js';
import * as THREE from 'three';
test('remote visitors reject missing identity and non-finite positions',()=>{
 for(const value of [null,{},false,{sid:'bad',alias:'A',x:50,y:70},{sid:'valid-id-123',alias:'A',x:NaN,y:70},{sid:'valid-id-123',alias:'A',x:50,y:Infinity}])assert.equal(peerPayload(value),null);
});
test('remote appearance and position are bounded; extra user data is discarded',()=>{
 const peer=peerPayload({sid:'valid-id-123',alias:'  ผู้มาเยือน  ',x:900,y:-100,color:'javascript:bad',skin:'#ffffff',hairStyle:'unexpected',email:'private@example.com',token:'secret',pose:'evil'});
 assert.deepEqual(peer,{sid:'valid-id-123',alias:'ผู้มาเยือน',x:90,y:53,...appearance(),pose:'idle'});
 assert.ok(!JSON.stringify(peer).includes('private@example.com'));
});
test('aliases remove invisible direction controls and notes have a size limit',()=>{
 assert.equal(cleanAlias(' \u200bโอม\u202e '),'โอม');assert.equal(cleanAlias('ก'.repeat(60)).length,16);assert.equal(cleanAlias(null),'');
 assert.equal(cleanNote('x'.repeat(1000)).length,400);assert.equal(cleanNote({}),'');
});
test('adult visitor walking and wai produce finite model transforms',()=>{
 const visitor=createAdultVisitor();const original=new THREE.Box3().setFromObject(visitor.group).getSize(new THREE.Vector3());assert.ok(original.y>1.7&&original.y<1.9);
 for(const phase of [0,1,2,3,4])visitor.setWalking(phase,true);visitor.setWalking(0,false);visitor.setPose('wai');visitor.group.updateMatrixWorld(true);visitor.group.traverse(o=>assert.ok(o.matrixWorld.elements.every(Number.isFinite)));visitor.setPose('idle');
});
