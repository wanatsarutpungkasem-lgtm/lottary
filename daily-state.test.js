import test from 'node:test';
import assert from 'node:assert/strict';
import {bangkokDay,normalizeDaily,recordDaily} from './dist/daily-state.js';
const last={digits:2,batch:['00','12','34'],time:1000};
test('Bangkok date rolls over at Thai midnight',()=>{assert.equal(bangkokDay(new Date('2026-10-29T16:59:59Z')),'2026-10-29');assert.equal(bangkokDay(new Date('2026-10-29T17:00:00Z')),'2026-10-30');});
test('three draws persist with latest result and block the fourth',()=>{let state=null;for(let i=0;i<3;i++)state=recordDaily(state,last,'2026-10-29');const restored=normalizeDaily(JSON.parse(JSON.stringify(state)),'2026-10-29');assert.equal(restored.used,3);assert.deepEqual(restored.last,last);assert.throws(()=>recordDaily(restored,last,'2026-10-29'));});
test('next day resets allowance while retaining latest result',()=>{const state=normalizeDaily({date:'2026-10-29',used:3,last},'2026-10-30');assert.equal(state.used,0);assert.deepEqual(state.last,last);});
test('bad saved results cannot become visible number sets',()=>{assert.equal(normalizeDaily({last:{...last,batch:['<script>']}}).last,null);assert.equal(normalizeDaily({last:{...last,batch:['12','12','00']}}).last,null);assert.equal(normalizeDaily({date:'2026-10-29',used:-3},'2026-10-29').used,0);});
