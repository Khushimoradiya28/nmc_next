const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;
const path = require("path");

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = createLogger({
  level: "info", 
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    new transports.Console({
      format: combine(colorize(), logFormat),
    }),

    new transports.File({
      filename: path.join(__dirname, "../Storage/logs/app.log"),
    }),

    // new transports.File({
    //   filename: path.join(__dirname, "../Storage/logs/error.log"),
    //   level: "error",
    // }),
  ],
});

module.exports = logger;
