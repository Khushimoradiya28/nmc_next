const XLSX = require("xlsx-js-style");
const fs = require("fs");
const moment = require("moment-timezone");
const GoldMedalist = require("../Model/goldMedalist");
const AcademicProgram = require("../Model/academicProgram");

// Expected CSV headers (order-independent; matched case-insensitively & trimmed)
// Sr. No. | Academic Year | Programme | Semester / Year | Student Name | University Rank | Achievement | Evidence
const COLUMN_MAP = {
  srNo: ["sr. no.", "sr no", "srno", "sr.no", "sr. no", "sr", "no", "s.no", "s no", "serial", "serial no"],
  academicYear: ["academic year", "academicyear", "academic_year"],
  programme: ["programme", "program", "programme / degree", "degree"],
  subCourse: ["semester / year", "semester/year", "semester", "sub-course", "subcourse", "sub course"],
  name: ["student name", "studentname", "name", "full name"],
  rank: ["university rank", "rank", "universityrank"],
  rankLabel: ["achievement", "rank label", "ranklabel"],
  evidence: ["evidence", "image", "photo"],
};

// Human-friendly column display names for error reporting
const DISPLAY_COLUMN = {
  academicYear: "Academic Year",
  programme: "Programme",
  subCourse: "Semester / Year",
  name: "Student Name",
  rank: "University Rank",
  rankLabel: "Achievement",
  evidence: "Evidence",
};

// Normalize a header string for matching
const norm = (s) => (s || "").toString().trim().toLowerCase().replace(/\s+/g, " ");

// Normalize a programme value for loose comparison: strip dots, spaces & case
// so "B.A." , "BA" , "b a" all compare equal.
const normProgramme = (s) => (s || "").toString().toLowerCase().replace(/[^a-z0-9&]/g, "");

// Resolve which model field a given raw header belongs to
const resolveField = (rawHeader) => {
  const h = norm(rawHeader);
  for (const [field, aliases] of Object.entries(COLUMN_MAP)) {
    if (aliases.includes(h)) return field;
  }
  return null;
};

// ---------------------------------------------------------------------------
// Smart image matching against the frontend public folder
// Images live at: <repo>/frontend/public/assets/topper/<file>
// File naming is messy: "1.parekh khushbu.jpg", "4. Gohil Kajal Naresh bhai.JPG",
// "21.Maru Harita Pankajbhai.jfif" — i.e. "<SrNo>.<name>.<ext>" with mixed
// case/spacing/extensions. We match primarily by Sr. No. prefix, then by name.
// ---------------------------------------------------------------------------
const path = require("path");

const TOPPER_PUBLIC_DIR = "/assets/topper"; // public URL path (frontend serves this)
const TOPPER_FS_DIR = path.resolve(__dirname, "../../../frontend/public/assets/topper");

// Cache the directory listing per-request-batch (built lazily)
let _topperFilesCache = null;
const getTopperFiles = () => {
  if (_topperFilesCache) return _topperFilesCache;
  try {
    _topperFilesCache = fs.readdirSync(TOPPER_FS_DIR).filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".webp", ".jfif", ".gif"].includes(ext);
    });
  } catch (e) {
    _topperFilesCache = [];
  }
  return _topperFilesCache;
};

// Normalize a string for loose comparison: lowercase, strip non-alphanumerics
const canon = (s) => (s || "").toString().toLowerCase().replace(/[^a-z0-9]/g, "");

// Extract the leading "Sr. No." number from a file name like "10.Vatukiya..." -> "10"
const fileLeadingNumber = (fileName) => {
  const m = fileName.match(/^\s*(\d+)\s*[.\-_ ]/);
  return m ? m[1] : null;
};

// Extract the name portion of a file (after the leading "<num>." and before extension)
const fileNamePart = (fileName) => {
  const base = fileName.replace(/\.[^.]+$/, ""); // strip extension
  return base.replace(/^\s*\d+\s*[.\-_ ]*/, ""); // strip leading number + separator
};

