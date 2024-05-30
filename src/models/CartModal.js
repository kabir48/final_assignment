const mongoose=require('mongoose');
const DataSchema=mongoose.Schema({
        product_id:{type:mongoose.Schema.Types.ObjectId,required:true},
        user_id:{type:mongoose.Schema.Types.ObjectId,required:false},
        color:{type:String,required:true},
        qty:{type:String,required:true},
        size:{type:String,required:true},
        session_id:{type:String}
    },
    {timestamps:true,versionKey:false}
)
const CartModal=mongoose.model('cart_modals',DataSchema)
module.exports=CartModal