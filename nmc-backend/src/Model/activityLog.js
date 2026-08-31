const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { generateRandomString } = require("../helper");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is mandatory"],
      index: true,
    },
    user_name: {
      type: String,
      trim: true,
      default: "",
    },
    user_email: {
      type: String,
      trim: true,
      default: "",
    },
    role_name: {
      type: String,
      enum: ["super_admin", "admin", "department", "content"],
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE", "LOGIN", "STATUS_CHANGE"],
      required: true,
      index: true,
    },
    module: {
      type: String,
      required: true,
      index: true,
    },
    record_id: {
      type: String,
      default: null,
      index: true,
    },
    record_title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    ip_address: {
      type: String,
      default: null,
    },
    guid: {
      type: String,
      default: () => generateRandomString(12),
      unique: true,
    },
    created_at: {
      type: Date,
      default: () => moment().tz("Asia/Kolkata").toDate(),
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
