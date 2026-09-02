const express = require("express");
const path = require("path");
const os = require("os");
const multer = require("multer");
const router = express.Router();
const {
  getRankers,
  getRankerById,
  createRanker,
  updateRanker,
  deleteRanker,
} = require("../Controller/rankerController");
const { bulkValidate, bulkImport } = require("../Controller/rankerBulkController");
const { getMulterUpload } = require("../Utils/multerStorage");

// Multer upload config for ranker image (stores in src/media/rankers locally)
const upload = getMulterUpload("rankers");

// Spreadsheet upload (CSV / XLSX / XLS) stored in OS temp dir; controller parses then deletes
const ALLOWED_IMPORT_EXTS = [".csv", ".xlsx", ".xls"];
const sheetUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, os.tmpdir()),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".csv";
      cb(null, `ranker-import-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
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
router.post("/bulk-validate", sheetUpload.single("file"), bulkValidate);
router.post("/bulk-import", bulkImport);

// Public / Listing Endpoints
router.get("/", getRankers);
router.post("/list", getRankers);
router.get("/:idOrSlug", getRankerById);

// Admin / Write Operations (Supports Multipart File Upload & JSON)
router.post("/", upload.single("image"), createRanker);
router.post("/add", upload.single("image"), createRanker);
router.put("/:idOrSlug", upload.single("image"), updateRanker);
router.post("/update", upload.single("image"), updateRanker);
router.delete("/:idOrSlug", deleteRanker);
router.post("/delete", deleteRanker);

module.exports = router;
