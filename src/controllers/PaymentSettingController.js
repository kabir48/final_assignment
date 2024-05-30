let PaymentSettingModel=require("../models/PaymentSettingModel.js");

exports.createPaymentSetting=async (req,res)=>{
    try{
       const dataBody=req.body;
       let paymentSettingData=await PaymentSettingModel.create(dataBody)
       res.status(200).json({ success: true, data: paymentSettingData });
    }catch(error){
       res.status(500).json({ success: false, error: error.message });
    }
}