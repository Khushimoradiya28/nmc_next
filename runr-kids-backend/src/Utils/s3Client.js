// src/Utils/s3Client.js
const { S3Client } = require("@aws-sdk/client-s3");
const config = require("../Config/app");


const { PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");

const s3 = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload a file buffer to S3
 * @param {Object} file - multer file object
 * @param {string} folderPath - folder name in S3 bucket
 * @returns {Promise<string>} - The S3 Key of the uploaded file
 */
async function s3Upload(file, folderPath) {
  const bucket = config.AWS_BUCKET_NAME;
  const ext = path.extname(file.originalname).toLowerCase();
  const baseName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const key = `media/${folderPath}/${baseName}${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    })
  );

  return key;
}

module.exports = { s3, s3Upload };
