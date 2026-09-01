// src/Utils/multerStorage.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const config = require("../Config/app");

const isS3Configured = Boolean(
  config.AWS_ACCESS_KEY_ID &&
  config.AWS_SECRET_ACCESS_KEY &&
  config.AWS_BUCKET_NAME &&
  config.AWS_BUCKET_NAME.trim() !== ""
);

function getMulterUpload(folderPath) {
  const allowed = /jpeg|jpg|png|webp|svg/;

  if (isS3Configured) {
    const storage = multer.memoryStorage();
    return multer({
      storage,
      limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.test(ext) && !allowed.test(file.mimetype)) {
          const err = new Error("Only .png, .jpg, .jpeg, .webp, and .svg formats are allowed!");
          err.statusCode = 422;
          return cb(err);
        }
        cb(null, true);
      },
    });
  }

  // Local disk storage (fallback on VPS / Render without S3)
  const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(__dirname, "..", "media", folderPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
    },
  });

  return multer({
    storage: localStorage,
    limits: { fileSize: 15 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowed.test(ext) && !allowed.test(file.mimetype)) {
        const err = new Error("Only .png, .jpg, .jpeg, .webp, and .svg formats are allowed!");
        err.statusCode = 422;
        return cb(err);
      }
      cb(null, true);
    },
  });
}

function getExcelUpload() {
  const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const os = require("os");
      cb(null, os.tmpdir());
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, "import-" + Date.now() + Math.round(Math.random() * 1e9) + ext);
    },
  });

  return multer({
    storage: localStorage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
      const allowed = /xlsx|xls|csv/;
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowed.test(ext)) {
         return cb(new Error("Only .xlsx, .xls and .csv formats allowed!"));
      }
      cb(null, true);
    },
  });
}

function getReviewUpload() {
  const folderPath = "review";

  if (isS3Configured) {
    const storage = multer.memoryStorage();
    return multer({
      storage,
      limits: { fileSize: 25 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|heic|mp4|webp/;
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.test(ext) && !allowed.test(file.mimetype)) {
           return cb(new Error("Only .jpg, .jpeg, .png, .webp, .heic and .mp4 allowed!"));
        }
        cb(null, true);
      },
    });
  }

  const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(__dirname, "..", "media", folderPath);
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
    },
  });

  return multer({
    storage: localStorage,
    limits: { fileSize: 25 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = /jpeg|jpg|png|heic|mp4|webp/;
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowed.test(ext) && !allowed.test(file.mimetype)) {
        return cb(new Error("Only .jpg, .jpeg, .png, .webp, .heic and .mp4 allowed!"));
      }
      cb(null, true);
    },
  });
}

function getGalleryUpload() {
  const folderPath = "gallery";
  const allowed = /jpeg|jpg|png|webp|svg|heic|mp4|webm|mov|mkv/;

  if (isS3Configured) {
    const storage = multer.memoryStorage();
    return multer({
      storage,
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.test(ext) && !allowed.test(file.mimetype)) {
          const err = new Error("Only .jpg, .jpeg, .png, .webp, .svg, .heic, .mp4, .webm, .mov, and .mkv formats are allowed!");
          err.statusCode = 422;
          return cb(err);
        }
        cb(null, true);
      },
    });
  }

  const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(__dirname, "..", "media", folderPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
    },
  });

  return multer({
    storage: localStorage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowed.test(ext) && !allowed.test(file.mimetype)) {
        const err = new Error("Only .jpg, .jpeg, .png, .webp, .svg, .heic, .mp4, .webm, .mov, and .mkv formats are allowed!");
        err.statusCode = 422;
        return cb(err);
      }
      cb(null, true);
    },
  });
}

module.exports = { getMulterUpload, getExcelUpload, getReviewUpload, getGalleryUpload };