/**
 * Find the best matching image file for a given Sr. No. + Student Name.
 * Returns the public URL path (/assets/topper/<encoded file>) or "".
 * Priority:
 *   1. Exact Sr. No. prefix match (most reliable)
 *   2. Full canonical name match
 *   3. Name contained-in / contains match
 */
const matchTopperImage = (srNo, studentName) => {
  const files = getTopperFiles();
  if (!files.length) return "";

  // 1. Match by Sr. No. leading number
  if (srNo) {
    const target = srNo.toString().trim();
    const byNum = files.find((f) => fileLeadingNumber(f) === target);
    if (byNum) return `${TOPPER_PUBLIC_DIR}/${encodeURIComponent(byNum)}`;
  }

  // 2 & 3. Match by student name
  const nameCanon = canon(studentName);
  if (nameCanon) {
    // exact canonical name match
    let byName = files.find((f) => canon(fileNamePart(f)) === nameCanon);
    if (byName) return `${TOPPER_PUBLIC_DIR}/${encodeURIComponent(byName)}`;

    // contains match (file name contains the student's key tokens or vice-versa)
    byName = files.find((f) => {
      const fc = canon(fileNamePart(f));
      return fc && (fc.includes(nameCanon) || nameCanon.includes(fc));
    });
    if (byName) return `${TOPPER_PUBLIC_DIR}/${encodeURIComponent(byName)}`;
  }

  return "";
};

/**
 * Parse an uploaded CSV/XLSX file buffer/path into an array of row objects
 * keyed by resolved model field names, preserving the original sheet row number.
 */
// Minimal CSV line parser that respects double-quoted fields
const parseCsvText = (text) => {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  return lines.map((line) => {
    const out = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (line[i + 1] === '"') { cur += '"'; i++; }
          else inQuotes = false;
        } else cur += ch;
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out;
  });
};

const parseSheet = (filePath) => {
  // CSV is parsed as plain text (avoids xlsx coercing values like "2015-16" into date serials).
  let rows;
  if (path.extname(filePath).toLowerCase() === ".csv") {
    const text = fs.readFileSync(filePath, "utf8");
    rows = parseCsvText(text).filter((r) => r.some((c) => (c || "").toString().trim() !== ""));
  } else {
    const workbook = XLSX.readFile(filePath, { cellDates: false, raw: false });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", blankrows: false, raw: false });
  }
  if (!rows.length) return { headers: [], records: [] };

  const headerRow = rows[0].map((h) => (h || "").toString().trim());
  // Map each column index to a model field (or null if unknown)
  const colFieldByIndex = headerRow.map((h) => resolveField(h));

  const records = [];
  for (let i = 1; i < rows.length; i++) {
    const rowArr = rows[i];
    // Skip fully empty rows
    if (!rowArr || rowArr.every((c) => (c || "").toString().trim() === "")) continue;

    const rec = { __rowNumber: i + 1 }; // 1-based; +1 accounts for header row
    colFieldByIndex.forEach((field, idx) => {
      if (field) {
        rec[field] = (rowArr[idx] !== undefined && rowArr[idx] !== null)
          ? rowArr[idx].toString().trim()
          : "";
      }
    });
    records.push(rec);
  }

  return { headers: headerRow, records };
};

/**
 * Validate a single parsed record against rules + master data.
 * Returns { valid: bool, errors: [{ column, reason }], data: {...} }
 */
