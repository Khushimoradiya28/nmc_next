// src/utils/crypto.js
const crypto = require("crypto");
const config = require("../Config/app");

const SECRET_KEY = Buffer.from(config.SECRET_KEY, "hex"); // 32 bytes key
const IV = Buffer.from(config.IV, "hex"); // 16 bytes IV

function encrypt(text) {
  const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, IV);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, IV);
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encrypt, decrypt };
