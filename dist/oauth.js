import {authConfig} from './auth-config.js';
export const oauthProviders=Object.freeze(['google','github','facebook']);
export function enabledProviders(settings){return Object.fromEntries(oauthProviders.map(name=>[name,settings?.external?.[name]===true]));}
export async function providerAvailability(fetcher=globalThis.fetch){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
 try{const response=await fetcher(authConfig.url+'/auth/v1/settings',{headers:{apikey:authConfig.key},signal:controller.signal,cache:'no-store'});if(!response.ok)throw new Error('provider_settings_unavailable');return enabledProviders(await response.json());}finally{clearTimeout(timer);}
}
export function validatedOAuthURL(raw,provider,redirectTo){
 if(!oauthProviders.includes(provider))throw new Error('unsupported_provider');
 const url=new URL(raw),base=new URL(authConfig.url);
 if(url.protocol!=='https:'||url.origin!==base.origin||url.username||url.password||url.pathname!=='/auth/v1/authorize'||url.searchParams.get('provider')!==provider||url.searchParams.get('redirect_to')!==redirectTo||url.searchParams.get('code_challenge_method')!=='s256'||!url.searchParams.get('code_challenge'))throw new Error('invalid_oauth_destination');
 return url.href;
}
export async function prepareOAuth(client,provider,redirectTo){
 if(!oauthProviders.includes(provider))throw new Error('unsupported_provider');
 const scopes={google:'openid email profile',github:'user:email',facebook:'email'};
 const {data,error}=await client.auth.signInWithOAuth({provider,options:{redirectTo,scopes:scopes[provider],skipBrowserRedirect:true}});
 if(error)throw error;
 return validatedOAuthURL(data?.url,provider,redirectTo);
}
