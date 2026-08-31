const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { generateRandomString } = require("../helper");

const admissionLeadSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, "Full name is mandatory."],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is mandatory."],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    dob: {
      type: String,
      trim: true,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "male", "female", "other", ""],
      default: "",
    },
    city_village: {
      type: String,
      trim: true,
      default: "",
    },
    course: {
      type: String,
      required: [true, "Course interested in is mandatory."],
      trim: true,
    },
    last_qualification: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "contacted", "enrolled", "rejected", "closed"],
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

admissionLeadSchema.pre("save", function (next) {
  this.updated_at = moment().tz("Asia/Kolkata").toDate();
  next();
});

module.exports = mongoose.model("AdmissionLead", admissionLeadSchema);
