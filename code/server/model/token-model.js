const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const tokenSchema = new Schema({
  email:{
    type: String
  },
  OTP:{
    type: String
  }
},{timestamps:true});

tokenSchema.statics.addRecord = async function(email,OTP){
  if(!email || !OTP){
    throw Error('An error occurred in email or OTP generation');
  }
  const result = await this.create({email,OTP});
  return result;
}

tokenSchema.statics.verifyOTP=async function(email,OTP){
  if(!email || !OTP){
    throw Error('An error occurred in email or OTP transmission');
  }
  const result = await this.findOne({email,OTP});
  if(!result){
    throw Error('OTP is invalid');
  }
  else{
    console.log(result);
    await this.deleteMany({email,OTP});
    return result;
  }
}

module.exports=mongoose.model("Token",tokenSchema);


