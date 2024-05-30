const mongoose=require('mongoose');
const BrandDataSchema=new mongoose.Schema({
    brandName:{
        type:String,
        required:true,
        unique: true,
    },
    brandImage:{
        type:String,
        required:false
    },
    status:{
        type:String,
        default:"active"
    }
    ,publicId:{
        type:String,
        required:false,
    }
},{timestamps:true,versionKey:false});
let BrandModal=mongoose.model('brands',BrandDataSchema);
module.exports = BrandModal;