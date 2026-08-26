const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { generateRandomString, generateSlug } = require("../helper");

const testimonialSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: {
        values: ["student", "dignitary"],
        message: "Testimonial type must be either 'student' or 'dignitary'",
      },
      required: [true, "Testimonial type is required"],
      trim: true,
      index: true,
    },
    // Dignitary specific: Headline / Title
    title: {
      type: String,
      trim: true,
      default: "",
    },
    // Student Name (for student) or Dignitary Name (for dignitary)
    authorName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    // Course / Subtext (for student) or Designation / Subtext (for dignitary)
    designationSubtext: {
      type: String,
      required: [true, "Designation / Subtext is required"],
      trim: true,
    },
    // Rating (Mandatory for student: 1 to 5)
    rating: {
      type: Number,
      default: 5,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    // Testimonial Quote
    quote: {
      type: String,
      required: [true, "Testimonial quote is required"],
      trim: true,
    },
    // Student Photo / Avatar or Profile Photo / Image
    avatarUrl: {
      type: String,
      trim: true,
      default: "",
    },
    // Unique slug generated from heading / name for safe inner record referencing
    slug: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    guid: {
      type: String,
      default: () => generateRandomString(12),
      unique: true,
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
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    created_at: {
      type: Date,
      default: () => moment().tz("Asia/Kolkata").toDate(),
    },
    updated_at: {
      type: Date,
      default: () => moment().tz("Asia/Kolkata").toDate(),
    },
  },
  {
    timestamps: false, // Handled manually with Asia/Kolkata timezone
  }
);

// Pre-validate hook to check conditional mandatory fields
testimonialSchema.pre("validate", function (next) {
  if (this.type === "dignitary") {
    if (!this.title || !this.title.trim()) {
      this.invalidate("title", "Headline / Title is required for dignitary testimonials.");
    }
  } else if (this.type === "student") {
    if (this.rating === undefined || this.rating === null || isNaN(this.rating)) {
      this.invalidate("rating", "Rating is required for student testimonials.");
    }
  }
  next();
});

// Pre-save hook to generate unique slug and set Asia/Kolkata updated_at
testimonialSchema.pre("save", async function (next) {
  this.updated_at = moment().tz("Asia/Kolkata").toDate();

  // Generate slug if not present or heading/authorName changed
  if (this.isModified("title") || this.isModified("authorName") || !this.slug) {
    const baseText = (this.type === "dignitary" && this.title && this.title.trim()) 
      ? this.title 
      : this.authorName;

    let generated = generateSlug(baseText || "testimonial");
    let uniqueSlug = generated;
    let counter = 1;

    // Ensure uniqueness
    while (await mongoose.models.Testimonial.findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
      uniqueSlug = `${generated}-${counter}`;
      counter++;
    }

    this.slug = uniqueSlug;
  }

  next();
});

module.exports = mongoose.model("Testimonial", testimonialSchema);

