const mongoose = require("mongoose");
const { generateRandomString } = require('../helper');

const roleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        required: [true, "Role name is required"],
        unique: true,
        validate: {
            validator: function(v) {
            return /^[A-Za-z\s]+$/.test(v); 
            },
            message: props => `${props.value} is not a valid role name`
        },
        trim: true
    },
    status: {
        type: Number,
        enum: [1, 0],
        default: 1
    },
    guid: { type: String, default: () => generateRandomString(12) },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
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

roleSchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model("Role", roleSchema);
