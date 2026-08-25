const mongoose = require('mongoose');
const { generateRandomString } = require('../helper');

const addressTypeSchema = new mongoose.Schema({
    address_type: {
        type: String,
        required: [true, "Address type name is required"],
        trim: true,
        unique: true
    },
    status: {
      type: Number,
      enum: [1, 0],
      default: 1
    },
    guid: { type: String, default: () => generateRandomString(12) },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_by: String,
    updated_by: String
});

addressTypeSchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model("AddressType", addressTypeSchema);
