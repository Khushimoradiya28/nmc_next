// Config/razorpay.js
const Razorpay = require("razorpay");
const config = require("../Config/app");

const razorpayInstance = new Razorpay({
    key_id: config.RAZORPAY_KEY_ID || "rzp_test_dummy_key",
    key_secret: config.RAZORPAY_KEY_SECRET || "dummy_secret",
});

module.exports = razorpayInstance;

