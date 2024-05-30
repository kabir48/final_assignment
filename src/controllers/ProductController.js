let ProductService=require("../services/ProductService.js");

exports.Createproduct=async(req,res)=>{
    try{
        let results =await ProductService.createProduct(req);
        return res.status(200).json(results);
    }catch(error){
        return res.status(500).json({ success: false, error: error.message });
    }
}

// ====all products===//

exports.ReadProduct=async(req,res)=>{
    try{
        let results=await ProductService.readProduct(req);
        return res.status(200).json(results);
    }catch(error){
        return res.status(500).json({ success: false, error: error.message });
    }
}

// ===single product===
exports.singleProduct=async(req,res)=>{
    try{
        let results=await ProductService.productDetail(req);
        return res.status(200).json(results);
    }catch(error){
        return res.status(500).json({ success: false, error: error.message });
    }
}
// === product by category===
exports.categoryProduct=async(req,res)=>{
    try{
        let results=await ProductService.productByCategory(req);
        return res.status(200).json(results);
    }catch(error){
        return res.status(500).json({ success: false, error: error.message });
    }
}
// === product by brand===
exports.brandProduct=async(req,res)=>{
    try{
        let results=await ProductService.productByBrand(req);
        return res.status(200).json(results);
    }catch(error){
        return res.status(500).json({ success: false, error: error.message });
    }
}
// === filter product by remark===
exports.remarkProduct=async(req,res)=>{
    try{
        let results=await ProductService.filterProductByRemark(req);
        return res.status(200).json(results);
    }catch(error){
        return res.status(500).json({ success: false, error: error.message });
    }
}
// === filter product by remark===
exports.FilterByProduct=async(req,res)=>{
    try{
        let results=await ProductService.filterByProduct(req);
        return res.status(200).json(results);
    }catch(error){
        return res.status(500).json({ success: false, error: error.message });
    }
}
// ===  product by simillar items===
exports.keywordFilterProduct=async(req,res)=>{
    try{
        let results=await ProductService.ListBySmilierProduct(req);
        return res.status(200).json(results);
    }catch(error){
        return res.status(500).json({ success: false, error: error.message });
    }
}
// ===  product by simillar items===
exports.searchReasult=async(req,res)=>{
    try{
        let results=await ProductService.searchWithKeyword(req);
        return res.status(200).json(results);
    }catch(error){
        return res.status(500).json({ success: false, error: error.message });
    }
}

exports.getReviewList=async(req,res)=>{
    try{
        let results=await ProductService.ReviewListService(req);
        return res.status(200).json(results);
    }catch(error){
        return res.status(500).json({ success: false, error: error.message });
    }
}

exports.reviewCreate=async(req,res)=>{
    try{
        let results=await ProductService.CreateReviewService(req);
        return res.status(200).json(results);
    }catch(error){
        return res.status(500).json({ success: false, error: error.message });
    }
}