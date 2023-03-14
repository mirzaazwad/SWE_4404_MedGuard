const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const medicineTypeDescription = new Schema({
  Name:{
    type: String,
    required: true,
  },
  Description:{
    type: String
  }
});

medicineTypeDescription.statics.getAll=async function(){
  const result=await this.find();
  if(result){
    return result;
  }
  else{
    throw Error('Database error cannot find categories');
  }
}

module.exports=mongoose.model("medicine-description",medicineTypeDescription);


