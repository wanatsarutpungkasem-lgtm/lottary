import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {readHistory,readKeeps} from './dist/safe-state.js';
const pages=['index','how-it-works','zodiac','siamsi','lucky-numbers','about','login'];
const policy=h=>h.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
test('public policies precede resources and deny external script, network, form and embedded content',()=>{
 for(const page of pages){const h=readFileSync('./dist/'+page+'.html','utf8'),p=policy(h);
  for(const rule of ["default-src 'none'","script-src 'self'","connect-src https://wabbwmoeuxszibgzolzx.supabase.co","form-action 'none'","base-uri 'none'","object-src 'none'","frame-src 'none'"])assert.ok(p.split('; ').includes(rule));
  assert.ok(h.indexOf('Content-Security-Policy')<h.indexOf('rel="stylesheet"'));
  assert.ok(h.includes('name="referrer" content="no-referrer"'));
  assert.ok(!p.includes('frame-ancestors')); // Unsupported in meta; do not pretend to enforce it.
  assert.ok(!p.match(/script-src[^;]*(unsafe-inline|unsafe-eval)/));
 }
});
test('standalone scripts have exact CSP hashes without relaxing script execution',()=>{
 for(const page of ['lucky-orbit-fixed','how-it-works','zodiac','siamsi','lucky-numbers','about','login']){
  const h=readFileSync('../'+page+'.html','utf8'),p=policy(h),scripts=[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,1);
  assert.ok(p.includes("script-src 'sha256-"+createHash('sha256').update(scripts[0][1]).digest('base64')+"'"));
  assert.ok(!p.includes('unsafe-eval'));assert.ok(!p.match(/script-src[^;]*unsafe-inline/));
 }
});
test('history discards malformed shapes, invalid dates and unexpected properties',()=>{
 const good={name:'โอม',number:'001',time:100,sign:'leo',injected:'ignored'};
 assert.deepEqual(readHistory(JSON.stringify([null,{},false,{...good,number:'<img>'},{...good,time:9e20},good])),[{name:'โอม',number:'001',time:100,sign:'leo'}]);
 assert.equal(readHistory(JSON.stringify([{...good,sign:'__proto__'}]))[0].sign,'none');
});
test('damaged and oversized storage is ignored, and history is bounded',()=>{
 for(const value of [null,'{bad','{}','null','x'.repeat(1000001)])assert.deepEqual(readHistory(value),[]);
 assert.equal(readHistory(JSON.stringify(Array.from({length:300},()=>({name:'A',number:'00',time:0})))).length,200);
});
test('saved leaves reject null, duplicate, out-of-range entries and extra fields',()=>{
 assert.deepEqual(readKeeps(JSON.stringify([null,{},false,{id:0,time:1},{id:29,time:1},{id:2,time:-1},{id:2,time:10,reading:'untrusted'},{id:2,time:20}])),[{id:2,time:10}]);
 for(const value of [null,'broken','{}','x'.repeat(100001)])assert.deepEqual(readKeeps(value),[]);
});
test('UI scripts keep untrusted strings out of HTML and executable sinks',()=>{
 for(const f of readdirSync('./dist').filter(f=>f.endsWith('.js'))){const s=readFileSync('./dist/'+f,'utf8');assert.doesNotMatch(s,/\.innerHTML\s*=|\.outerHTML\s*=|insertAdjacentHTML\s*\(|document\.write\s*\(|\beval\s*\(|new Function\s*\(/,f);}
 for(const page of pages){const h=readFileSync('./dist/'+page+'.html','utf8');assert.doesNotMatch(h,/\son[a-z]+\s*=/i);}
});
