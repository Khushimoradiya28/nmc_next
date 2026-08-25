const mongoose = require("mongoose");
const { generateRandomString } = require("../helper");

const characterSchema = new mongoose.Schema({
  character_name: {
    type: String,
    required: [true, "Character name is required"],
    trim: true,
  },
  character_slug: {
    type: String,
    trim: true
  },
  character_image: {
    type: String,
    trim: true,
    required: [true, "Character image is required"],
  },
  color_code: {
    type: String,
    trim: true,
    required: [true, "Character color code is required"],
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

characterSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Character", characterSchema);