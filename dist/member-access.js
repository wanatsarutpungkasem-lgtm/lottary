// Fail closed: a stored session or user-editable metadata is not proof of login.
export async function verifiedMember(getUser){
 try{const {data,error}=await getUser();return !error&&data?.user?.id&&data.user.is_anonymous!==true?data.user:null;}catch{return null;}
}
export async function memberAction(getUser,action,onDenied=()=>{}){
 const user=await verifiedMember(getUser);
 if(!user){onDenied();return null;}
 return action(user);
}
