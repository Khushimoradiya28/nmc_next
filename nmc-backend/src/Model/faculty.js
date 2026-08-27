const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { generateRandomString, generateSlug } = require("../helper");

const facultySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    photo: {
      type: String,
      trim: true,
      default: "",
    },
    photo_webp: {
      type: String,
      trim: true,
      default: "",
    },
    badgeTag: {
      type: String,
      trim: true,
      default: "",
    },
    designation: {
      type: String,
      required: [true, "Designation & role is required"],
      trim: true,
    },
    qualifications: {
      type: String,
      trim: true,
      default: "",
    },
    department: {
      type: String,
      trim: true,
      default: "",
    },
    experience: {
      type: String,
      trim: true,
      default: "",
    },
    overview: {
      type: String,
      trim: true,
      default: "",
    },
    expertise: {
      type: [String],
      default: [],
    },
    keyHighlight: {
      type: String,
      trim: true,
      default: "",
    },
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
    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
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
    timestamps: false,
  }
);

// Pre-save hook: auto slug generation and Asia/Kolkata timestamp
facultySchema.pre("save", async function (next) {
  this.updated_at = moment().tz("Asia/Kolkata").toDate();

  if (this.isModified("fullName") || !this.slug) {
    let generated = generateSlug(this.fullName || "faculty");
    let uniqueSlug = generated;
    let counter = 1;

    while (await mongoose.models.Faculty.findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
      uniqueSlug = `${generated}-${counter}`;
      counter++;
    }

    this.slug = uniqueSlug;
  }

  next();
});

module.exports = mongoose.model("Faculty", facultySchema);
