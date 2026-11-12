// Fail closed: a stored session or user-editable metadata is not proof of login.
export async function verifiedMember(getUser){
 try{const {data,error}=await getUser();return !error&&data?.user?.id&&data.user.is_anonymous!==true?data.user:null;}catch{return null;}
}
export async function memberAction(getUser,action,onDenied=()=>{}){
 const user=await verifiedMember(getUser);
 if(!user){onDenied();return null;}
 return action(user);
}
// Share concurrent verification only; never reuse a previous successful check.
export function createMemberResolver(getUser){
 let pending=null,epoch=0;
 const resolve=()=>{
  if(pending)return pending;
  const generation=epoch;
  const request=verifiedMember(getUser).then(user=>generation===epoch?user:null);
  pending=request;
  request.finally(()=>{if(pending===request)pending=null;});
  return request;
 };
 resolve.invalidate=()=>{epoch++;pending=null;};
 return resolve;
}
