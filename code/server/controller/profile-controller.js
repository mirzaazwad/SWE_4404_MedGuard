const buyerModel = require("../model/buyer-model");
const userModel = require("../model/user-model");
const sellerModel = require("../model/seller-model");
const pharmacyModel = require("../model/pharmacy-model");
const bcrypt = require("bcryptjs");

const getUserByID = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await userModel.findById(id);
    if (!users) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const verifyPassword = async (req, res) => {
  const { _id, password } = req.body;
  try {
    const result = await userModel.verifyPassword(_id, password);
    res.status(200).json({ result, success: true });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

const patchUserByID = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await userModel.findById(id);
    if (!users) {
      return res.status(404).json({ error: "User not found" });
    }
    await userModel
      .findOneAndUpdate(
        { _id: id },
        {
          ...req.body,
        }
      )
      .then(async (result) => {
        const getResult = await userModel.findById(id);
        res.status(200).json(getResult);
      })
      .catch((err) => {
        res.status(404).json({ error: err });
      });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const getBuyerByEmail = async (req, res) => {
  const email = req.params;
  try {
    const user = await buyerModel.findOne({ email: email.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const getSellerByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await sellerModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const patchBuyerByEmail = async (req, res) => {
  const email = req.params;
  try {
    const users = await buyerModel.findOne({ email: email.email });
    if (!users) {
      return res.status(404).json({ error: "User not found" });
    }
    await buyerModel
      .findOneAndUpdate(
        { email: email.email },
        {
          ...req.body,
        }
      )
      .then(async (result) => {
        const getResult = await buyerModel.findOne({ email: email.email });
        res.status(200).json(getResult);
      })
      .catch((err) => {
        res.status(404).json({ error: err });
      });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const patchSellerByEmail = async (req, res) => {
  const email = req.params;
  try {
    const users = await sellerModel.findOne({ email: email.email });
    if (!users) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(users._id.toString());
    console.log(req.body.pharmacy);
    if (req.body.pharmacy !== null) {
        const pharmacy = await pharmacyModel.findOne({
          pharmacyManagerID: users._id.toString(),
        });
        if (pharmacy) {
          const result = await pharmacyModel.findOneAndUpdate(
            { pharmacyManagerID: users._id.toString() },
            {
              pharmacy: req.body.pharmacy,
            }
          );          
        } else {
          const result = await pharmacyModel.create({
            pharmacyManagerID: users._id.toString(),
            pharmacy: req.body.pharmacy,
          });
        }
    }
    await sellerModel
      .findOneAndUpdate(
        { email: email.email },
        {
          ...req.body,
        }
      )
      .then(async (result) => {
        const getResult = await sellerModel.findOne({ email: email.email });
        res.status(200).json(getResult);
      })
      .catch((err) => {
        res.status(404).json({ error: err });
      });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const changePassword = async (req, res) => {
  const _id = req.params;
  const { currentPassword, password } = req.body;
  try {
    const result = await userModel.verifyPassword(_id.id, currentPassword);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const users = await userModel.findByIdAndUpdate(_id.id, {
      password: hashedPassword,
    });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getSellerID = async(req,res)=>{
  const _id=req.params.id;
  try{
    const email=(await userModel.findById(_id)).email;
    const seller=(await sellerModel.findOne({email:email}))._id;
    res.status(200).json({_id:seller});
  }
  catch(err){
    res.status(400).json({ success: false,error: err.message });
  }
}

module.exports = {
  getUserByID,
  patchUserByID,
  getBuyerByEmail,
  getSellerByEmail,
  patchBuyerByEmail,
  patchSellerByEmail,
  changePassword,
  verifyPassword,
  getSellerID
};
