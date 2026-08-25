const mongoose = require('mongoose');
const { generateRandomString } = require('../helper');

const deliveryAddressSchema = new mongoose.Schema({
  address_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AddressType',
    required: [true, 'Address type is required']
  },
  checkout_address_type: {
    type: String,
    enum: ['billing', 'shipping'], // usage type in checkout
    default: 'shipping'
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  street_address: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true
  },
  // flat_house_office: {
  //   type: String,
  //   required: [true, 'Flat house office is required'],
  //   trim: true
  // },
  alternate_phone: {
    type: String,
    trim: true
  },
  postal_code: {
    type: String,
    required: [true, 'Postal code is required'],
    trim: true
  },
  status: {
    type: Number,
    enum: [1, 0],
    default: 1
  },
  guid: { type: String, default: () => generateRandomString(12) },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: String,
  updated_by: String
});

deliveryAddressSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('DeliveryAddress', deliveryAddressSchema);