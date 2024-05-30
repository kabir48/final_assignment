const ProductSliderService=require("../services/ProductSliderService.js");
// ====create services====//
exports.CreateSliderproduct=async(req,res)=>{
    try{
        const results=await ProductSliderService.createSlider(req);
        return res.status(200).json({success:true,results});
    }catch(error){
        res.status(500).json({success:false,error:error.message})
    }
}


//=====all data=====

exports.readSlider=async(req,res)=>{
    try{
        const results=await ProductSliderService.getSlider(req);
        return res.status(200).json(results);
    }catch(error){
        res.status(500).json({success:false,error:error.message})
    }
}