const { encrypt } = require("../Utils/crypto");
const logger = require("../Utils/logger");

function encryptResponse(req, res, next) {
  const oldJson = res.json;

  res.json = function (data) {
    try {
      if (res.statusCode === 200 || res.statusCode === 201) {
        const encryptedData = encrypt(JSON.stringify(data));
        return oldJson.call(this, { Data: encryptedData });
      }
      return oldJson.call(this, data);
    } catch (error) {
      logger.error("Encryption error:", error.message);
      return oldJson.call(this, data);
    }
  };

  next();
}

module.exports = { encryptResponse };
