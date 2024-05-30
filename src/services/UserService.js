let EmailHelper=require("../helper/EmailHelper.js");
let UserModel=require("../models/UserModel.js");
let {EncodeToken}=require("../helper/AuthToken.js");
let ProfileModel=require('../models/ProfileModel.js')
const userOtpCreate=async(req)=>{
    try{
        let email=req.params.email;
       //console.log(email)
        let code=Math.floor(100000+Math.random()*900000);
        let emailData = {
            EmailTo: email,
            EmailText: "Your PIN Code is= " + code,
            emailSubject: "Otp Verification"
        };
        await EmailHelper(emailData);
        await UserModel.updateOne({email:email},{$set:{otp:code}},{upsert:true});
        return {status:"success",message:"6 Digit Otp Send To You Mail"}
    }catch(error){
        return {status:"fail", message:error.toString()}
    }
}

const verifyOtp=async(req)=>{
    try{
       let email=req.params.email;
       let otp=req.params.otp;
       let countCurrentUser=await UserModel.find({email:email,otp:otp}).count('total');
       if(countCurrentUser>0){
            let user_id=await UserModel.find({email:email,otp:otp}).select('_id');
            let token=EncodeToken(email,user_id[0]['_id'].toString())
            await UserModel.updateOne({email:email},{$set:{otp:"0"}})
            return {status:"success", message:"Valid OTP",token:token}
        }
        else{
            return {status:"fail", message:"Invalid OTP"}
        }
        
    }catch(error){
        return {status:"fail", message:error.toString()}
    }
}


const profileCreateService = async (req) => {
    try {
        let user_id=req.headers.user_id;
        //console.log(user_id)
        let reqBody=req.body;
        reqBody.user_id=user_id;
        await ProfileModel.updateOne({user_id:user_id},{$set:reqBody},{upsert:true})
        return {status:"success", message:"Profile Save Success"}
    }catch (e) {
        return {status:"fail", message:"Something Went Wrong"}
    }
 }
 


module.exports={
    userOtpCreate,
    verifyOtp,
    profileCreateService
}