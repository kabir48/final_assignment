const ProfileModel = require("../models/ProfileModel.js");
const dotEnv = require('dotenv');
dotEnv.config({
    path: './config.env'
});
const { DecodeToken } = require("../helper/AuthToken.js");
const { manageSession } = require('../helper/sessionHelper.js');
const CartModal = require('../models/CartModal');
const {
    userOtpCreate,verifyOtp,profileCreateService
}=require("../services/UserService.js");

// =====function satrt here=====
exports.UserCreateOtp=async (req,res)=>{
    try{
        let result=await userOtpCreate(req)
        return res.status(200).json(result)
    }catch(error){
        return res.status(200).json(error)
    }
}

exports.VerifyOtp = async (req, res) => {
    try {
        let result = await verifyOtp(req);
        if (result && result.status === "success" && result.token) {
            let cookieOption = {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), 
                httpOnly: false, // Ensure security by making the cookie HttpOnly
                 
            };
            //====user cart update===//

            let decodeToken = DecodeToken(result.token)
            const userId = decodeToken.user_id;
            const session_id = manageSession(req);
            await CartModal.updateMany({ session_id: session_id }, { $set: { user_id: userId } });
            //console.log(cookieOption)
            res.cookie('token', result.token, cookieOption);
            return res.status(200).json(result);
        } else {
            return res.status(200).json(result || { status: "fail", message: "OTP verification failed" });
        }
    } catch (error) {
        console.error("Error in VerifyOtp:", error); // Debugging log
        return res.status(500).json({ status: "fail", message: error.message });
    }
};


exports.logoutFunction=async(req,res)=>{
    let cookieOption={expires:new Date(Date.now()-24*6060*1000), httpOnly:false}
    res.cookie('token',"",cookieOption)
    return res.status(200).json({status:"success"})
 }

exports.ReadProfile=async(req,res)=>{
    try{
        let data=await ProfileModel.aggregate([
            {
                $project:{_id:0,createdAt:0,updatedAt:0}
            }
        ]);
        return res.status(200).json({status:"success",data:data})
    }catch(error){
        return res.status(500).json({status:"fail",error:error.toString()})
    }
}

//  ======Profile Create====//
exports.profileCreate=async (req,res)=>{
    let result=await profileCreateService(req)
    return res.status(200).json(result)
}


//  ======Profile Update====//
exports.profileUpdate=async (req,res)=>{
    let result=await profileCreateService(req)
    return res.status(200).json(result)
}
 