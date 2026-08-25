const mongoose = require("mongoose");
const config = require("./app");
const logger = require("../Utils/logger");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;
