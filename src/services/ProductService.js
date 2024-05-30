let ProductModel=require("../models/ProductModel.js");
let ProductReviewModel=require("../models/ProductReviewModel.js");
const { uploadImage, deleteImage } = require('../helper/upload.js');
const mongoose =require('mongoose');
const ObjectId=mongoose.Types.ObjectId;
// =====Create Product====//
const readProduct=async(req)=>{
    try{
        let sort={
            $sort:{_id:-1}
        }

        //let JoinWithBrandStage= {$lookup:{from:"brands",localField:"brand_id",foreignField:"_id",as:"brand"}};
        //console.log(JoinWithBrandStage)

        //let JoinWithCategoryStage={$lookup:{from:"categories",localField:"category_id",foreignField:"_id",as:"category"}};

        //let UnwindBrandStage={$unwind:"$brand"}
        //console.log(UnwindBrandStage)
        //let UnwindCategoryStage={$unwind:"$category"}

        // let ProjectStage={
        //     $project:{
        //         'brand._id':0,
        //         'category._id':0,
        //         'category_id':0,
        //         'brand_id':0,
        //         brandName: {
        //              $first: "$brand.brandName" 
        //         },
        //         categoryName: {
        //             $first: "$category.categoryName" 
        //        },
        //     }
        // }
        let data=await ProductModel.aggregate([
            sort,
            {$lookup:{from:"brands",localField:"brand_id",foreignField:"_id",as:"brand"}},
            {$lookup:{from:"categories",localField:"category_id",foreignField:"_id",as:"category"}},
            //JoinWithBrandStage,
            //JoinWithCategoryStage,
           // UnwindBrandStage,
           // UnwindCategoryStage,
            //ProjectStage
            {
                $project:{
                    product_name:"$title",
                    product_price:{$toDouble:"$price"},
                    product_detail:"$shortDes",
                    discount:"$discount",
                    discount_type:"$discount_type",
                    stock:{$toDouble:"$stock"},
                    total:{$toDouble:"$total"},
                    product_image:"$image",
                    remark:"$remark",
                    status:"$status",
                    brandName: { $first: "$brand.brandName" },
                    categoryName: { $first: "$category.categoryName" },
                }
    
            },

        ]);
        return {success:true,product:data}
    }catch(error){
        return { success: false, error: error.message };
    }
}

//====single products====//
const productDetail = async (req) => {
    try {
        let productId = new ObjectId(req.params.id);
        let matchStage = {
            $match: { _id: productId }
        };

        let JoinWithBrandStage = {
            $lookup: {
                from: "brands",
                localField: "brand_id",
                foreignField: "_id",
                as: "brand"
            }
        };

        let JoinWithCategoryStage = {
            $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category"
            }
        };

        let JoinWithDetailsStage = {
            $lookup: {
                from: "product_details",
                localField: "_id",
                foreignField: "product_id",
                as: "detail"
            }
        };

        let JoinWithReviewStage = {
            $lookup: {
                from: "product_reviews",
                localField: "_id",
                foreignField: "product_id",
                as: "review"
            }
        };

        let AddReviewSummaryStage = {
            $addFields: {
                review: {
                    $map: {
                        input: "$review",
                        as: "rev",
                        in: {
                            _id: "$$rev._id",
                            product_id: "$$rev.product_id",
                            user_id: "$$rev.user_id",
                            des: "$$rev.des",
                            rating: { $toDouble: "$$rev.rating" },  // Convert rating to double
                            createdAt: "$$rev.createdAt",
                            updatedAt: "$$rev.updatedAt"
                        }
                    }
                }
            }
        };

        let CalculateReviewSummaryStage = {
            $addFields: {
                reviewSummary: {
                    totalRating: { $sum: "$review.rating" },
                    averageRating: { $avg: "$review.rating" },
                    reviewCount: { $size: "$review" }
                }
            }
        };
        let ProjectionStage = {
            $project: {
                'brand._id': 0,
                'category._id': 0,
                'detail._id': 0,
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
            }
        };

        let data = await ProductModel.aggregate([
            matchStage,
            JoinWithBrandStage,
            JoinWithCategoryStage,
            JoinWithDetailsStage,
            JoinWithReviewStage,
            AddReviewSummaryStage,
            CalculateReviewSummaryStage,
            ProjectionStage
        ]);

        return { status: "success", data: data };
    } catch (e) {
        return { status: "fail", data: e.toString() };
    }
};





//=====category products====//
const productByCategory=async(req)=>{
    try{
        let categoryId=new ObjectId(req.params.category_id)
        let matchStatge={
            $match:{category_id:categoryId}
        }

        let data=await ProductModel.aggregate([
            matchStatge,
            {$lookup:{from:"brands",localField:"brand_id",foreignField:"_id",as:"brand"}},
            {$lookup:{from:"categories",localField:"category_id",foreignField:"_id",as:"category"}},
            {
                $project:{
                    product_name:"$title",
                    product_price:{$toDouble:"$price"},
                    product_detail:"$shortDes",
                    discount:"$discount",
                    discount_type:"$discount_type",
                    stock:{$toDouble:"$stock"},
                    total:{$toDouble:"$total"},
                    product_image:"$image",
                    remark:"$remark",
                    status:"$status",
                    brandName: { $first: "$brand.brandName" },
                    categoryName: { $first: "$category.categoryName" },
                }
    
            },

        ])

        return {success:true,product:data}
    }catch(error){
        return { success: false, error: error.message };
    }
}