const validateRecord = (rec, programmeSet, existingNameKeys) => {
  const errors = [];

  const academicYear = (rec.academicYear || "").trim();
  const programme = (rec.programme || "").trim();
  const subCourse = (rec.subCourse || "").trim();
  const name = (rec.name || "").trim();
  const rank = (rec.rank || "").trim();
  const rankLabel = (rec.rankLabel || "").trim() || "UNIVERSITY RANK HOLDER";
  const srNo = (rec.srNo || "").toString().trim();

  // Evidence (optional). Two ways to resolve the image:
  //  a) If the CSV explicitly provides an Evidence value -> normalize it to a public path.
  //  b) Otherwise -> SMART auto-match against files in frontend/public/assets/topper
  //     using Sr. No. (primary) and Student Name (fallback), tolerant to case/spaces/ext.
  const rawEvidence = (rec.evidence || "").trim();
  let evidence = "";
  if (rawEvidence) {
    if (/^https?:\/\//i.test(rawEvidence) || rawEvidence.startsWith("/assets/")) {
      evidence = rawEvidence;
    } else {
      const fileName = rawEvidence
        .replace(/^[\\/]+/, "")
        .replace(/^assets[\\/]toppers?[\\/]/i, "");
      // Try to resolve to a real file (handles extension/case mistakes); fall back to given name
      evidence = matchTopperImage(srNo, fileName) || `/assets/topper/${encodeURIComponent(fileName)}`;
    }
  } else {
    // No Evidence provided -> auto-match by Sr. No. + Student Name
    evidence = matchTopperImage(srNo, name);
  }

  // Required field checks
  if (!name) {
    errors.push({ column: DISPLAY_COLUMN.name, reason: "Student Name is required and cannot be blank." });
  }
  if (!programme) {
    errors.push({ column: DISPLAY_COLUMN.programme, reason: "Programme is required and cannot be blank." });
  }
  if (!subCourse) {
    errors.push({ column: DISPLAY_COLUMN.subCourse, reason: "Semester / Year is required and cannot be blank." });
  }
  if (!academicYear) {
    errors.push({ column: DISPLAY_COLUMN.academicYear, reason: "Academic Year is required and cannot be blank." });
  } else if (!/^\d{4}-\d{2,4}$/.test(academicYear)) {
    errors.push({ column: DISPLAY_COLUMN.academicYear, reason: `Academic Year "${academicYear}" is invalid. Use a range like 2015-16.` });
  }
  if (!rank) {
    errors.push({ column: DISPLAY_COLUMN.rank, reason: "University Rank is required and cannot be blank." });
  }

  // Master-data cross-check: Programme must exist in Academic Programs
  // (matched loosely: dots/spaces/case ignored so "B.A." == "BA" == "b a")
  if (programme && !programmeSet.has(normProgramme(programme))) {
    errors.push({
      column: DISPLAY_COLUMN.programme,
      reason: `Programme "${programme}" does not exist in the Academic Programs master. Create this master data first, then re-import.`,
    });
  }

  const data = {
    name,
    programme,
    subCourse,
    academicYear,
    rank,
    rankLabel,
    evidence,
  };

  return { valid: errors.length === 0, errors, data };
};

