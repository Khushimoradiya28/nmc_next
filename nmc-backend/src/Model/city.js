const mongoose = require("mongoose");
const { generateRandomString } = require('../helper');

const citySchema = new mongoose.Schema({
    city_name: {
        type: String,
        required: [true, "City name is required"],
        unique: true,
        validate: {
            validator: function(v) {
            return /^[A-Za-z\s]+$/.test(v); 
            },
            message: props => `${props.value} is not a valid city name`
        },
        trim: true
    },
    status: {
        type: String,
        enum: ["1", "0"],
        default: "1"
    },
    guid: {
        type: String,
        default: () => generateRandomString(12) 
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

citySchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model("City", citySchema);
