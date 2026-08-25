const mongoose = require("mongoose");
const { generateRandomString } = require('../helper');

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true
  },
  product_sku: {
    type: String,
    required: [true, "Product SKU is required"],
    unique: true,
    trim: true,
  },
  product_slug: {
    type: String,
    trim: true
  },
  product_title: {
    type: String,
    required: [true, "Product title is required"],
    trim: true
  },
  product_description: {
    type: String,
    // required: [true, "Product description is required"],
    trim: true
  },
  product_short_description: {
    type: String,
    required: [true, "Product short description is required"],
    trim: true
  },
  product_img: {
    type: String,
    trim: true,
    default: null
  },
  actual_price: {
    type: Number,
    // required: [true, "Product actual price is required"],
    min: [0, "Product actual price cannot be negative"],
    default: null
  },
  offer_price: {
    type: Number,
    // required: [true, "Product offer price is required"],
    min: [0, "Product offer price cannot be negative"],
    default: null
  },
  is_stock: {
    type: String,
    enum: ["1", "0"],
    default: null
  },
  is_upload: {
      type: Number,
      default: 0
  },
  stock_quantity: {
    type: Number,
    default: 0,
    min: [0, "Stock quantity cannot be negative"]
  },
  shipping_class_id: {
    type: Number,
    default: 1
  },
  // age_group: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   // required: [true, "Age group is required"],
  //   ref: "tbl_age",
  //   default: null
  // },
  material_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_materials",
    default: null
  },
  
  material_name: {
    type: String,
    ref: "tbl_materials",
    default: null
  },
  skill_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_skills",
    default: null
  },
  brand_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_brands",
    default: null
  },
  brand_name: {
    type: String,
    default: null
  },
  skill_name: {
    type: String,
    ref: "tbl_skills",
    default: null
  },
  remote_included: {
    type: String,
    enum: ["1", "0"]
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color",
    default: null
  },
  gender: {
    type: String,
    default: null
  },
  commodity_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_commodity",
    default: null
  },
  
  commodity_name: {
    type: String,
    ref: "tbl_commodity",
    default: null
  },
  package_content: {
    type: String,
    trim: true,
    default: null
  },
  product_dimensions: {
    type: String,
    trim: true,
    default: null
  },
  product_weight: {
    type: String,
    trim: true,
    default: null
  },
  pacakge_dimensions: {
    type: String,
    trim: true,
    default: null
  },
  net_quantity: {
    type: String,
    trim: true,
    default: null
  },
  country_of_origin: {
    type: String,
    trim: true,
    default: null
  },
  manufacturer_name: {
    type: String,
    trim: true,
    default: null
  },
  manufacturer_address: {
    type: String,
    trim: true,
    default: null
  },
  marketer_name: {
    type: String,
    trim: true,
    default: null
  },
  marketer_address: {
    type: String,
    trim: true,
    default: null
  },
  // sale_start_date: {
  //   type: Date,
  //   default: null
  // },
  // sale_end_date: {
  //   type: Date,
  //   default: null
  // },
  seo_title: {
    type: String,
    trim: true,
    default: null
  },
  seo_keyword: {
    type: String,
    trim: true,
    default: null
  },
  seo_url: {
    type: String,
    trim: true,
    default: null
  },
  seo_canonical: {
    type: String,
    trim: true,
    default: null
  },
  status: {
    type: Number,
    enum: [1, 0],
    default: 1
  },
  // tax_status_id:{
  //   type: Number,
  //   enum: [1, 0],
  //   default: null
  // },
  is_bestseller: {
    type: Number,
    enum: [1, 0],
    default: null
  },
  is_trending: {
    type: Number,
    enum: [1, 0],
    default: null
  },
  view_count: {
    type: Number,
    default: 0
  },
  // product_tax: {
  //   type: Number,
  //   default: null
  // },
  guid: { type: String, default: () => generateRandomString(20) },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
});

productSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("tbl_product", productSchema);