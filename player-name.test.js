import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizePlayerName,selectPlayerName} from './dist/player-name.js';
test('empty, whitespace, invisible-only and oversized nicknames are rejected',()=>{
 for(const value of ['', '   ', '\u200B\u200D', '\t\n',null,{},'ก'.repeat(41)])assert.equal(normalizePlayerName(value),'');
});
test('Thai nicknames trim correctly and names retain their intended text',()=>{
 assert.equal(normalizePlayerName('  โอม  '),'โอม');assert.equal(normalizePlayerName('ดาว น้อย'),'ดาว น้อย');assert.equal(normalizePlayerName('ก'.repeat(40)).length,40);
});
test('a remembered nickname takes priority; otherwise use the account profile',()=>{
 assert.equal(selectPlayerName('โอม','วนัศรุต'),'โอม');assert.equal(selectPlayerName('  ','โอม'),'โอม');assert.equal(selectPlayerName(null,null),'');
});
