import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('all public routes declare a matching HTTPS canonical and Open Graph URL',()=>{
 const root='https://wanatsarutpungkasem-lgtm.github.io/lottary/';
 for(const page of ['index','how-it-works','zodiac','siamsi','lucky-numbers','about']){
  const html=readFileSync(new URL('./dist/'+page+'.html',import.meta.url),'utf8');
  const expected=root+(page==='index'?'':page+'.html');
  assert.equal(html.match(/<link rel="canonical" href="([^"]+)"/)[1],expected);
  assert.equal(html.match(/<meta property="og:url" content="([^"]+)"/)[1],expected);
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
 }
});
