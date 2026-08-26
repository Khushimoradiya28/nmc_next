// src/Utils/multerStorage.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const config = require("../Config/app");


const isProduction = config.NODE_ENV === "production";

function getMulterUpload(folderPath) {
  const allowed = /jpeg|jpg|png|webp|svg/;

  if (isProduction) {
    // Use memory storage in production: we'll manually upload original + webp to S3
    const storage = multer.memoryStorage();
    const upload = multer({
      storage,
      limits: { fileSize: 10 * 1024 * 1024 }, // optional limit 10MB
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.test(ext) && !allowed.test(file.mimetype)) {
          const err = new Error("Only .png, .jpg, .jpeg, .webp, and .svg formats are allowed!");
          err.statusCode = 400;
          return cb(err);
        }
        cb(null, true);
      },
    });
    return upload;
  }

  // Local disk storage (dev)
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
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowed.test(ext) && !allowed.test(file.mimetype)) {
        const err = new Error("Only .png, .jpg, .jpeg, .webp, and .svg formats are allowed!");
        err.statusCode = 400;
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
      // Accept .xlsx, .xls, and .csv too if needed, but strict to xlsx/xls for now
      const allowed = /xlsx|xls/;
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowed.test(ext)) {
         return cb(new Error("Only .xlsx and .xls format allowed!"));
      }
      cb(null, true);
    },
  });
}

function getReviewUpload() {
  const folderPath = "review";

  if (isProduction) {
    const storage = multer.memoryStorage();
     // Limit 10MB to accommodate video. We will validate image vs video size in controller or fileFilter if possible.
    return multer({
      storage,
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|heic|mp4/;
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.test(ext) && !allowed.test(file.mimetype)) {
           return cb(new Error("Only .jpg, .jpeg, .png, .heic and .mp4 allowed!"));
        }
        cb(null, true);
      },
    });
  }

  const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = `src/media/${folderPath}`;
      const fs = require('fs');
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
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = /jpeg|jpg|png|heic|mp4/;
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowed.test(ext) && !allowed.test(file.mimetype)) {
        return cb(new Error("Only .jpg, .jpeg, .png, .heic and .mp4 allowed!"));
      }
      cb(null, true);
    },
  });
}

module.exports = { getMulterUpload, getExcelUpload, getReviewUpload };
