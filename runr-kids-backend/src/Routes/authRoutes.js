const express = require("express");
const router = express.Router();
const { login, changePassword, sendOtpToUser, verifyUserOtp, logout } = require("../Controller/authController");

router.post("/login", login);
router.post("/change-password", changePassword);
router.post("/send-otp", sendOtpToUser);
router.post("/verify-otp", verifyUserOtp);
router.post("/logout", logout);

module.exports = router;
