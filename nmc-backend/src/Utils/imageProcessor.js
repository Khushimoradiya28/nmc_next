// src/Utils/imageProcessor.js
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { PutObjectCommand, DeleteObjectsCommand, CopyObjectCommand } = require("@aws-sdk/client-s3");
const config = require("../Config/app");
const { s3 } = require("./s3Client");

function isS3Configured() {
  return Boolean(
    config.AWS_ACCESS_KEY_ID &&
    config.AWS_SECRET_ACCESS_KEY &&
    config.AWS_BUCKET_NAME &&
    config.AWS_BUCKET_NAME.trim() !== ""
  );
}

/**
 * Save original + webp for local storage.
 * Supports both multer diskStorage (file.path) and memoryStorage (file.buffer).
 * @param {Object} file - multer file (has path or buffer, filename or originalname)
 * @param {string} folderPath - e.g. "banners"
 * @returns {Promise<Object>} { originalPath, webpPath, originalKey, webpKey }
 */
async function saveLocalAndCreateWebp(file, folderPath) {
  const uploadsDir = path.join(__dirname, "..", "media", folderPath);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Case A: File is in memory buffer (multer.memoryStorage)
  if (file.buffer) {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".png";
    const baseName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalFileName = `${baseName}${ext}`;
    const originalDiskPath = path.join(uploadsDir, originalFileName);

    await fs.promises.writeFile(originalDiskPath, file.buffer);

    let relOriginal = path.join("media", folderPath, originalFileName).replace(/\\/g, "/");
    let relWebp = relOriginal;

    if (ext !== ".webp") {
      try {
        const webpFileName = `${baseName}.webp`;
        const webpDiskPath = path.join(uploadsDir, webpFileName);
        const isSmallFile = file.buffer.length < 150 * 1024; // If already < 150KB
        
        await sharp(file.buffer)
          .webp(
            isSmallFile
              ? { quality: 95, nearLossless: true, effort: 4 }
              : { quality: 85, effort: 6, smartSubsample: true }
          )
          .toFile(webpDiskPath);
        relWebp = path.join("media", folderPath, webpFileName).replace(/\\/g, "/");
      } catch (err) {
        console.warn("WebP conversion fallback warning:", err.message);
      }
    }

    return {
      originalPath: relOriginal,
      webpPath: relWebp,
      originalKey: relOriginal,
      webpKey: relWebp,
    };
  }

  // Case B: File is already on disk (multer.diskStorage)
  const originalPath = file.path;
  const ext = path.extname(originalPath).toLowerCase();
  const baseName = path.basename(originalPath, ext);

  let relOriginal = path.join("media", folderPath, path.basename(originalPath)).replace(/\\/g, "/");
  let relWebp = relOriginal;

  if (ext !== ".webp") {
    try {
      const webpPath = path.join(path.dirname(originalPath), baseName + ".webp");
      const stat = fs.existsSync(originalPath) ? fs.statSync(originalPath) : null;
      const isSmallFile = stat && stat.size < 150 * 1024; // If already < 150KB
      
      await sharp(originalPath)
        .webp(
          isSmallFile
            ? { quality: 95, nearLossless: true, effort: 4 }
            : { quality: 85, effort: 6, smartSubsample: true }
        )
        .toFile(webpPath);
      relWebp = path.join("media", folderPath, path.basename(webpPath)).replace(/\\/g, "/");
    } catch (err) {
      console.warn("WebP conversion fallback warning:", err.message);
    }
  }

  return {
    originalPath: relOriginal,
    webpPath: relWebp,
    originalKey: relOriginal,
    webpKey: relWebp,
  };
}

/**
 * Upload original + webp to S3 (when S3 is configured, falls back to local disk if S3 fails)
 * @param {Object} file - multer file with buffer or path
 * @param {string} folderPath - e.g. "banners"
 * @returns {Promise<Object>} { originalKey, webpKey, originalUrl, webpUrl }
 */
async function uploadToS3AndCreateWebp(file, folderPath) {
  if (!isS3Configured()) {
    return saveLocalAndCreateWebp(file, folderPath);
  }

  try {
    const ext = path.extname(file.originalname || file.filename || "").toLowerCase() || ".png";
    const baseName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalKey = `media/${folderPath}/${baseName}${ext}`;
    const webpKey = `media/${folderPath}/${baseName}.webp`;
    const bucket = config.AWS_BUCKET_NAME;

    const fileBuffer = file.buffer || (file.path ? await fs.promises.readFile(file.path) : null);
    if (!fileBuffer) {
      return saveLocalAndCreateWebp(file, folderPath);
    }

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: originalKey,
        Body: fileBuffer,
        ContentType: file.mimetype || "image/jpeg",
        ACL: "public-read",
      })
    );

    try {
      const webpBuffer = await sharp(fileBuffer)
        .webp({ quality: 85, effort: 6, smartSubsample: true })
        .toBuffer();
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: webpKey,
          Body: webpBuffer,
          ContentType: "image/webp",
          ACL: "public-read",
        })
      );
    } catch (webpErr) {
      console.warn("S3 WebP upload warning:", webpErr.message);
    }

    return {
      originalKey,
      webpKey,
      originalUrl: originalKey,
      webpUrl: webpKey,
    };
  } catch (err) {
    console.warn("S3 Upload failed, automatically saving to local disk storage:", err.message);
    return saveLocalAndCreateWebp(file, folderPath);
  }
}

/**
 * Delete local images
 */
