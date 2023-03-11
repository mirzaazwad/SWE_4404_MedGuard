const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const sellerSchema = new Schema({
  email:{
    type: String,
    required: true,
    unique: true
  },
  pharmacy:{
    type: String,
    unique:true
  }
},{timestamps:true});

module.exports=mongoose.model("Seller",sellerSchema);

