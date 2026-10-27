import {readFileSync,writeFileSync} from 'node:fs';
const template=readFileSync(new URL('./index.template.html',import.meta.url),'utf8');
const css=readFileSync(new URL('./dist/style.css',import.meta.url),'utf8');
const random=readFileSync(new URL('./dist/random.js',import.meta.url),'utf8').replace('export function','function');
const app=readFileSync(new URL('./dist/app.js',import.meta.url),'utf8').replace("import {randomDigits} from './random.js';",'');
// A classic, scoped script requires no module loader or cross-file requests.
const script='(function(){\n'+random+'\n'+app+'\n})();';
let html=template.replace('<link rel="stylesheet" href="style.css"><script type="module" src="app.js"></script>','<style>'+css+'</style>');
html=html.replace('</body>','<script>'+script+'</script></body>');
writeFileSync(new URL('./dist/index.html',import.meta.url),html);
writeFileSync(new URL('../lucky-orbit.html',import.meta.url),html);
writeFileSync(new URL('../lucky-orbit-fixed.html',import.meta.url),html);
console.log('Built self-contained HTML for browser and Netlify.');
