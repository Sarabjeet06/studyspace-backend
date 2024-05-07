import User from "../models/user";

export const check_user_id = async(id)=>{
      try{
           const user = await User.findOne({user_id : id});
           if(user){
                return true;
           }else{
                return false;
           }
      }catch(err){
           console.log(err);
      }
}
