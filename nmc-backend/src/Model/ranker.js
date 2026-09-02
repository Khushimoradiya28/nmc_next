const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { generateRandomString, generateSlug } = require("../helper");

const rankerSchema = new mongoose.Schema(
  {
    // Student name e.g. "PAREKH KHUSHBHU"
    name: {
      type: String,
      required: [true, "Name is mandatory"],
      trim: true,
    },
    // Programme / Degree e.g. "BA", "B.COM", "M.COM"
    programme: {
      type: String,
      required: [true, "Programme is mandatory"],
      trim: true,
    },
    // Semester / Year label e.g. "BA SEM-1", "BA SEM-2"
    semesterYear: {
      type: String,
      required: [true, "Semester / Year is mandatory"],
      trim: true,
    },
    // Academic year range e.g. "2011-12"
    academicYear: {
      type: String,
      required: [true, "Academic year is mandatory"],
      trim: true,
    },
    // Numeric rank e.g. 1, 2, 3 (displayed as 1ST, 2ND on the frontend)
    rankNum: {
      type: Number,
      required: [true, "Rank number is mandatory"],
      min: [1, "Rank must be at least 1"],
    },
    // Achievement label e.g. "University Rank Holder"
    rankLabel: {
      type: String,
      trim: true,
      default: "University Rank Holder",
    },
    // Photo (optional at model level; controller enforces on single add)
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

// Pre-save hook: auto slug generation (name + semester + rank keeps it unique) + Asia/Kolkata timestamp
rankerSchema.pre("save", async function (next) {
  this.updated_at = moment().tz("Asia/Kolkata").toDate();

  if (this.isModified("name") || this.isModified("semesterYear") || this.isModified("rankNum") || !this.slug) {
    const base = generateSlug(`${this.name || "ranker"}-${this.semesterYear || ""}-${this.rankNum || ""}`);
    let uniqueSlug = base;
    let counter = 1;
    while (await mongoose.models.Ranker.findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
      uniqueSlug = `${base}-${counter}`;
      counter++;
    }
    this.slug = uniqueSlug;
  }

  next();
});

module.exports = mongoose.model("Ranker", rankerSchema);
