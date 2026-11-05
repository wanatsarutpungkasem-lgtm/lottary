import test from 'node:test';
import assert from 'node:assert/strict';
import {enabledProviders,providerAvailability,validatedOAuthURL,prepareOAuth} from './dist/oauth.js';
import {authConfig} from './dist/auth-config.js';
const redirect=authConfig.site+'login.html';
function target(provider='google',destination=redirect){const u=new URL(authConfig.url+'/auth/v1/authorize');u.searchParams.set('provider',provider);u.searchParams.set('redirect_to',destination);u.searchParams.set('code_challenge_method','s256');u.searchParams.set('code_challenge','A'.repeat(43));return u.href;}
test('provider flags are fail-closed and ignore unexpected values',()=>{
 assert.deepEqual(enabledProviders(null),{google:false,github:false,facebook:false});
 assert.deepEqual(enabledProviders({external:{google:true,github:'true',facebook:false,evil:true}}),{google:true,github:false,facebook:false});
});
test('availability requests the selected backend without cache or secrets',async()=>{
 let seen;const result=await providerAvailability(async(url,options)=>{seen={url,options};return {ok:true,json:async()=>({external:{github:true}})};});
 assert.equal(seen.url,authConfig.url+'/auth/v1/settings');assert.equal(seen.options.cache,'no-store');assert.ok(seen.options.headers.apikey.startsWith('sb_publishable_'));assert.equal(result.github,true);
 await assert.rejects(()=>providerAvailability(async()=>({ok:false})),/unavailable/);
});
test('OAuth destinations must use the configured backend, correct callback and PKCE',()=>{
 assert.equal(validatedOAuthURL(target(),'google',redirect),target());
 for(const raw of [target().replace(authConfig.url,'https://attacker.example'),target('github'),target('google','https://attacker.example'),target().replace('/authorize','/logout'),target().replace('s256','plain')])assert.throws(()=>validatedOAuthURL(raw,'google',redirect));
 assert.throws(()=>validatedOAuthURL(target(),'unknown',redirect));
});
test('OAuth asks only for identity scopes and leaves navigation under app control',async()=>{
 for(const provider of ['google','github','facebook']){let request;const client={auth:{signInWithOAuth:async input=>{request=input;return {data:{url:target(provider)},error:null};}}};
 assert.equal(await prepareOAuth(client,provider,redirect),target(provider));assert.equal(request.options.skipBrowserRedirect,true);assert.equal(request.options.redirectTo,redirect);assert.doesNotMatch(request.options.scopes,/repo|gist|publish|pages_/);
 }
});
test('provider errors propagate and unknown providers never call auth',async()=>{
 let calls=0;const client={auth:{signInWithOAuth:async()=>{calls++;return {error:new Error('disabled')};}}};
 await assert.rejects(()=>prepareOAuth(client,'unknown',redirect),/unsupported/);assert.equal(calls,0);
 await assert.rejects(()=>prepareOAuth(client,'google',redirect),/disabled/);
});

import {resolveAuthReturn} from './dist/auth-redirect.js';
test('only the approved local origin can receive a development auth callback',()=>{
 assert.equal(resolveAuthReturn('http://127.0.0.1:4187'),'http://127.0.0.1:4187/login.html');
 assert.equal(resolveAuthReturn('http://127.0.0.1:4187',true),'http://127.0.0.1:4187/login.html?mode=recovery');
 for(const origin of ['https://attacker.example','http://127.0.0.1:4187.attacker.example','http://127.0.0.1:4188','null',undefined])assert.equal(resolveAuthReturn(origin),redirect);
});
