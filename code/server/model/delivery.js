const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const userSchema=require('./user');
const bcrypt = require("bcryptjs");

const deliverySchema = new Schema({
  ...userSchema.obj,
},{timestamps:true});

deliverySchema.statics.signup=async function(username,email,password){
  if(!email || !password){
    throw Error("All fields are required");
  }
  const exists=await this.findOne({email});
  if(exists){
    throw Error('Email already in use');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return await this.create({username:username,email:email,password:hashedPassword});
}

deliverySchema.statics.verifyPassword = async function(_id,password){
  if(!_id || !password){
    throw Error('A database error occurred');
  }
  const result = await this.findById(_id);
  const match = await bcrypt.compare(password,result.password);
  if(!match){
    throw Error('Password does not match');
  }
  else{
    return {success: true};
  }
}

deliverySchema.statics.updatePassword=async function(email,password){
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const result=await this.findOneAndUpdate({email},{
    password:hashedPassword
  }).catch((err)=>{
    console.log(err);
    throw Error('Password could not be updated')
  })
  return result;
}

deliverySchema.statics.login = async function(email,password){
  if(!email || !password){
    throw Error("All fields are required");
  }
  const delivery=await this.findOne({email});
  if(!delivery){
    throw Error('Account does not exist');
  }
  const match = await bcrypt.compare(password,delivery.password);
  if(!match){
    throw Error('Incorrect Password');
  }
  if(delivery.verified===false){
    throw Error('Seller is not verified');
  }
  return delivery._doc;
}

deliverySchema.statics.signUpGoogle = async function(username,email,googleId,imageURL,verified){
  if(!email || !googleId){
    throw Error("Data is incomplete");
  }
  const exists=await this.findOne({email});
  if(exists){
    return exists;
  }
  const delivery=await this.create({username:username,email:email,googleId:googleId,imageURL:imageURL,verified:verified});
  return delivery;
}

deliverySchema.statics.loginGoogle = async function(email,googleId){
  if(!email || !googleId){
    throw Error("Data is incomplete");
  }
  const exists=await this.findOne({email});
  if(exists){
    return exists;
  }
  else{
    throw Error("Delivery man Is Not Registered");
  }
}

module.exports=mongoose.model("delivery-man",deliverySchema);

