const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_product",
    required: [true, "Product ID is required"]
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"]
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: 1,
    max: 5
  },
  review: {
    type: String,
    // required: [true, "Review text is required"],
    trim: true
  },
  media: [{
    type: String,
    trim: true
  }],
  status: {
    type: Number,
    enum: [1, 0],
    default: 1
  },
  is_publish: {
    type: Number,
    enum: [0, 1],
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

reviewSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Review", reviewSchema);
