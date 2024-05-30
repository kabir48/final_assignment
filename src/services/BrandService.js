// services/BrandService.js
const {uploadImage,deleteImage}   = require('../helper/upload.js');
const Brand = require('../models/BrandModel.js');

const getAllBrands = async (req) => {
  try {
    let brand = await Brand.aggregate([
      {
        $sort: { _id: -1 }
      }
      ,{
        $project:{
          createdAt:0,updatedAt:0
        }
      }
    ]);
    return { success: "success", data: brand };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

const deleteBrand = async (req) => {
  try {
    const brandId = req.params.id;

    // Retrieve the brand details
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }

    // Log the brand details to check if publicId exists
    //console.log('Brand details:', brand);
    //let publicId;
    // Delete the image from Cloudinary if it exists
    if (brand.publicId) {
      console.log(`Deleting image with publicId: ${brand.publicId}`);
      await deleteImage(brand.publicId);
    } else {
      console.log('No publicId found for this brand');
    }

    // Delete the brand from MongoDB
    await Brand.deleteOne({ _id: brandId });

    return{ success: true, message: 'Brand and image deleted successfully' };
  } catch (error) {
    console.error('Error deleting brand:', error);
    return{ success: false, error: 'Server error' };
  }
};

module.exports = {
  getAllBrands,
  deleteBrand
};