//=====category products====//
const productByBrand=async(req)=>{
    try{
        let brandId=new ObjectId(req.params.brand_id)
        let matchStatge={
            $match:{brand_id:brandId}
        }

        let data=await ProductModel.aggregate([
            matchStatge,
            {$lookup:{from:"brands",localField:"brand_id",foreignField:"_id",as:"brand"}},
            {$lookup:{from:"categories",localField:"category_id",foreignField:"_id",as:"category"}},
            {
                $project:{
                    product_name:"$title",
                    product_price:{$toDouble:"$price"},
                    product_detail:"$shortDes",
                    discount:"$discount",
                    discount_type:"$discount_type",
                    stock:{$toDouble:"$stock"},
                    total:{$toDouble:"$total"},
                    product_image:"$image",
                    remark:"$remark",
                    status:"$status",
                    brandName: { $first: "$brand.brandName" },
                    categoryName: { $first: "$category.categoryName" },
                }
    
            },

        ])

        return {success:true,product:data}
    }catch(error){
        return { success: false, error: error.message };
    }
}
//=====keyword products filter====//
const filterProductByRemark=async(req)=>{
    try{
        
        let Remark=req.params.remark;
        let matchStatge={$match:{remark:Remark}}

        let data=await ProductModel.aggregate([
            matchStatge,
            {$lookup:{from:"brands",localField:"brand_id",foreignField:"_id",as:"brand"}},
            {$lookup:{from:"categories",localField:"category_id",foreignField:"_id",as:"category"}},
            {
                $project:{
                    product_name:"$title",
                    product_price:{$toDouble:"$price"},
                    product_detail:"$shortDes",
                    discount:"$discount",
                    discount_type:"$discount_type",
                    stock:{$toDouble:"$stock"},
                    total:{$toDouble:"$total"},
                    product_image:"$image",
                    remark:"$remark",
                    status:"$status",
                    brandName: { $first: "$brand.brandName" },
                    categoryName: { $first: "$category.categoryName" },
                }
    
            },

        ]);

        return {success:true,product:data}
    }catch(error){
        return { success: false, error: error.message };
    }
}

// =======products keyword=======//

const filterByProduct=async(req)=>{
    try{
        let matchId={};
        if(req.body['category_id']){
            matchId.category_id=new ObjectId(req.body['category_id']);
        }
        if(req.body['brand_id']){
            matchId.brand_id=new ObjectId(req.body['brand_id']);
        }

        let matchStage={
            $match:matchId
        }

        let priceFieldStatge={
            $addFields: { numericPrice: { $toInt: "$price" }}
        }
        let priceMin = parseInt(req.body['priceMin']);
        let priceMax = parseInt(req.body['priceMax']);
        let PriceMatchConditions = {};
        if (!isNaN(priceMin)) {
            PriceMatchConditions['numericPrice'] = { $gte: priceMin };
        }
        if (!isNaN(priceMax)) {
            PriceMatchConditions['numericPrice'] = { ...(PriceMatchConditions['numericPrice'] || {}), $lte: priceMax };
        }
        let PriceMatchStage = { $match: PriceMatchConditions };

        let data=await ProductModel.aggregate([
            matchStage,
            priceFieldStatge,
            PriceMatchStage,

            {$lookup:{from:"brands",localField:"brand_id",foreignField:"_id",as:"brand"}},
            {$lookup:{from:"categories",localField:"category_id",foreignField:"_id",as:"category"}},
            {
                $project:{
                    product_name:"$title",
                    product_price:{$toDouble:"$price"},
                    product_detail:"$shortDes",
                    discount:"$discount",
                    discount_type:"$discount_type",
                    stock:{$toDouble:"$stock"},
                    total:{$toDouble:"$total"},
                    product_image:"$image",
                    remark:"$remark",
                    status:"$status",
                    brandName: { $first: "$brand.brandName" },
                    categoryName: { $first: "$category.categoryName" },
                }
    
            },

        ]);
        return {status:"success",data:data}

        
    }catch(error){
       return { success: false, error: error.message };
    }
}

