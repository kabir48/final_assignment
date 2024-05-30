let mongoose=require("mongoose");
let paymentSettingSchema=new mongoose.Schema({
    store_id:{
        type:String,
        required:true,
        unique: true,
    },
    store_passwd:{
        type:String,
        required:true,
        unique: true,
    },
    currency:{
        type:String,
        required:true,
        unique: true,
    },
    success_url:{
        type:String,
        required:true,
        unique: true,
    },
    fail_url:{
        type:String,
        required:true,
        unique: true,
    },
    cancel_url:{
        type:String,
        required:true,
        unique: true,
    },
    ipn_url:{
        type:String,
        required:true,
        unique: true,
    },
    init_url:{
        type:String,
        required:true,
        unique: true,
    },
    status:{
        type:String,
        default:"active"
    },
    name:{
        type:String,
        required:true,
        unique: true,
    }
},{timestamps:true,versionKey:false});
let PaymentSettingModel=mongoose.model('payment_settings',paymentSettingSchema);
module.exports=PaymentSettingModel