// @desc    Validate (audit) an uploaded CSV without inserting. Returns structured report.
// @route   POST /api/gold-medalists/bulk-validate  (multipart: file)
exports.bulkValidate = async (req, res, next) => {
  const cleanup = () => {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
    }
  };

  try {
    _topperFilesCache = null; // refresh image directory listing for this audit
    if (!req.file) {
      return res.status(422).json({
        success: false,
        status: 422,
        message: "Validation error: Unable to process input fields",
        errors: ["A CSV file is required. Please upload a .csv file."],
      });
    }

    // Enforce allowed spreadsheet formats (CSV / XLSX / XLS)
    const originalName = (req.file.originalname || "").toLowerCase();
    const allowedExts = [".csv", ".xlsx", ".xls"];
    if (!allowedExts.some((ext) => originalName.endsWith(ext))) {
      cleanup();
      return res.status(422).json({
        success: false,
        status: 422,
        message: "Validation error: Unable to process input fields",
        errors: ["Only .csv, .xlsx or .xls files are allowed for bulk import."],
      });
    }

    const { headers, records } = parseSheet(req.file.path);

    if (!records.length) {
      cleanup();
      return res.status(422).json({
        success: false,
        status: 422,
        message: "Validation error: Unable to process input fields",
        errors: ["The uploaded CSV has no data rows."],
      });
    }

    // Load active Programme master values (shortTitle) once
    const programmes = await AcademicProgram.find({ is_deleted: false }).select("shortTitle").lean();
    const programmeSet = new Set(
      programmes.map((p) => normProgramme(p.shortTitle)).filter(Boolean)
    );

    // Track duplicates within the sheet
    const seenInSheet = new Set();

    const valid = [];
    const invalid = [];

    records.forEach((rec) => {
      const { valid: isValid, errors, data } = validateRecord(rec, programmeSet);
      const rowErrors = [...errors];

      // Duplicate-within-file check (name + programme + academicYear)
      const dupKey = `${data.name.toLowerCase()}|${data.programme.toLowerCase()}|${data.academicYear.toLowerCase()}`;
      if (data.name && seenInSheet.has(dupKey)) {
        rowErrors.push({
          column: DISPLAY_COLUMN.name,
          reason: "Duplicate row within the CSV (same Student Name, Programme & Academic Year).",
        });
      } else if (data.name) {
        seenInSheet.add(dupKey);
      }

      if (rowErrors.length === 0) {
        valid.push({ row: rec.__rowNumber, data });
      } else {
        invalid.push({ row: rec.__rowNumber, errors: rowErrors, data });
      }
    });

    cleanup();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "CSV audit completed.",
      summary: {
        total_rows: records.length,
        valid_count: valid.length,
        invalid_count: invalid.length,
      },
      valid,
      invalid,
    });
  } catch (error) {
    cleanup();
    next(error);
  }
};

// @desc    Import already-validated rows (bulk insert). Re-validates server-side for safety.
// @route   POST /api/gold-medalists/bulk-import   (JSON: { rows: [ { data } ] })
exports.bulkImport = async (req, res, next) => {
  try {
    const rows = (req.body && req.body.rows) || [];
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(422).json({
        success: false,
        status: 422,
        message: "Validation error: Unable to process input fields",
        errors: ["No rows provided to import."],
      });
    }

    // Re-load programme master for server-side safety re-check
    const programmes = await AcademicProgram.find({ is_deleted: false }).select("shortTitle").lean();
    const programmeSet = new Set(
      programmes.map((p) => normProgramme(p.shortTitle)).filter(Boolean)
    );

    const created_by = req.user ? req.user._id : null;
    const now = moment().tz("Asia/Kolkata").toDate();

    const toInsert = [];
    const skipped = [];

    for (const item of rows) {
      const rec = item.data || item;
      const { valid, errors, data } = validateRecord(rec, programmeSet);
      if (!valid) {
        skipped.push({ row: item.row || null, errors, data });
        continue;
      }
      toInsert.push({
        name: data.name,
        programme: data.programme,
        subCourse: data.subCourse,
        academicYear: data.academicYear,
        rank: data.rank,
        rankLabel: data.rankLabel,
        image: data.evidence || "",
        status: "active",
        isActive: true,
        is_deleted: false,
        created_by,
        updated_by: created_by,
        created_at: now,
        updated_at: now,
      });
    }

    let insertedCount = 0;
    if (toInsert.length) {
      // Save individually so pre-save hook (slug/guid generation) runs for each
      for (const doc of toInsert) {
        const medalist = new GoldMedalist(doc);
        await medalist.save();
        insertedCount += 1;
      }
    }

    return res.status(201).json({
      success: true,
      status: 201,
      message: `Bulk import completed. ${insertedCount} record(s) added.`,
      summary: {
        requested: rows.length,
        inserted: insertedCount,
        skipped: skipped.length,
      },
      skipped,
    });
  } catch (error) {
    next(error);
  }
};

