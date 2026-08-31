const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { generateRandomString, generateSlug } = require("../helper");

const contactSchema = new mongoose.Schema(
  {
    // First Name (required)
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    // Last Name
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    // Website
    website: {
      type: String,
      trim: true,
      default: "",
    },
    // Reason for contacting
    reason: {
      type: String,
      required: [true, "Reason is required"],
      trim: true,
    },
    // Course interested in
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
    },
    // Teacher / Department
    teacher: {
      type: String,
      required: [true, "Teacher/Department is required"],
      trim: true,
    },
    // Message (optional)
    message: {
      type: String,
      trim: true,
      default: "",
    },
    // Unique slug generated from firstName + timestamp
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

// Pre-save hook: generate unique slug and set updated_at
contactSchema.pre("save", async function (next) {
  this.updated_at = moment().tz("Asia/Kolkata").toDate();

  if (!this.slug || this.isModified("firstName")) {
    const baseText = `${this.firstName}-${Date.now()}`;
    let generated = generateSlug(baseText || "contact");
    let uniqueSlug = generated;
    let counter = 1;

    while (await mongoose.models.Contact.findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
      uniqueSlug = `${generated}-${counter}`;
      counter++;
    }

    this.slug = uniqueSlug;
  }

  next();
});

module.exports = mongoose.model("Contact", contactSchema);
