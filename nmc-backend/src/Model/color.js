const mongoose = require("mongoose");
const { generateRandomString } = require("../helper");

const colorSchema = new mongoose.Schema({
  color_name: {
    type: String,
    required: [true, "Color name is required"],
    unique: true,
    validate: {
      validator: function (v) {
        return /^[A-Za-z\s]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid color name`,
    },
    trim: true,
  },
  color_code: {
    type: String,
    required: [true, "Color code is required"],
    // unique: true,
    validate: {
      validator: function (v) {
        return /^#([0-9A-Fa-f]{3}){1,2}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid hex color code`,
    },
    trim: true,
  },
   status: {
      type: Number,
      enum: [1, 0],
      default: 1
    },
  guid: { type: String, default: () => generateRandomString(12) },
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

colorSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Color", colorSchema);