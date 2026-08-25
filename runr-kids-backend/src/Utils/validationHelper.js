// src/Utils/validationHelper.js

exports.validationError = (field, message) => {
  return {
    status: 400,
    message: "Request validation failed",
    error: {
      [field]: [message],
    },
  };
};
