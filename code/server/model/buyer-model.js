const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const buyerSchema = new Schema({
  email:{
    type: String,
    required: true,
    unique: true
  }
},{timestamps:true});

module.exports=mongoose.model("Buyer",buyerSchema);


