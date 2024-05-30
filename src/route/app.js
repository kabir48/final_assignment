const express = require("express");
const router = express.Router();
//const upload = require('../middleware/upload.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const uploadMany = multer({ dest: 'uploads/' });
const multiUpload = uploadMany.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 },
    { name: 'img4', maxCount: 1 }
  ]);

//====All Controllers======//
const UserController=require('../controllers/UserController.js');
const BrandController = require('../controllers/BrandController.js');
const CategoryController = require('../controllers/CategoryController.js');
const ProductController = require('../controllers/ProductController.js');
const ProductSliderController=require('../controllers/ProductSliderController.js');
const FeatureController=require("../controllers/FeatureController.js");
const PaymentSettingController=require("../controllers/PaymentSettingController.js")
const ProductDetailController = require('../controllers/productDetailController.js');
const WishListController=require("../controllers/WishListController.js");
const CartController=require("../controllers/CartController.js");
const InvoiceController = require("../controllers/InvoiceController");
//=====middlware part=====//
const AuthMiddleware=require('../middleware/AuthMiddleware.js');


//=====Api Calling Routes====//

// ======user info=====//
router.get('/user-otp-create/:email',UserController.UserCreateOtp);
// router.post('/user-create',upload,UserController.createUser);
router.get('/otp-verification/:email/:otp',UserController.VerifyOtp);
router.post('/user/create',AuthMiddleware,UserController.profileCreate);
router.post('/user/update',AuthMiddleware,UserController.profileUpdate);
// router.delete('/delete-user/:id',UserController.deleteUser);
router.get('/user/logout',AuthMiddleware,UserController.logoutFunction);
router.get('/user/read-profile',AuthMiddleware,UserController.ReadProfile)
//======Brands part starts from here====//

// ====wishlist routes=====//
const wishList=express.Router();
wishList.post('/create',AuthMiddleware,WishListController.createWishList);
wishList.get('/lists',AuthMiddleware,WishListController.readWishList);
wishList.post('/list/remove',AuthMiddleware,WishListController.deleteWish);

    // ====Carts routes=====//createCart
const cartList=express.Router();
    cartList.post('/create',CartController.createCart);
    cartList.get('/lists',CartController.getCartItems);
    cartList.delete('/list/remove/:id',CartController.deleteCart);

const brandRouter = express.Router();
    brandRouter.get('/lists', BrandController.readBrand);
    brandRouter.post('/create',upload.single('brandImage'), BrandController.CreateBrand);
    brandRouter.delete('/delete/:id', BrandController.DeleteBrand);
    brandRouter.put('/update/:id',upload.single('brandImage'), BrandController.UpdateBrand);

// =====Category Parts=====//
const categoryRouter = express.Router();
    categoryRouter.get('/lists', CategoryController.ReadCategory);
    categoryRouter.post('/create', upload.single('categoryImg'),CategoryController.CreateCategory);
    categoryRouter.post('/update/:id', upload.single('categoryImg'),CategoryController.UpdateCategory);

//====Product parts===//
const productRouter = express.Router();
    productRouter.post('/create',upload.single('image'),ProductController.Createproduct);
    productRouter.get('/lists',ProductController.ReadProduct);
    productRouter.get('/detail/:id',ProductController.singleProduct);
    productRouter.get('/category/:category_id',ProductController.categoryProduct);
    productRouter.get('/category/:category_id',ProductController.keywordFilterProduct);
    productRouter.get('/brand/:brand_id',ProductController.brandProduct);
    productRouter.get('/remark/:remark',ProductController.remarkProduct);
    productRouter.get('/filter',ProductController.FilterByProduct);
    productRouter.get('/search/:Keyword',ProductController.searchReasult);
    productRouter.get('/review/:product_id',AuthMiddleware,ProductController.getReviewList);
    productRouter.post('/review-create',AuthMiddleware,ProductController.reviewCreate);

//===Product Slider Parts===//
const productSliderRouter = express.Router();
    productSliderRouter.post('/create',upload.single('image'),ProductSliderController.CreateSliderproduct);
    productSliderRouter.get('/ProductSliderLists',ProductSliderController.readSlider);

//===Product Slider Parts===//createSetting
const featureRouter = express.Router();
    featureRouter.post('/create',upload.single('image'),FeatureController.CreateFeature);


//===Payment Setting Parts===//
const paymentSettingRouter = express.Router();
    paymentSettingRouter.post('/create',PaymentSettingController.createPaymentSetting);

const productDetailRouter = express.Router();
    productDetailRouter.post('/create', multiUpload, ProductDetailController.createDetail);
    productDetailRouter.put('/update/:id', multiUpload, ProductDetailController.updateDetail);
// //====Product Api For the Front end  View===//
// router.get('/products',ProductController.readProductAsFrontEnd);


// Invoice & Payment

const invoiceRouter = express.Router();
invoiceRouter.get('/CreateInvoice',AuthMiddleware,InvoiceController.CreateInvoice)
invoiceRouter.get('/InvoiceList',AuthMiddleware,InvoiceController.InvoiceList)
invoiceRouter.get('/InvoiceProductList/:invoice_id',AuthMiddleware,InvoiceController.InvoiceProductList)


router.post('/PaymentSuccess/:trxID',InvoiceController.PaymentSuccess)
router.post('/PaymentCancel/:trxID',InvoiceController.PaymentCancel)
router.post('/PaymentFail/:trxID',InvoiceController.PaymentFail)
router.post('/PaymentIPN/:trxID',InvoiceController.PaymentIPN)




router.use('/brand', brandRouter);
router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/slider', productSliderRouter);
router.use('/feature', featureRouter);
router.use('/paymentSetting', paymentSettingRouter);
router.use('/detail', productDetailRouter);
router.use('/wish', wishList);
router.use('/cart', cartList);
router.use('/invoice', invoiceRouter);
module.exports = router;