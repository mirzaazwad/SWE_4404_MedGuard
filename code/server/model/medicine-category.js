const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const medicineCateogry = new Schema({
  category:{
    type: String,
    required: true,
  },
  description:{
    type: String
  }
});

medicineCateogry.statics.getAll=async function(){
  const result=await this.find();
  if(result){
    return result;
  }
  else{
    throw Error('Database error cannot find categories');
  }
}

module.exports=mongoose.model("medicine-category",medicineCateogry);


