const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  ENCRYPTION_STATUS: process.env.ENCRYPTION_STATUS || "false",
  JWT_SECRET: process.env.JWT_SECRET,
  SECRET_KEY: process.env.SECRET_KEY, // Encryption key
  IV: process.env.IV,
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 5000,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  HOST: process.env.HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  SECURITY: process.env.SECURITY,
  SMTP_USERNAME: process.env.SMTP_USERNAME,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
};