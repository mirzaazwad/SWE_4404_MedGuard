const userModel = require("../model/user-model");
const tokenModel = require("../model/token-model");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { findOneAndUpdate } = require("../model/buyer-model");
const bcrypt = require("bcryptjs");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "2d" });
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_PASSWORD,
  },
});

const generateMailAndOTP = async (email) => {
  let OTP = Math.floor(100000 + Math.random() * 900000).toString();
  await tokenModel.addRecord(email, OTP);
  const mailOptions = {
    from: 'mirzaazwad23931@gmail.com',
    to: email,
    subject: "Your OTP for verification",
    text: `Your OTP is ${OTP}`,
  };
  return mailOptions;
};

const sendVerificationMail = async(email) => {
  const mailOptions = await generateMailAndOTP(email);
  transporter.sendMail(mailOptions, function (error, info) {
    console.log(info);
    if (error) {
      throw Error('SMTP Client Error');
    }
  });
};

const signUpUser = async (req, res) => {
  const { userType, username, email, password,verified } = req.body;
  try {
    const user = await userModel.signUp(userType, username, email, password,verified);
    const _id = user.user._id;
    const token = createToken(_id);
    if ("buyer" in user) {
      res.status(200).json({ _id, userType: "buyer",token:token });
    } else {
      res.status(200).json({ _id, userType: "seller",token:token });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.login(email, password);
    const _id = user.user._id;
    const token = createToken(_id);
    if ("buyer" in user) {
      res.status(200).json({ _id, userType: "buyer", token ,verified:user.user.verified});
    } else {
      res.status(200).json({ _id, userType: "seller", token ,verified:user.user.verified});
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const forgot = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await userModel.getEmail(email);
    const result= await sendVerificationMail(user.email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const verifyEmail = async(req,res) =>{
  const {email}=req.params;
  try{
    const result =await sendVerificationMail(email);
    const token=createToken(email);
    res.status(200).json({result,success:true,token:token});
  }
  catch(error){
    res.status(400).json({error:error.message});
  }

}

const verifyOTP = async(req,res) =>{
  const {email,OTP}=req.body;
  try{
    const result=await tokenModel.verifyOTP(email,OTP);
    res.status(200).json({success:true});
  }
  catch(error){
    res.status(400).json({error:error.message});
  }
}

const verifySignUpInformation = async(req,res) =>{
  const {email} = req.params;
  try{
    console.log(email);
    const result=await userModel.findOneAndUpdate({email},{
      ...req.body
    })
    return res.status(200).json({result});
  }
  catch(error){
    return res.status(400).json({error:error.message});
  }
}

const deleteOTP = async(req,res) =>{
  const {email}=req.params;
  try{
    const result=await tokenModel.findOneAndDelete({email},{ "sort": { "_id": -1 } });
    res.status(200).json({success:true});
  }
  catch(err){
    res.status(400).json({success:false,error:err.message});
  }
}

const updatePassword = async(req,res)=>{
  const {email}=req.params;
  try{
    const password=req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result=await userModel.findOneAndUpdate({email},{
      password:hashedPassword
    }).catch((err)=>{
      console.log(err);
      throw Error('Password could not be updated')
    })
    res.status(200).json({result,success:true});
  }
  catch(err){
    res.status(400).json({error:err.message,success:false});
  }
}

const signUpGoogle = async (req,res) =>{
  const { userType, username,email,googleId,imageURL,verified } = req.body;
  try {
    const user = await userModel.signUpGoogle(userType,username,email,googleId,imageURL,verified);
    const _id = user.user._id;
    const token = createToken(_id);
    if ("buyer" in user) {
      res.status(200).json({ _id, userType: "buyer",token:token });
    } else {
      res.status(200).json({ _id, userType: "seller",token:token });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const loginGoogle = async(req,res) =>{
  const { email,googleId } = req.body;
  try {
    const user = await userModel.loginGoogle(email,googleId);
    const _id = user.user._id;
    const token = createToken(_id);
    if ("buyer" in user) {
      res.status(200).json({ _id, userType: "buyer",token:token });
    } else {
      res.status(200).json({ _id, userType: "seller",token:token });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  signUpUser,
  loginUser,
  forgot,
  verifyEmail,
  verifyOTP,
  verifySignUpInformation,
  deleteOTP,
  updatePassword,
  signUpGoogle,
  loginGoogle
};
