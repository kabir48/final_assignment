const mongoose=require('mongoose');
const DataSchema=mongoose.Schema({
        product_id:{type:mongoose.Schema.Types.ObjectId,required:true},
        user_id:{type:mongoose.Schema.Types.ObjectId,required:true},
        des:{type:String,required:true},
        rating:{type:String,required:true},
    },
    {timestamps:true,versionKey:false}
)
const ProductReviewModel=mongoose.model('product_reviews',DataSchema)
module.exports=ProductReviewModel