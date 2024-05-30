const BrandService = require('../services/BrandService');
const multer = require('multer');
const {uploadImage,deleteImage}   = require('../helper/upload.js');
const upload = multer({ dest: 'uploads/' });
const Brand=require("../models/BrandModel")

// ====Create Brands===//
exports.CreateBrand = async (req, res) => {
  try {
    const { brandName } = req.body;
    const imagePath = req.file.path; 

   
    const folder = 'ecommerce/brands';
    const options = {
      width: 200,
      height: 200,
      quality: 100
    };

    const publicId = `${brandName.replace(/\s+/g, '_')}`;

    const { url,public_id } = await uploadImage(imagePath, folder, options, publicId);

    // Create a new brand document and save to MongoDB
    const newBrand = new Brand({
      brandName,
      brandImage: url,
      publicId:public_id
    });

    await newBrand.save();

    res.status(201).json({ success: true, brand: newBrand });
  } catch (error) {
    //console.error('Error creating brand:', error);
     res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ====Update Brands===//
exports.UpdateBrand = async (req, res) => {
  try {
    const { brandName } = req.body;
    let imagePath;

    if (req.file) {
      imagePath = req.file.path;
      //console.log('Image path:', imagePath); 
    }

    
    const folder = 'ecommerce/brands';
    const options = {
      width: 800,
      height: 800,
      quality: 100,
    };

    //====Find the current brand to get the existing image details====
    const currentBrand = await Brand.findById(req.params.id);
    if (!currentBrand) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }

    //=========Upload image to Cloudinary if a new image was uploaded=======//
    let imageUrl;
    let publicId;
    if (imagePath) {
      //=========Delete the old image from Cloudinary if it exists========//
      if (currentBrand.brandImage && currentBrand.publicId) {
        await deleteImage(currentBrand.publicId);
      }

      // ====Create a unique public ID using the brand name====//
      const newPublicId = `${brandName.replace(/\s+/g, '_')}`;

      // Upload the new image
      const result = await uploadImage(imagePath, folder, options, newPublicId);
      //console.log('Upload result:', result); 
      imageUrl = result.url;
      publicId = result.public_id;
    }

    // Update brand details in MongoDB
    const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, {
      brandName,
      ...(imageUrl && { brandImage: imageUrl, publicId }) // ===========Update brandImage and publicId only if imageUrl exists=========
    }, { new: true });

    res.status(200).json({ success: true, brand: updatedBrand });
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// =====all brands====//
exports.readBrand = async (req, res) => {
  try {
    const result = await BrandService.getAllBrands(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}


// =====Delete Brand Items====//
exports.DeleteBrand = async (req, res) => {
  const brandId = req.params.id;
  try {
    const result = await BrandService.deleteBrand(req, brandId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};