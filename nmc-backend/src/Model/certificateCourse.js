const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { generateRandomString, generateSlug } = require("../helper");

const certificateCourseSchema = new mongoose.Schema(
  {
    // Course title e.g. "Tally ERP & GST Accounting"
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    // Category tag e.g. "ACCOUNTING & FINANCE", "DESIGN & CREATIVE", "PROFESSIONAL GROWTH"
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    // Badge label e.g. "Popular", "High Demand", "Essential"
    badge: {
      type: String,
      trim: true,
      default: "",
    },
    // Short description
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },
    // Course highlights / features (array of strings)
    highlights: {
      type: [String],
      default: [],
    },
    // Duration e.g. "6 Months", "3 Months"
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    // Fees e.g. "Rs. 8,000/Sem."
    fees: {
      type: String,
      required: [true, "Fees is required"],
      trim: true,
    },
    // Course thumbnail / image URL
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    // Enrollment link or CTA URL
    enrollUrl: {
      type: String,
      trim: true,
      default: "",
    },
    // Unique slug generated from title
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
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
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

// Pre-save hook to generate unique slug and set updated_at
certificateCourseSchema.pre("save", async function (next) {
  this.updated_at = moment().tz("Asia/Kolkata").toDate();

  // Generate slug from title if not present or title changed
  if (this.isModified("title") || !this.slug) {
    let generated = generateSlug(this.title || "certificate-course");
    let uniqueSlug = generated;
    let counter = 1;

    // Ensure uniqueness
    while (await mongoose.models.CertificateCourse.findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
      uniqueSlug = `${generated}-${counter}`;
      counter++;
    }

    this.slug = uniqueSlug;
  }

  next();
});

module.exports = mongoose.model("CertificateCourse", certificateCourseSchema);