function deleteLocalImages(originalStored, webpStored) {
  const candidates = new Set();

  const resolveCandidate = (stored) => {
    if (!stored) return null;
    const isAbs = path.isAbsolute(stored);
    return isAbs ? stored : path.join(__dirname, "..", stored);
  };

  if (originalStored) {
    const p = resolveCandidate(originalStored);
    candidates.add(p);
    try {
      const ext = path.extname(originalStored);
      const derived = originalStored.endsWith(ext)
        ? originalStored.replace(new RegExp(`${ext}$`), ".webp")
        : originalStored + ".webp";
      const p2 = resolveCandidate(derived);
      candidates.add(p2);
    } catch (e) {}
  }

  if (webpStored) {
    const p = resolveCandidate(webpStored);
    candidates.add(p);
  }

  for (const filePath of candidates) {
    if (!filePath) continue;
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.warn("Failed to delete local image:", filePath, err.message);
    }
  }
}

/**
 * Delete multiple S3 objects
 */
async function deleteS3Objects(keys = []) {
  if (!isS3Configured() || !Array.isArray(keys) || keys.length === 0) return;
  const bucket = config.AWS_BUCKET_NAME;
  try {
    const objects = keys.filter(Boolean).map((k) => ({ Key: k }));
    if (objects.length > 0) {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: { Objects: objects },
        })
      );
    }
  } catch (err) {
    console.warn("Failed to delete S3 objects:", err.message);
  }
}

/**
 * Copy image helper
 */
async function copyImage(sourcePathOrKey, destFolder) {
  if (!sourcePathOrKey) return { original: null, webp: null };

  const ext = path.extname(sourcePathOrKey).toLowerCase();
  const baseName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const newOriginalKey = `media/${destFolder}/${baseName}${ext}`;
  const newWebpKey = `media/${destFolder}/${baseName}.webp`;

  let sourceWebp = "";
  if (sourcePathOrKey.endsWith(ext)) {
    sourceWebp = sourcePathOrKey.replace(new RegExp(`${ext}$`), ".webp");
  } else {
    sourceWebp = sourcePathOrKey + ".webp";
  }

  if (isS3Configured()) {
    try {
      const bucket = config.AWS_BUCKET_NAME;
      await s3.send(new CopyObjectCommand({
        Bucket: bucket,
        CopySource: `${bucket}/${sourcePathOrKey}`,
        Key: newOriginalKey,
        ACL: "public-read"
      }));

      try {
        await s3.send(new CopyObjectCommand({
          Bucket: bucket,
          CopySource: `${bucket}/${sourceWebp}`,
          Key: newWebpKey,
          ACL: "public-read"
        }));
      } catch (e) {}

      return { original: newOriginalKey, webp: newWebpKey };
    } catch (err) {
      console.warn("S3 CopyObject failed, attempting local copy:", err.message);
    }
  }

  // Local filesystem
  const sourceAbs = path.join(__dirname, "..", sourcePathOrKey);
  const destDir = path.join(__dirname, "..", "media", destFolder);
  
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const destOriginalAbs = path.join(destDir, `${baseName}${ext}`);
  const destWebpAbs = path.join(destDir, `${baseName}.webp`);

  if (fs.existsSync(sourceAbs)) {
     fs.copyFileSync(sourceAbs, destOriginalAbs);
  } else {
     return { original: sourcePathOrKey, webp: sourceWebp };
  }

  const sourceWebpAbs = path.join(__dirname, "..", sourceWebp);
  if (fs.existsSync(sourceWebpAbs)) {
    fs.copyFileSync(sourceWebpAbs, destWebpAbs);
  }

  const relOriginal = path.join("media", destFolder, `${baseName}${ext}`).replace(/\\/g, "/");
  const relWebp = path.join("media", destFolder, `${baseName}.webp`).replace(/\\/g, "/");

  return { original: relOriginal, webp: relWebp };
}

/**
 * Resolve full public URL for any media key/path (S3 bucket or local express server)
 */
function resolvePublicMediaUrl(storedKeyOrPath, req) {
  if (!storedKeyOrPath || typeof storedKeyOrPath !== "string" || storedKeyOrPath.trim() === "") {
    return null;
  }
  if (
    storedKeyOrPath.startsWith("http://") ||
    storedKeyOrPath.startsWith("https://") ||
    storedKeyOrPath.startsWith("blob:")
  ) {
    return storedKeyOrPath;
  }

  const cleanKey = storedKeyOrPath.replace(/\\/g, "/").replace(/^\/+/, "");

  // If S3 is configured, use S3 bucket / CloudFront URL
  if (isS3Configured()) {
    const bucket = config.AWS_BUCKET_NAME;
    const region = config.AWS_REGION || "ap-south-1";
    const s3Host = config.AWS_CLOUDFRONT_URL || `https://${bucket}.s3.${region}.amazonaws.com`;
    return `${s3Host.replace(/\/+$/, "")}/${cleanKey}`;
  }

  // Otherwise fallback to local express host
  const baseUrl = req ? `${req.protocol}://${req.get("host")}` : (config.APP_URL || "http://localhost:5000");
  return `${baseUrl.replace(/\/+$/, "")}/${cleanKey}`;
}

module.exports = {
  isS3Configured,
  resolvePublicMediaUrl,
  saveLocalAndCreateWebp,
  uploadToS3AndCreateWebp,
  deleteLocalImages,
  deleteS3Objects,
  copyImage
};
