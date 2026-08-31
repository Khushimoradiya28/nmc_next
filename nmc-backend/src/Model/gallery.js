const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { generateRandomString, generateSlug } = require("../helper");

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      enum: ["campus_labs", "events_culture", "video_highlights"],
      required: [true, "Gallery category is mandatory."],
      index: true,
    },
    media_type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
      index: true,
    },
    media_file: {
      type: String,
      required: [true, "Media file is mandatory."],
      trim: true,
    },
    media_file_webp: {
      type: String,
      trim: true,
      default: null,
    },
    thumbnail: {
      type: String,
      trim: true,
      default: null,
    },
    video_url: {
      type: String,
      trim: true,
      default: null,
    },
    guid: {
      type: String,
      default: () => generateRandomString(12),
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    sort_order: {
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

// Pre-save hook for Asia/Kolkata timestamp and slug generation
gallerySchema.pre("save", async function (next) {
  this.updated_at = moment().tz("Asia/Kolkata").toDate();

  if (this.title && (this.isModified("title") || !this.slug)) {
    let generated = generateSlug(this.title);
    let uniqueSlug = generated;
    let counter = 1;

    while (await mongoose.models.Gallery?.findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
      uniqueSlug = `${generated}-${counter}`;
      counter++;
    }
    this.slug = uniqueSlug;
  }

  next();
});

module.exports = mongoose.model("Gallery", gallerySchema);
