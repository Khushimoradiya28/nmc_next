const mongoose = require('mongoose');
const { generateRandomString } = require('../helper');

const productCartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_product",
    required: [true, "product_id is required"],
  },
  quantity: {
    type: Number,
    required: [true, 'quantity is required'], 
    min: [1, 'Quantity can not be less than 1'],
  },
  visitor_tag: {
    type: String,
    default: null,
  },
  status: {
    type: Number,
    enum: [1, 0],
    default: 1
  },
  guid: {
    type: String,
    default: () => generateRandomString(20)
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

productCartSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('ProductCart', productCartSchema);