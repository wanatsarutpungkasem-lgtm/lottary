import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
import {cards} from './dist/siamsi-cards.js';
import {secureIndex} from './dist/discovery.js';
test('28 complete original leaves with unique titles and matching numbers',()=>{assert.equal(cards.length,28);assert.equal(new Set(cards.map(c=>c.title)).size,28);cards.forEach((c,i)=>{assert.equal(c.id,i+1);for(const field of ['title','reading','action','wish'])assert.equal(typeof c[field],'string');});});
test('28-leaf selector rejects biased tail before selecting last leaf',()=>{const data=[0xffffffff,27];assert.equal(secureIndex(28,{getRandomValues(a){a[0]=data.shift();return a;}}),27);assert.equal(data.length,0);});
test('offline previews keep executable script syntax after bundling regexes',()=>{for(const name of ['lucky-orbit-fixed','siamsi','lucky-numbers']){const html=readFileSync('../'+name+'.html','utf8');for(const block of html.matchAll(/<script>([\s\S]*?)<\/script>/g))assert.doesNotThrow(()=>new Script(block[1]));}});
