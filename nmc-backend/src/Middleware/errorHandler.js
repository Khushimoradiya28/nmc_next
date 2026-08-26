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

  // ✅ Handle Custom Errors (manual thrown with statusCode)
  else if (err.statusCode) {
    statusCode = err.statusCode;
    response = {
      success: false,
      status: statusCode,
      message: err.message,
      error: {
        file: [err.message]
      }
    };
  }

  // ✅ Handle Multer Specific Errors
  else if (err.name === "MulterError" || err.message?.includes("format allowed")) {
    statusCode = 400;
    response = {
      success: false,
      status: 400,
      message: err.message,
      error: {
        image: [err.message]
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
