const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { generateRandomString, generateSlug } = require("../helper");

const goldMedalistSchema = new mongoose.Schema(
  {
    // Achiever name e.g. "Parekh Khushbu"
    name: {
      type: String,
      required: [true, "Name is mandatory"],
      trim: true,
    },
    // Programme / Degree e.g. "B.A.", "B.B.A.", "M.COM"
    programme: {
      type: String,
      required: [true, "Programme is mandatory"],
      trim: true,
    },
    // Sub-course / Semester e.g. "TYBA", "SYBBA", "SEM 4"
    subCourse: {
      type: String,
      required: [true, "Sub-course / Semester is mandatory"],
      trim: true,
    },
    // Academic year range e.g. "2015-16"
    academicYear: {
      type: String,
      required: [true, "Academic year is mandatory"],
      trim: true,
    },
    // Rank badge e.g. "1ST RANK", "2ND RANK"
    rank: {
      type: String,
      required: [true, "Rank is mandatory"],
      trim: true,
    },
    // Rank holder label e.g. "UNIVERSITY RANK HOLDER"
    rankLabel: {
      type: String,
      trim: true,
      default: "UNIVERSITY RANK HOLDER",
    },
    // Photo (Evidence). Optional at model level: the single-add flow enforces it in the
    // controller, while bulk CSV import allows empty Evidence per business rules.
    image: {
      type: String,
      trim: true,
      default: "",
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
goldMedalistSchema.pre("save", async function (next) {
  this.updated_at = moment().tz("Asia/Kolkata").toDate();

  if (this.isModified("name") || !this.slug) {
    let generated = generateSlug(this.name || "gold-medalist");
    let uniqueSlug = generated;
    let counter = 1;

    while (await mongoose.models.GoldMedalist.findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
      uniqueSlug = `${generated}-${counter}`;
      counter++;
    }

    this.slug = uniqueSlug;
  }

  next();
});

module.exports = mongoose.model("GoldMedalist", goldMedalistSchema);
