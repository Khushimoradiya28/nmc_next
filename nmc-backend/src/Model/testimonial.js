const mongoose = require("mongoose");
const { generateRandomString } = require("../helper");

const testimonialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    quote: {
      type: String,
      required: [true, "Testimonial quote is required"],
      trim: true,
    },
    authorName: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    designationSubtext: {
      type: String,
      required: [true, "Designation / subtext is required"],
      trim: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: "",
    },
    rating: {
      type: Number,
      default: 5,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    type: {
      type: String,
      enum: {
        values: ["dignitary", "student"],
        message: "Type must be either 'dignitary' or 'student'",
      },
      required: [true, "Testimonial type is required"],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    guid: {
      type: String,
      default: () => generateRandomString(12),
    },
    created_by: String,
    updated_by: String,
  },
  {
    timestamps: true,
  }
);

// Validate that title is required when type is dignitary
testimonialSchema.pre("validate", function (next) {
  if (this.type === "dignitary" && (!this.title || !this.title.trim())) {
    this.invalidate("title", "Title is required for dignitary testimonials.");
  }
  next();
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
