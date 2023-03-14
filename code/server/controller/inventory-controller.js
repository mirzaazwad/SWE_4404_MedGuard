const pharmacyModel = require("../model/pharmacy-model");
const stockModel = require("../model/stock-model");
const medicineType = require("../model/medicine-type");
const getMedicine=async (req,res)=>{
  const id=req.params.id;
  try{
    const result=await pharmacyModel.findOne({pharmacyManagerID:id}).select('Inventory');
    res.status(200).json(result);
  }
  catch(err){
    res.status(200).json({error:err.message});
  }
}

const getType = async(req,res)=>{
  const id=req.params.id;
  try{
    const result=await medicineType.findById(id);
    res.status(200).json({result});
  }
  catch(err){
    res.status(400).json({error:err.message});
  }
}

const getTypes = async(req,res)=>{
  try{
    const result=await medicineType.find();
    res.status(200).json({result});
  }
  catch(err){
    res.status(400).json({error:err.message});
  }
}

const getStocks = async(req,res) =>{
  try{
    const stock=stockModel.find();
    res.status(200).json({stock});
  }
  catch(err){
    console.log(err);
    res.status(400).json({error:err.message});
  }
}

const addToStock = async(req,res)=>{
  const id=req.params.id;
  try{
    const result=stockModel.findByIdAndUpdate()
  }
  catch(err){
    res.status(400).json({error:err.message});
  }
}

module.exports={
  getMedicine,
  getType,
  getTypes,
  getStocks,
  addToStock
}