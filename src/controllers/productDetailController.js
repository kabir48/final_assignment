let ProductDetailModel=require("../models/ProductDetailModel.js");
let ProductModel=require("../models/ProductModel.js");
const {uploadImage,deleteImage}   = require('../helper/upload.js');

exports.createDetail = async (req, res) => {
    try {
      let { product_id, des, color, size, stock } = req.body;
  
      // Find the product by ID and update the stock
      const product = await ProductModel.findById(product_id);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      stock = Number(stock);
  
      const totalStock = product.stock ? stock + Number(product.stock) : stock;
      product.stock = totalStock;
      await product.save();
  
      const files = req.files;
      const folder = 'ecommerce/productDetails';
      const options = {
        width: 600,
        height: 600,
        quality: '100'
      };
  
      const imageUrls = {};
  
      if (files.img1) {
        const imagePath = files.img1[0].path;
        const { url } = await uploadImage(imagePath, folder, options, `img1_${product_id}`);
        imageUrls.img1 = url;
      }
  
      if (files.img2) {
        const imagePath = files.img2[0].path;
        const { url } = await uploadImage(imagePath, folder, options, `img2_${product_id}`);
        imageUrls.img2 = url;
      }
  
      if (files.img3) {
        const imagePath = files.img3[0].path;
        const { url } = await uploadImage(imagePath, folder, options, `img3_${product_id}`);
        imageUrls.img3 = url;
      }
  
      if (files.img4) {
        const imagePath = files.img4[0].path;
        const { url } = await uploadImage(imagePath, folder, options, `img4_${product_id}`);
        imageUrls.img4 = url;
      }
  
      const newProductDetail = new ProductDetailModel({
        product_id,
        des,
        color,
        size,
        stock,
        ...imageUrls
      });
  
      await newProductDetail.save();
  
      res.status(201).json({ success: true, productDetail: newProductDetail });
    } catch (error) {
      console.error('Error creating product detail:', error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  };

  //====update product===

  exports.updateDetail = async (req, res) => {
    try {
      const { id } = req.params;
      let { product_id, des, color, size, stock } = req.body;
  
      const productDetail = await ProductDetailModel.findById(id);
      if (!productDetail) {
        return res.status(404).json({ success: false, error: 'Product detail not found' });
      }
  
      const product = await ProductModel.findById(product_id);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      stock = Number(stock);
      if (stock) {
        const totalStock = product.stock ? Number(product.stock) + stock : stock;
        product.stock = totalStock;
        await product.save();
      }
  
      const files = req.files;
      const folder = 'ecommerce/productDetails';
      const options = {
        width: 600,
        height: 600,
        quality: '100'
      };
  
      if (files.img1) {
        const imagePath = files.img1[0].path;
        if (productDetail.img1) {
          await deleteImage(productDetail.img1); // delete old image
        }
        const { url } = await uploadImage(imagePath, folder, options, `img1_${product_id}`);
        productDetail.img1 = url;
      }
  
      if (files.img2) {
        const imagePath = files.img2[0].path;
        if (productDetail.img2) {
          await deleteImage(productDetail.img2); // delete old image
        }
        const { url } = await uploadImage(imagePath, folder, options, `img2_${product_id}`);
        productDetail.img2 = url;
      }
  
      if (files.img3) {
        const imagePath = files.img3[0].path;
        if (productDetail.img3) {
          await deleteImage(productDetail.img3); // delete old image
        }
        const { url } = await uploadImage(imagePath, folder, options, `img3_${product_id}`);
        productDetail.img3 = url;
      }
  
      if (files.img4) {
        const imagePath = files.img4[0].path;
        if (productDetail.img4) {
          await deleteImage(productDetail.img4); // delete old image
        }
        const { url } = await uploadImage(imagePath, folder, options, `img4_${product_id}`);
        productDetail.img4 = url;
      }
  
      productDetail.des = des || productDetail.des;
      productDetail.color = color || productDetail.color;
      productDetail.size = size || productDetail.size;
      productDetail.stock = stock || productDetail.stock;
  
      await productDetail.save();
  
      res.status(200).json({ success: true, productDetail });
    } catch (error) {
      console.error('Error updating product detail:', error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  };
