import test from 'node:test';
import assert from 'node:assert/strict';
import {secureIndex,uniqueNumbers} from './dist/discovery.js';
test('rejects the unequal remainder when choosing from six cards',()=>{
 let calls=0;const source={getRandomValues(a){a[0]=calls++===0?0xffffffff:5;return a;}};
 assert.equal(secureIndex(6,source),5);assert.equal(calls,2);
});
test('requested batches contain distinct fixed-width values',()=>{
 for(const digits of [2,3,6])for(const count of [1,3,5]){
  const values=uniqueNumbers(digits,count);assert.equal(values.length,count);assert.equal(new Set(values).size,count);
  for(const value of values)assert.match(value,new RegExp('^\\d{'+digits+'}$'));
 }
});
test('does not accept unsupported parameters or insecure randomness',()=>{
 assert.throws(()=>secureIndex(0));assert.throws(()=>secureIndex(6,{}));assert.throws(()=>uniqueNumbers(4,3));assert.throws(()=>uniqueNumbers(2,100));
});
