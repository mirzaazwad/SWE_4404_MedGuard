const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockSchema = new Schema({
  Pcs: {
    type: Number,
    validate: {
      validator: function(value) {
        return value >= 0;
      },
      message: 'Number of pieces must be greater than zero'
    }
  },
  Strips: {
    type: Number,
    validate: {
      validator: function(value) {
        return value >= 0;
      },
      message: 'Number of strips must be greater than zero'
    }
  },
  Boxes: {
    type: Number,
    validate: {
      validator: function(value) {
        return value >= 0;
      },
      message: 'Number of boxes must be greater than zero'
    }
  },
});

const medicineSchema = new Schema({
  MedicineName: {
    type: String,
    required: true,
    unique:true
  },
  GenericName: {
    type: String,
    required: true,
  },
  TypeID: {
    type: String,
    required: true,
  },
  CateogryID: {
    type: String,
    required: true,
  },
  Manufacturer: {
    type: String,
    required: true,
  },
  SellingPrice: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return value >= 0;
      },
      message: 'Selling Price must be greater than zero'
    }
  },
  PurchasePrice: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return value >= 0;
      },
      message: 'Purchase Price must be greater than zero'
    }
  },
  Description:{
    type:String
  },
  Stock: {
    stockSchema,
  },
});

const pharmacySchema = new Schema({
  pharmacy: {
    type: String,
  },
  pharmacyManagerID: {
    type: String,
    required: true,
  },
  Inventory: [medicineSchema],
});

pharmacySchema.statics.addMedicine = async function (_id, medicine) {
  try {
    const result = await this.findOne({ pharmacyManagerID: _id });
    const stockModel = mongoose.model('StockModel',stockSchema);
    result.Inventory.push({
      ...medicine,
      Stock:stockModel.create({
        Pcs:0,
        Strips:0,
        Boxes:0
      })
    });
    await result.save();
    return await this.findOne({ pharmacyManagerID: _id });
  } catch (err) {
    console.log(err);
    throw Error("error in database schema");
  }
};

module.exports = mongoose.model("pharmacy", pharmacySchema);
