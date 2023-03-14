const buyerModel = require("../../../model/buyer/buyerModel");
const sellerModel = require("../../../model/seller/sellerModel");

const createUserOrUpdate = (obj,userType) =>{
  if(userType==='buyer'){
    createUserOrUpdateProxy(obj,buyerModel);
  }
  else{
    createUserOrUpdateProxy(obj,sellerModel);
  }
}

const createUserOrUpdateProxy = async (obj,userModel) => {
  const id=obj._json.id;
  const username=obj._json.name;
  const email=obj._json.email;
  const searchUser = await userModel.find({ email: email,googleId:id });
  if (searchUser.length != 0) {
    return searchUser;
  }
  try {
    const user = await userModel.create({googleID:id,username:username, email:email});
    console.log(user);
    try {
      await user.save();
    } catch (err) {
      console.log(err);
      return null;
    }
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports={
  createUserOrUpdate
}