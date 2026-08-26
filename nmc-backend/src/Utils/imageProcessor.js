// src/Utils/imageProcessor.js
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { PutObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const config = require("../Config/app");
const { s3 } = require("./s3Client");

const isProduction = config.NODE_ENV === "production";

/**
 * Save original + webp for local storage
 * @param {Object} file - multer file (has path, filename)
 * @param {string} folderPath - e.g. "profile"
 * @returns {Object} { originalPath, webpPath }
 */
async function saveLocalAndCreateWebp(file, folderPath) {
  const uploadsDir = path.join(__dirname, "..", "media", folderPath);
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const originalPath = file.path; // e.g. src/media/awards/12345-..webp
  const ext = path.extname(originalPath).toLowerCase();
  const baseName = path.basename(originalPath, ext);

  let relOriginal = path.join("media", folderPath, path.basename(originalPath)).replace(/\\/g, "/");
  let relWebp = relOriginal;

  if (ext !== ".webp") {
    const webpPath = path.join(path.dirname(originalPath), baseName + ".webp");
    await sharp(originalPath).webp({ quality: 80 }).toFile(webpPath);
    relWebp = path.join("media", folderPath, path.basename(webpPath)).replace(/\\/g, "/");
  }

  return { originalPath: relOriginal, webpPath: relWebp };
}


/**
 * Upload original + webp to S3 (when multer uses memoryStorage)
 * @param {Object} file - multer file with buffer, originalname
 * @param {string} folderPath - e.g. "profile"
 * @returns {Object} { originalKey, webpKey, originalUrl, webpUrl }
 */
async function uploadToS3AndCreateWebp(file, folderPath) {
  const ext = path.extname(file.originalname).toLowerCase();
  const baseName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const originalKey = `media/${folderPath}/${baseName}${ext}`;
  const webpKey = `media/${folderPath}/${baseName}.webp`;
  const bucket = config.AWS_BUCKET_NAME;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: originalKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    })
  );

  const webpBuffer = await sharp(file.buffer).webp({ quality: 80 }).toBuffer();

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: webpKey,
      Body: webpBuffer,
      ContentType: "image/webp",
      ACL: "public-read",
    })
  );

  // return keys and optional urls
  return {
    originalKey,
    webpKey,
    originalUrl: originalKey,
    webpUrl: webpKey,
  };
}

/**
 * Delete local images: accepts either stored original path or stored webp path (relative or absolute).
 * Will attempt:
 *  - explicit original path
 *  - explicit webp path
 *  - derived webp from original (replace extension with .webp)
 * Each candidate is resolved to an absolute path using project base (path.join(__dirname, "..", ...)).
 *
 * @param {string|null} originalStored - e.g. "media/profile/abc.jpg" or "/full/path/...jpg"
 * @param {string|null} webpStored - e.g. "media/profile/abc.webp"
 */
function deleteLocalImages(originalStored, webpStored) {
  const candidates = new Set();

  const resolveCandidate = (stored) => {
    if (!stored) return null;
    // If it's an absolute path (starts with / or a drive letter), use as-is; otherwise resolve relative to project root
    const isAbs = path.isAbsolute(stored);
    return isAbs ? stored : path.join(__dirname, "..", stored);
  };

  // if original provided, add original resolved
  if (originalStored) {
    const p = resolveCandidate(originalStored);
    candidates.add(p);
    // add derived webp based on original basename
    try {
      const ext = path.extname(originalStored);
      const derived = originalStored.endsWith(ext)
        ? originalStored.replace(new RegExp(`${ext}$`), ".webp")
        : originalStored + ".webp";
      const p2 = resolveCandidate(derived);
      candidates.add(p2);
    } catch (e) {
      // ignore
    }
  }

  // if webp provided, add it too
  if (webpStored) {
    const p = resolveCandidate(webpStored);
    candidates.add(p);
  }

  // attempt deletion for unique candidates
  for (const filePath of candidates) {
    if (!filePath) continue;
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
      }
    } catch (err) {
      console.warn("Failed to delete local image:", filePath, err.message);
    }
  }
}

