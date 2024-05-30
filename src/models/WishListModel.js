const mongoose=require('mongoose');
const DataSchema=mongoose.Schema({
        product_id:{type:mongoose.Schema.Types.ObjectId,required:true},
        user_id:{type:mongoose.Schema.Types.ObjectId,required:true},
    },
    {timestamps:true,versionKey:false}
)
const WishListModel=mongoose.model('wish_lists',DataSchema)
module.exports=WishListModel