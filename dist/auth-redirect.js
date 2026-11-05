import {authConfig} from './auth-config.js';
export function resolveAuthReturn(origin,recovery=false){
 const base=origin==='http://127.0.0.1:4187'?'http://127.0.0.1:4187/':authConfig.site;
 return new URL('login.html'+(recovery?'?mode=recovery':''),base).href;
}
