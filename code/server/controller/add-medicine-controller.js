const medicineCategory = require("../model/medicine-category");
const medicineType = require("../model/medicine-type");
const pharmacyModel = require("../model/pharmacy-model");

const getAllCategories = async(req,res)=>{
  try{
    const result=await medicineCategory.getAll();
    res.status(200).json(result);
  }
  catch(err){
    res.status(400).json(err);
  }
}

const getAllTypes = async(req,res)=>{
  try{
    const result=await medicineType.getAll();
    res.status(200).json(result);
  }
  catch(err){
    res.status(400).json(err);
  }
}

const addMedicine = async(req,res)=>{
  const _id=req.params.id;
  try{
    const result=await pharmacyModel.addMedicine(_id,req.body);
    res.status(200).json(result);
  }
  catch(err){
    console.log(err);
    res.status(400).json({error:err.message});
  }
}

module.exports ={
  getAllCategories,
  getAllTypes,
  addMedicine,
}