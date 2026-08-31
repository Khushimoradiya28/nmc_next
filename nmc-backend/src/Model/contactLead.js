const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { generateRandomString } = require("../helper");

const contactLeadSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is mandatory."],
      trim: true,
    },
    last_name: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    reason: {
      type: String,
      trim: true,
      default: "",
    },
    course: {
      type: String,
      trim: true,
      default: "",
    },
    teacher: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    source: {
      type: String,
      enum: ["modal", "page", "contact_us", "other"],
      default: "contact_us",
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "contacted", "closed"],
      default: "pending",
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
      index: true,
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

contactLeadSchema.pre("save", function (next) {
  this.updated_at = moment().tz("Asia/Kolkata").toDate();
  next();
});

module.exports = mongoose.model("ContactLead", contactLeadSchema);
