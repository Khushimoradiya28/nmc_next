const mongoose = require('mongoose');
const { generateRandomString } = require('../helper');

const leadSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "First name is required"],
        trim: true
    },
    last_name: {
        type: String,
        required: [true, "Last name is required"],
        trim: true
    },
    email: {
        type: String,
        trim: true
        // required: [true, "Email is required"],
        // trim: true,
        // lowercase: true,
        // validate: {
        //     validator: function(v) {
        //         return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        //     },
        //     message: props => `${props.value} is not a valid email address!`
        // }
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      minlength: [10, "Mobile number must be at least 10 digits long"],
      maxlength: [10, "Mobile number must not exceed 10 digits"],
      validate: {
        validator: (v) => /^\d+$/.test(v),
        message: "Mobile number must contain digits only",
      },
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: null
    },
    lead_type: {
        type: String,
        enum: ["contact", "enquiry"],
        default: "contact"
    },
    message: {
        type: String,
        trim: true
    },
    status: {
      type: Number,
      enum: [1, 0],
      default: 1
    },
    
    utm_source: { type: String, default: null },
    utm_medium: { type: String, default: null },
    utm_campaign: { type: String, default: null },
    utm_content: { type: String, default: null },
    utm_term: { type: String, default: null },

    ireferrer: { type: String, default: null },
    lreferrer: { type: String, default: null },
    ilandpage: { type: String, default: null },
    visits: { type: Number, default: 0 },

    ip_address: { type: String, default: null },
    browser_name: { type: String, default: null },
    browser_version: { type: String, default: null },
    browser_platform: { type: String, default: null },

    guid: { type: String, default: () => generateRandomString(12) },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_by: String,
    updated_by: String
});

leadSchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model("Lead", leadSchema);