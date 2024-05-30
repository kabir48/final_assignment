let CategoryService=require("../services/CategoryService.js");

exports.CreateCategory = async (req, res) => {
    try {
      //console.log('Request received:', req);
      const result = await CategoryService.createCategory(req);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
};
exports.ReadCategory=async(req,res)=>{
    try {
        const result = await CategoryService.getAllCategories(req);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

exports.UpdateCategory = async (req, res) => {
    const catId = req.params.id;
    try {
      const result = await CategoryService.updateCategory(req, catId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };
  
  