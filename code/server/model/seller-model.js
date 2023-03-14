const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const sellerSchema = new Schema({
  email:{
    type: String,
    required: true,
    unique: true
  },
  pharmacyID:{
    type:mongoose.Schema.ObjectId,
    unique:true
  },
  pharmacy:{
    type: String
  }
},{timestamps:true});

module.exports=mongoose.model("Seller",sellerSchema);