/**
 * Delete multiple S3 objects (accepts an array of Keys)
 * Uses DeleteObjectsCommand; non-fatal.
 * @param {string[]} keys
 */
async function deleteS3Objects(keys = []) {
  if (!Array.isArray(keys) || keys.length === 0) return;
  const bucket = config.AWS_BUCKET_NAME;
  try {
    // aws sdk expects list of { Key: "..." }
    const objects = keys.map((k) => ({ Key: k }));
    await s3.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: { Objects: objects },
      })
    );
  } catch (err) {
    console.warn("Failed to delete S3 objects:", err.message);
  }
}

/**
 * Copy image (and its .webp variant if exists) from source path/key to destination folder.
 * 
 * @param {string} sourcePathOrKey - Relative path or S3 key of the source image
 * @param {string} destFolder - Destination folder (e.g. "profile")
 * @returns {Promise<Object>} { original, webp } - the new relative paths/keys
 */
async function copyImage(sourcePathOrKey, destFolder) {
  if (!sourcePathOrKey) return { original: null, webp: null };

  const ext = path.extname(sourcePathOrKey).toLowerCase();
  const baseName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const newOriginalKey = `media/${destFolder}/${baseName}${ext}`;
  const newWebpKey = `media/${destFolder}/${baseName}.webp`;

  // Determine source webp path
  let sourceWebp = "";
  if (sourcePathOrKey.endsWith(ext)) {
    sourceWebp = sourcePathOrKey.replace(new RegExp(`${ext}$`), ".webp");
  } else {
    sourceWebp = sourcePathOrKey + ".webp";
  }

  if (isProduction) {
    const bucket = config.AWS_BUCKET_NAME;
    const { CopyObjectCommand } = require("@aws-sdk/client-s3");

    // Copy original
    await s3.send(new CopyObjectCommand({
      Bucket: bucket,
      CopySource: `${bucket}/${sourcePathOrKey}`,
      Key: newOriginalKey,
      ACL: "public-read"
    }));

    // Try to copy webp (it might not exist, so strictly we might want to check or catch error)
    // For now assuming if source has it, we copy. If strict check needed, use HeadObject.
    try {
      await s3.send(new CopyObjectCommand({
        Bucket: bucket,
        CopySource: `${bucket}/${sourceWebp}`,
        Key: newWebpKey,
        ACL: "public-read"
      }));
    } catch (e) {
      // ignore if webp doesn't exist
    }

    return { original: newOriginalKey, webp: newWebpKey };

  } else {
    // Local filesystem
    const sourceAbs = path.join(__dirname, "..", sourcePathOrKey);
    const destDir = path.join(__dirname, "..", "media", destFolder);
    
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    const destOriginalAbs = path.join(destDir, `${baseName}${ext}`);
    const destWebpAbs = path.join(destDir, `${baseName}.webp`);

    if (fs.existsSync(sourceAbs)) {
       fs.copyFileSync(sourceAbs, destOriginalAbs);
    } else {
       throw new Error(`Source file not found: ${sourcePathOrKey}`);
    }

    const sourceWebpAbs = path.join(__dirname, "..", sourceWebp);
    if (fs.existsSync(sourceWebpAbs)) {
      fs.copyFileSync(sourceWebpAbs, destWebpAbs);
    }

    const relOriginal = path.join("media", destFolder, `${baseName}${ext}`);
    const relWebp = path.join("media", destFolder, `${baseName}.webp`);

    return { original: relOriginal, webp: relWebp };
  }
}

module.exports = {
  saveLocalAndCreateWebp,
  uploadToS3AndCreateWebp,
  deleteLocalImages,
  deleteS3Objects,
  copyImage
};
