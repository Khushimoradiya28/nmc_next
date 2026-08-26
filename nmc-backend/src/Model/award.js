const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { generateRandomString, generateSlug } = require("../helper");

const awardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Award title is mandatory"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Award description is mandatory"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Award image is mandatory"],
      trim: true,
    },
    image_webp: {
      type: String,
      trim: true,
      default: null,
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
awardSchema.pre("save", async function (next) {
  this.updated_at = moment().tz("Asia/Kolkata").toDate();

  if (this.isModified("title") || !this.slug) {
    let generated = generateSlug(this.title || "award");
    let uniqueSlug = generated;
    let counter = 1;

    while (await mongoose.models.Award.findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
      uniqueSlug = `${generated}-${counter}`;
      counter++;
    }

    this.slug = uniqueSlug;
  }

  next();
});

module.exports = mongoose.model("Award", awardSchema);
