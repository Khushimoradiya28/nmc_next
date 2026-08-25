const logger = require("../Utils/logger");

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let response = {
    status: 500,
    message: "Internal Server Error"
  };

  // ✅ Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = {};

    for (const field in err.errors) {
      errors[field] = [err.errors[field].message];
    }

    response = {
      status: statusCode,
      error: errors
    };
  }

  // ✅ Handle Duplicate Key Error (MongoDB)
  else if (err.code && err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    const value = err.keyValue ? err.keyValue[field] : "";
    const cleanMessage = `${value} already exists.`;

    response = {
      status: statusCode,
      // message: cleanMessage,
      error: {
        [field]: [cleanMessage]
      }
    };
  }

  // ✅ Handle Invalid ID or Cast Error
  else if (err.name === "CastError") {
    statusCode = 400;
    response = {
      status: statusCode,
      // message: `Invalid ${err.path}: ${err.value}`,
      error: {
        [err.path]: [`Invalid value: ${err.value}`]
      }
    };
  }

  // ✅ Handle Custom Errors (manual thrown)
  else if (err.statusCode) {
    statusCode = err.statusCode;
    response = {
      status: statusCode,
      // message: err.message,
      error: {
        message: [err.message]
      }
    };
  }

  // ✅ Log error details for debugging
  logger.error(
    `Status: ${statusCode}, URL: ${req.originalUrl}, Message: ${err.message}`
  );

  // ✅ Send structured JSON response
  res.status(statusCode).json(response);
};

module.exports = { errorHandler };
