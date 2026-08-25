const mongoose = require("mongoose");
const { generateRandomString } = require('../helper');
const moment = require("moment-timezone");

const mediaSchema = new mongoose.Schema({
    media_title: {
        type: String,
        required: [true, "media_title is required"],
        trim: true
    },
    media_alt: {
        type: String,
        trim: true,
        default: null
    },
    media_description: {
        type: String,
        trim: true,
        default: null
    },
    media_file: {
        type: String,
        required: [true, "media_file is required"],
        validate: {
            validator: function (v) {
                return /\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|avi|mov|mkv|pdf)$/i.test(v);
            },
            message: "Invalid file type"
        }
    },
    status: {
        type: Number,
        enum: [1, 0],
        default: 1
    },
    guid: {
        type: String,
        default: () => generateRandomString(20)
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
});

mediaSchema.pre("save", function (next) {
    this.updated_at = moment().tz("Asia/Kolkata").toDate();
    next();
});

module.exports = mongoose.model("tbl_media", mediaSchema);
