const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { generateRandomString } = require('../helper');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    default: null,
    // required: [true, "First name is required"],
    trim: true
  },
  last_name: {
    type: String,
    default: null,
    // required: [true, "Last name is required"],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true,
    default: null
  },
  mobile: {
    type: String,
    // required: [true, "Mobile number is required"],
    default: null,
    sparse: true,
    unique: true,
    trim: true,
    minlength: [10, "Mobile number must be at least 10 digits long"],
    maxlength: [10, "Mobile number must not exceed 10 digits"],
    validate: {
      validator: (v) => /^\d+$/.test(v),
      message: "Mobile number must contain digits only",
    },
  },
  password: {
    type: String,
    // required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    validate: {
      validator: function (v) {
        if (!v) return true; // allow null password
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(v);
      },
      message:
        "Password must contain uppercase, lowercase, number, and special character"
    },
    select: false
  },
  profile_img: {
    type: String,
    trim: true,
    default: null
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    default: null
  },
  birthday: {
    type: Date,
    default: null
  },
  otpHash: {
    type: String,
    select: false,
    default: null,
  },
  otpExpires: {
    type: Date,
    default: null,
  },
  otpAttempts: {
    type: Number,
    default: 0,
  },
  otpBlockExpires: {
    type: Date,
    default: null,
  },
  otpVerifyAttempts: {
    type: Number,
    default: 0,
  },
  is_keep_update: { type: String, default: "0" },
  status: { type: String, default: "1" },

  utm_source: { type: String, default: null },
  utm_medium: { type: String, default: null },
  utm_campaign: { type: String, default: null },
  utm_content: { type: String, default: null },
  utm_term: { type: String, default: null },

  ireferrer: { type: String, default: null },
  lreferrer: { type: String, default: null },
  ilandpage: { type: String, default: null },
  visits: { type: Number, default: 0 },

  ip_address: { type: String, default: null },
  browser_name: { type: String, default: null },
  browser_version: { type: String, default: null },
  browser_platform: { type: String, default: null },

  guid: { type: String, default: () => generateRandomString(12) },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: String,
  updated_by: String,
  last_logout: { type: Date, default: null } 
});

userSchema.pre("save", async function (next) {
  this.updated_at = Date.now();

  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", userSchema);