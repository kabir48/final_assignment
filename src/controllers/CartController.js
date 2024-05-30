const ProductModel = require('../models/ProductModel.js');
const ProductDetailModel = require('../models/ProductDetailModel.js');
const CartModal = require('../models/CartModal.js');
const { manageSession } = require('../helper/sessionHelper.js');
const loggedInUser =require('../middleware/Auth.js');
const mongoose =require('mongoose');
const ObjectId=mongoose.Types.ObjectId;
exports.createCart = async (req, res) => {
    try {
        const data = req.body;

        // Check if the product is disabled
        const getProduct = await ProductModel.findOne({ _id: data.product_id });
        if (!getProduct || getProduct.status !== "active") {
            return res.status(400).json({ status: "fail", message: "Required product is Disabled. Please Choose Another one" });
        }

        // Check if the required quantity is disabled
        const getProductStock = await ProductDetailModel.findOne({ product_id: data.product_id, size: data.size });
        if (!getProductStock || getProductStock.status === "active") {
            return res.status(400).json({ status: "fail", message: "Required product is Disabled. Please Choose Another one" });
        }
        
        if (getProductStock.stock < data.qty) {
            return res.status(400).json({ status: "fail", message: "Required Stock is not available" });
        }

        // Generate session ID if not exists
        const session_id = manageSession(req);
        //console.log(session_id)

        let user_id = req.headers.user_id;

       // console.log(loggedInUser)

        // Check if the product already exists in the cart
        let countProducts;
        if (user_id) {
            countProducts = await CartModal.countDocuments({ product_id: data.product_id, color: data.color ,size: data.size, user_id: user_id });
        } else {
            countProducts = await CartModal.countDocuments({ product_id: data.product_id, color: data.color,size: data.size, session_id: session_id });
        }

        if (countProducts > 0) {
           return res.status(400).json({ status: "fail", message: "Product Already Exists in the cart!" });
        }

        // Insert the product into the cart
        const cart = new CartModal({
            session_id: session_id,
            user_id: user_id ? user_id : null,
            product_id: data.product_id,
            size: data.size,
            qty: data.qty,
            color: data.color,
        });

        const cartadd = await cart.save();
        return res.status(200).json({ status: "success", data: cartadd });
    } catch (e) {
        console.error(e); // Log the error for debugging purposes
        return res.status(500).json({ status: "fail", message: "Something went wrong on the server." });
    }
}


exports.deleteCart = async (req,res) => {
    try {
        const Id = req.params.id;
        const user_id=req.headers.user_id;
        console.log(user_id)
        await CartModal.deleteOne({_id:Id});
        return res.status(200).json({ status: "success", message: "Cart item removed successfully" });
    } catch (error) {
        console.error("Error in delete cart:", error); // Debugging log
        return res.status(500).json({ status: "fail", message: "Something went wrong!" });
    }
};

exports.getCartItems = async (req, res) => {
    try {
        
        // Call the loggedInUser middleware to extract user information
        loggedInUser(req, res, async () => {
            let CartItems;
            let JoinStageProduct={$lookup:{from:"products",localField:"product_id",foreignField:"_id",as:"product"}}
            let unwindProductStage={$unwind:"$product"};
            let projectionStage={$project:{
                    'createdAt':0,'updatedAt':0, 'product._id':0,
                    'product.category_id':0,'product.brand_id':0,'product.shortDes':0,
                    'product.star':0,'product.stock':0,'product.remark':0,'product.publicId':0,
                }
            }
            if (req.loggedInUser) {
                //console.log(req.loggedInUser)
                // If user is logged in, fetch cart items based on user_id
                let user_id=new ObjectId(req.loggedInUser.id);
                console.log(user_id)
                let matchStage={$match:{user_id:user_id}}

                CartItems = await CartModal.aggregate([
                    matchStage,
                    JoinStageProduct,
                    unwindProductStage,
                    projectionStage

                ])
            } else {
                console.log("session")
                const session_id = manageSession(req);
                let matchStage={$match:{session_id:session_id}}
                // If user is not logged in, fetch cart items based on session_id
                CartItems = await CartModal.aggregate([
                    matchStage,
                    JoinStageProduct,
                    unwindProductStage,
                    projectionStage
                ]);
            }
            // Send the response with the fetched cart items
            res.status(200).json({ status: 'success', cart: CartItems });
        });
    } catch (error) {
        // Handle any errors and send error response
        res.status(500).json({ status: 'error', message: error.message });
    }
};

