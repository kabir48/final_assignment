let mongoose=require("mongoose");
const dataSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    des:{
        type:String,
        required:false
    },
    price:{
        type:Number,
    },
    image:{
        type:String,
        required:true
    },
    status:{
       type:String,
       default:"active"
    },
    productID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },publicId:{
        type:String,
        required:false,
    }
},{timestamps:true,versionKey:false});
let ProductSliderModel=mongoose.model('product_sliders',dataSchema);
module.exports=ProductSliderModel