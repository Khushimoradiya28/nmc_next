const express = require("express");
const path = require("path");
const os = require("os");
const multer = require("multer");
const router = express.Router();
const {
  getMedalists,
  getMedalistById,
  createMedalist,
  updateMedalist,
  deleteMedalist,
} = require("../Controller/goldMedalistController");
const { bulkValidate, bulkImport } = require("../Controller/goldMedalistBulkController");
const { getMulterUpload } = require("../Utils/multerStorage");

// Multer upload config for gold-medalists image (stores in src/media/gold-medalists locally)
const upload = getMulterUpload("gold-medalists");

// Spreadsheet upload (CSV / XLSX / XLS) stored in OS temp dir; controller parses then deletes
const ALLOWED_IMPORT_EXTS = [".csv", ".xlsx", ".xls"];
const csvUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, os.tmpdir()),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".csv";
      cb(null, `gm-import-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_IMPORT_EXTS.includes(ext)) {
      const err = new Error("Only .csv, .xlsx or .xls files are allowed for bulk import.");
      err.statusCode = 422;
      return cb(err);
    }
    cb(null, true);
  },
});

// Bulk Import Endpoints (declared BEFORE the /:idOrSlug catch-all)
router.post("/bulk-validate", csvUpload.single("file"), bulkValidate);
router.post("/bulk-import", bulkImport);

// Public / Listing Endpoints
router.get("/", getMedalists);
router.post("/list", getMedalists);
router.get("/:idOrSlug", getMedalistById);

// Admin / Write Operations (Supports Multipart File Upload & JSON)
router.post("/", upload.single("image"), createMedalist);
router.post("/add", upload.single("image"), createMedalist);
router.put("/:idOrSlug", upload.single("image"), updateMedalist);
router.post("/update", upload.single("image"), updateMedalist);
router.delete("/:idOrSlug", deleteMedalist);
router.post("/delete", deleteMedalist);

module.exports = router;
