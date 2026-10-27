import test from 'node:test';
import assert from 'node:assert/strict';
import {randomDigits} from './dist/random.js';
test('rejects biased tail values and preserves zeroes',()=>{const source={getRandomValues(a){a.set([255,254,253,252,251,250,0,1,2,3,4,5]);return a;}};assert.equal(randomDigits(6,source),'012345');});
test('all accepted byte values give equal digit frequencies',()=>{const counts=Array(10).fill(0);for(let x=0;x<250;x++){const source={getRandomValues(a){a.fill(x);return a;}};counts[Number(randomDigits(2,source)[0])]++;}assert.deepEqual(counts,Array(10).fill(25));});
test('secure source produces strings of the requested length',()=>{for(const n of [2,3,6])for(let i=0;i<100;i++)assert.match(randomDigits(n),new RegExp('^\\d{'+n+'}$'));});
test('does not silently substitute an insecure random source',()=>{assert.throws(()=>randomDigits(2,{}));assert.throws(()=>randomDigits(5));});
