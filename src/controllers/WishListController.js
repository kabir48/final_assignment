let WishListModel=require('../models/WishListModel.js');
const mongoose = require("mongoose");
const ObjectId=mongoose.Types.ObjectId
exports.createWishList=async(req,res)=>{
   try{
    let user_id=req.headers.user_id;
   let bodyData=req.body;
   bodyData.user_id=user_id;
   let data=await WishListModel.create(bodyData);
   res.status(200).json({status:true,data:data})
   }catch(error){
    res.status(500).json({status:"fail",error:error.toString()})
   }

}

exports.readWishList = async (req, res) => {
    try {
        const userId = req.headers.user_id;
        if (!userId) {
            return res.status(400).json({ status: "fail", message: "User ID is required" });
        }

        const userObjectId = new ObjectId(userId);
        const matchStage = { $match: { user_id: userObjectId } };

        const wishlist = await WishListModel.aggregate([
            matchStage,
            { $sort: { _id: -1 } },
            {
                $lookup: {
                    from: "products",
                    localField: "product_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $lookup: {
                    from: "brands",
                    localField: "product.brand_id",
                    foreignField: "_id",
                    as: "brand"
                }
            },
            { $unwind: "$brand" },
            {
                $lookup: {
                    from: "categories",
                    localField: "product.category_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },
            {
                $lookup: {
                    from: "product_details",
                    localField: "product._id",
                    foreignField: "product_id",
                    as: "detail"
                }
            },
            {
                $unwind: {
                    path: "$detail",
                    preserveNullAndEmptyArrays: true // Preserve documents without product details
                }
            },
            {
                $project: {
                    'createdAt': 0,
                    'updatedAt': 0,
                    'category.createdAt': 0,
                    'category.updatedAt': 0,
                    'category.publicId': 0,
                    'brand.createdAt': 0,
                    'brand.updatedAt': 0,
                    'brand.publicId': 0,
                    'detail.createdAt': 0,
                    'detail.updatedAt': 0,
                    'detail.publicId': 0,
                    'detail.product_id': 0,
                    'product.updatedAt': 0,
                    'product.publicId': 0,
                    'product.product_id': 0,
                }
            }
        ]);

        if (!wishlist.length) {
            return res.status(404).json({ status: "fail", message: "No wishlist found" });
        }

        res.status(200).json({ status: "success", data: wishlist });
    } catch (error) {
        console.error("Error in readWishList:", error); // Debugging log
        res.status(500).json({ status: "fail", error: error.toString() });
    }
};

exports.deleteWish = async (req,res) => {
    try {
        const userId = req.headers.user_id
        const productId = req.body.product_id;

        await WishListModel.deleteOne({ user_id: userId, product_id: productId });

        return res.status(200).json({ status: "success", message: "Wish list item removed successfully" });
    } catch (error) {
        console.error("Error in deleteWish:", error); // Debugging log
        return res.status(500).json({ status: "fail", message: "Something went wrong!" });
    }
};
