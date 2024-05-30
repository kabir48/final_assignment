const { uploadImage, deleteImage } = require('../helper/upload.js');
const ProductSliderModel=require("../models/ProductSliderModel");

const createSlider=async(req)=>{
    try{
       const {
            title,des,price,productID
        }=req.body;
        let folder="ecommerce/slider";
        let options={
            width:1200,
            height:726,
            quality:100,
        };
        const imagePath = req.file.path;
        const publicId = `${title.replace(/\s+/g, '_')}`;
        const { url, public_id} = await uploadImage(imagePath, folder, options, publicId);
        const newCategory=new ProductSliderModel({
            title,
            des,
            price,
            productID,
            image:url,
            publicId:public_id
        });
        await newCategory.save();
        return { success: true,message:"Slider Created Successfully",category: newCategory };
    }catch(error){
        console.error('Error creating category:', error.toString());
        return{success:false,error:"Server Problem"}
    }
};

// =======Read Product Silder==
const getSlider=async(req)=>{
    try{
        
        let data=await ProductSliderModel.aggregate([
            {
                $sort:{_id:-1}
            },
            {$lookup:{from:"products",localField:"productID",foreignField:"_id",as:"product"}},
            {
                $project:{
                    title:"$title",
                    price:{$toDouble:"$price"},
                    detail:"$des",
                    image:"$image",
                    status:"$status",
                    productName: { $first: "$product.title" },
                    productid: { $first: "$product._id" },
                }
    
            },

        ]);
        return{success:true,data:data}  
    }catch(error){
        console.error('Error creating category:', error.toString());
        return{success:false,error:"Server Problem"}  
    }
}
module.exports={
    createSlider,
    getSlider
}