// =====similar products====//
const ListBySmilierProduct = async (req) => {

    try {
        let CategoryID=new ObjectId(req.params.category_id);
        let MatchStage={$match:{category_id:CategoryID}}
        let limitStage={$limit:20}

        

        let data= await  ProductModel.aggregate([
            MatchStage, limitStage,
            {$lookup:{from:"brands",localField:"brand_id",foreignField:"_id",as:"brand"}},
            {$lookup:{from:"categories",localField:"category_id",foreignField:"_id",as:"category"}},
            {
                $project:{
                    product_name:"$title",
                    product_price:{$toDouble:"$price"},
                    product_detail:"$shortDes",
                    discount:"$discount",
                    discount_type:"$discount_type",
                    stock:{$toDouble:"$stock"},
                    total:{$toDouble:"$total"},
                    product_image:"$image",
                    remark:"$remark",
                    status:"$status",
                    brandName: { $first: "$brand.brandName" },
                    categoryName: { $first: "$category.categoryName" },
                }
    
            },

        ])
        return {status:"success",data:data}

    }
    catch (e) {
        return {status:"fail",data:e}.toString()
    }

}

//=========Search by product,category,brands======//
const searchWithKeyword = async (req) => {
    try {
        const keyword = req.params.Keyword;
        const searchRegex = { "$regex": keyword, "$options": "i" };

        const pipeline = [
            {
                $lookup: {
                    from: "brands",
                    localField: "brand_id",
                    foreignField: "_id",
                    as: "brand"
                }
            },
            { $unwind: "$brand" },
            {
                $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },
            {
                $match: {
                    $or: [
                        { title: searchRegex },
                        { shortDes: searchRegex },
                        { "brand.brandName": searchRegex },
                        { "category.categoryName": searchRegex }
                    ]
                }
            },
            {
                $project: {
                    product_name: "$title",
                    product_price: { $toDouble: "$price" },
                    product_detail: "$shortDes",
                    discount: "$discount",
                    discount_type: "$discount_type",
                    stock: { $toDouble: "$stock" },
                    total: { $toDouble: "$total" },
                    product_image: "$image",
                    remark: "$remark",
                    status: "$status",
                    brandName: "$brand.brandName",
                    categoryName: "$category.categoryName",
                }
            }
        ];

        const data = await ProductModel.aggregate(pipeline);
        return { status: "success", data: data };
    } catch (e) {
        console.error("Error during aggregation:", e); // Log the error
        return { status: "fail", data: e.toString() };
    }
};

// ======create products=====//
const createProduct=async(req)=>{
    try{
        let {title,shortDes,price,discount_type=null,
            discount=null,brand_id,category_id,remark}=req.body;
            
            // ===Check if discount is applied=====//
            let total = price;
            if (discount_type === 'percentage' && discount) {
                if (discount <= 100) { // Ensure discount percentage is within range
                    const discountAmount = (discount / 100) * price; // Calculate discount amount
                    total = price - discountAmount; // Apply percentage discount
                } else {
                    throw new Error("Discount percentage must be between 0 and 100.");
                }
            }else if (discount_type === 'flat' && discount) {
                total = product_price - discount; // Apply flat-rate discount
            }else{
                total=""
            }

            const imagePath = req.file.path; 
            const folder = 'ecommerce/products';
            const options = {
                width: 300, 
                height: 300, 
                quality: 100 
            };
            
            const publicId = `${title.replace(/\s+/g, '_')}`;
            const { url, public_id} = await uploadImage(imagePath, folder, options,publicId);
    
            const newProduct = {
                title,
                shortDes,
                price,
                discount_type,
                discount,
                total,
                brand_id,
                category_id,
                image:url,
                remark,
                publicId: public_id 
            };
            const product = await ProductModel.create(newProduct);
            return { success: true, product: product };
    }catch(error){
        return { success: false, error: error.message };
    }
}

// ======Product Review starts here===
const ReviewListService = async (req) => {

    try {

        let product_id=new ObjectId(req.params.product_id);
        let MatchStage={$match:{product_id:product_id}}

        let JoinWithProfileStage= {$lookup:{from:"profiles",localField:"user_id",foreignField:"user_id",as:"profile"}};
        let UnwindProfileStage={$unwind:"$profile"}
        let ProjectionStage= {$project: {'des': 1, 'rating': 1, 'profile.cus_name': 1}}

        let data= await  ProductReviewModel.aggregate([
            MatchStage,
            JoinWithProfileStage,
            UnwindProfileStage,
            ProjectionStage
        ])

        return {status:"success",data:data}
    }catch (e) {
        return {status:"fail",data:e}.toString()
    }

}


const CreateReviewService = async (req) => {
    try{
        let user_id=req.headers.user_id;
        console.log(user_id)
        let reqBody=req.body;
        let data=await ProductReviewModel.create({
            product_id:reqBody['product_id'],
            user_id:user_id,
            des:reqBody['des'],
            rating:reqBody['rating'],
         })
        return {status:"success",data:data}
    }
    catch (e) {
        return {status:"fail",data:e.toString()}
    }
}


module.exports={
    createProduct,
    readProduct,
    productDetail,
    productByCategory,
    productByBrand,
    filterProductByRemark,
    filterByProduct,
    ListBySmilierProduct,
    searchWithKeyword,
    ReviewListService,
    CreateReviewService
}