const XLSX = require("xlsx-js-style");
const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");
const Ranker = require("../Model/ranker");
const AcademicProgram = require("../Model/academicProgram");

// Sheet headers: Sr. No. | Academic Year | Programme | Semester / Year | Student Name | University Rank | Achievement | Evidence
const COLUMN_MAP = {
  srNo: ["sr. no.", "sr no", "srno", "sr.no", "sr. no", "sr", "no", "s.no", "s no", "serial", "serial no"],
  academicYear: ["academic year", "academicyear", "academic_year"],
  programme: ["programme", "program", "programme / degree", "degree"],
  semesterYear: ["semester / year", "semester/year", "semester", "sem / year", "sem/year", "sub-course", "subcourse", "sub course"],
  name: ["student name", "studentname", "name", "full name"],
  rankNum: ["university rank", "rank", "universityrank", "rank no", "rank number"],
  rankLabel: ["achievement", "rank label", "ranklabel"],
  evidence: ["evidence", "image", "photo"],
};

const DISPLAY_COLUMN = {
  academicYear: "Academic Year",
  programme: "Programme",
  semesterYear: "Semester / Year",
  name: "Student Name",
  rankNum: "University Rank",
  rankLabel: "Achievement",
  evidence: "Evidence",
};

const norm = (s) => (s || "").toString().trim().toLowerCase().replace(/\s+/g, " ");

// Loose programme comparison: strip dots/spaces/case so "B.A." == "BA" == "b a"
const normProgramme = (s) => (s || "").toString().toLowerCase().replace(/[^a-z0-9&]/g, "");

const resolveField = (rawHeader) => {
  const h = norm(rawHeader);
  for (const [field, aliases] of Object.entries(COLUMN_MAP)) {
    if (aliases.includes(h)) return field;
  }
  return null;
};

// ---- Smart image matching against frontend/public/assets/topper ----
const TOPPER_PUBLIC_DIR = "/assets/topper";
const TOPPER_FS_DIR = path.resolve(__dirname, "../../../frontend/public/assets/topper");

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

const canon = (s) => (s || "").toString().toLowerCase().replace(/[^a-z0-9]/g, "");
const fileLeadingNumber = (fileName) => {
  const m = fileName.match(/^\s*(\d+)\s*[.\-_ ]/);
  return m ? m[1] : null;
};
const fileNamePart = (fileName) => {
  const base = fileName.replace(/\.[^.]+$/, "");
  return base.replace(/^\s*\d+\s*[.\-_ ]*/, "");
};

const matchTopperImage = (srNo, studentName) => {
  const files = getTopperFiles();
  if (!files.length) return "";

  if (srNo) {
    const target = srNo.toString().trim();
    const byNum = files.find((f) => fileLeadingNumber(f) === target);
    if (byNum) return `${TOPPER_PUBLIC_DIR}/${encodeURIComponent(byNum)}`;
  }

  const nameCanon = canon(studentName);
  if (nameCanon) {
    let byName = files.find((f) => canon(fileNamePart(f)) === nameCanon);
    if (byName) return `${TOPPER_PUBLIC_DIR}/${encodeURIComponent(byName)}`;
    byName = files.find((f) => {
      const fc = canon(fileNamePart(f));
      return fc && (fc.includes(nameCanon) || nameCanon.includes(fc));
    });
    if (byName) return `${TOPPER_PUBLIC_DIR}/${encodeURIComponent(byName)}`;
  }
  return "";
};

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

// Parse CSV/XLSX file into records keyed by model field, keeping the sheet row number.
// CSV is parsed as plain text (avoids xlsx coercing values like "2011-12" into date serials).
const parseSheet = (filePath) => {
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
  const colFieldByIndex = headerRow.map((h) => resolveField(h));

  const records = [];
  for (let i = 1; i < rows.length; i++) {
    const rowArr = rows[i];
    if (!rowArr || rowArr.every((c) => (c || "").toString().trim() === "")) continue;
    const rec = { __rowNumber: i + 1 };
    colFieldByIndex.forEach((field, idx) => {
      if (field) {
        rec[field] = rowArr[idx] !== undefined && rowArr[idx] !== null ? rowArr[idx].toString().trim() : "";
      }
    });
    records.push(rec);
  }
  return { headers: headerRow, records };
};

// Validate a single record; returns { valid, errors:[{column,reason}], data }
const validateRecord = (rec, programmeSet) => {
  const errors = [];

  const academicYear = (rec.academicYear || "").trim();
  const programme = (rec.programme || "").trim();
  const semesterYear = (rec.semesterYear || "").trim();
  const name = (rec.name || "").trim();
  const rankRaw = (rec.rankNum || "").toString().trim();
  const rankLabel = (rec.rankLabel || "").trim() || "University Rank Holder";
  const srNo = (rec.srNo || "").toString().trim();

  if (!name) errors.push({ column: DISPLAY_COLUMN.name, reason: "Student Name is required and cannot be blank." });
  if (!programme) errors.push({ column: DISPLAY_COLUMN.programme, reason: "Programme is required and cannot be blank." });
  if (!semesterYear) errors.push({ column: DISPLAY_COLUMN.semesterYear, reason: "Semester / Year is required and cannot be blank." });
  if (!academicYear) {
    errors.push({ column: DISPLAY_COLUMN.academicYear, reason: "Academic Year is required and cannot be blank." });
  } else if (!/^\d{4}-\d{2,4}$/.test(academicYear)) {
    errors.push({ column: DISPLAY_COLUMN.academicYear, reason: `Academic Year "${academicYear}" is invalid. Use a range like 2011-12.` });
  }

  let rankNum = null;
  if (!rankRaw) {
    errors.push({ column: DISPLAY_COLUMN.rankNum, reason: "University Rank is required and cannot be blank." });
  } else {
    // Accept numeric or ordinal like "1ST", "2ND"
    const digits = rankRaw.replace(/[^0-9]/g, "");
    rankNum = parseInt(digits);
    if (isNaN(rankNum) || rankNum < 1) {
      errors.push({ column: DISPLAY_COLUMN.rankNum, reason: `University Rank "${rankRaw}" is invalid. Use a number like 1, 2, 3.` });
    }
  }

  if (programme && programmeSet && programmeSet.size > 0 && !programmeSet.has(normProgramme(programme))) {
    errors.push({
      column: DISPLAY_COLUMN.programme,
      reason: `Programme "${programme}" does not exist in the Academic Programs master. Please create "${programme}" in Academic Programs first or update it.`,
    });
  }

  // Evidence (optional) -> smart match by Sr.No + name, or normalize provided value
  const rawEvidence = (rec.evidence || "").trim();
  let evidence = "";
  if (rawEvidence) {
    if (/^https?:\/\//i.test(rawEvidence) || rawEvidence.startsWith("/assets/")) {
      evidence = rawEvidence;
    } else {
      const fileName = rawEvidence.replace(/^[\\/]+/, "").replace(/^assets[\\/]toppers?[\\/]/i, "");
      evidence = matchTopperImage(srNo, fileName) || `/assets/topper/${encodeURIComponent(fileName)}`;
    }
  } else {
    evidence = matchTopperImage(srNo, name);
  }

  const data = { name, programme, semesterYear, academicYear, rankNum, rankLabel, evidence };
  return { valid: errors.length === 0, errors, data };
};

// @desc  Validate (audit) an uploaded CSV/XLSX without inserting
// @route POST /api/rankers/bulk-validate  (multipart: file)
exports.bulkValidate = async (req, res, next) => {
  const cleanup = () => {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
    }
  };

  try {
    _topperFilesCache = null;
    if (!req.file) {
      return res.status(422).json({
        success: false, status: 422,
        message: "Validation error: Unable to process input fields",
        errors: ["A file is required. Please upload a .csv, .xlsx or .xls file."],
      });
    }

    const originalName = (req.file.originalname || "").toLowerCase();
    const allowedExts = [".csv", ".xlsx", ".xls"];
    if (!allowedExts.some((ext) => originalName.endsWith(ext))) {
      cleanup();
      return res.status(422).json({
        success: false, status: 422,
        message: "Validation error: Unable to process input fields",
        errors: ["Only .csv, .xlsx or .xls files are allowed for bulk import."],
      });
    }

    const { records } = parseSheet(req.file.path);
    if (!records.length) {
      cleanup();
      return res.status(422).json({
        success: false, status: 422,
        message: "Validation error: Unable to process input fields",
        errors: ["The uploaded file has no data rows."],
      });
    }

    const programmes = await AcademicProgram.find({ is_deleted: false }).select("shortTitle fullName").lean();
    const programmeSet = new Set();
    programmes.forEach((p) => {
      if (p.shortTitle) programmeSet.add(normProgramme(p.shortTitle));
      if (p.fullName) programmeSet.add(normProgramme(p.fullName));
    });

    const seenInSheet = new Set();
    const valid = [];
    const invalid = [];

    records.forEach((rec) => {
      const { errors, data } = validateRecord(rec, programmeSet);
      const rowErrors = [...errors];

      // Duplicate within file: name + semesterYear + academicYear + rankNum
      const dupKey = `${data.name.toLowerCase()}|${data.semesterYear.toLowerCase()}|${data.academicYear.toLowerCase()}|${data.rankNum}`;
      if (data.name && seenInSheet.has(dupKey)) {
        rowErrors.push({ column: DISPLAY_COLUMN.name, reason: "Duplicate row within the file (same Student Name, Semester/Year, Academic Year & Rank)." });
      } else if (data.name) {
        seenInSheet.add(dupKey);
      }

      if (rowErrors.length === 0) valid.push({ row: rec.__rowNumber, data });
      else invalid.push({ row: rec.__rowNumber, errors: rowErrors, data });
    });

    cleanup();

    return res.status(200).json({
      success: true, status: 200,
      message: "File audit completed.",
      summary: { total_rows: records.length, valid_count: valid.length, invalid_count: invalid.length },
      valid, invalid,
    });
  } catch (error) {
    cleanup();
    next(error);
  }
};

// @desc  Import validated rows (re-validated server-side)
// @route POST /api/rankers/bulk-import   (JSON: { rows: [{ data }] })
exports.bulkImport = async (req, res, next) => {
  try {
    const rows = (req.body && req.body.rows) || [];
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(422).json({
        success: false, status: 422,
        message: "Validation error: Unable to process input fields",
        errors: ["No rows provided to import."],
      });
    }

    const programmes = await AcademicProgram.find({ is_deleted: false }).select("shortTitle fullName").lean();
    const programmeSet = new Set();
    programmes.forEach((p) => {
      if (p.shortTitle) programmeSet.add(normProgramme(p.shortTitle));
      if (p.fullName) programmeSet.add(normProgramme(p.fullName));
    });

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
        semesterYear: data.semesterYear,
        academicYear: data.academicYear,
        rankNum: data.rankNum,
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
    for (const doc of toInsert) {
      const ranker = new Ranker(doc);
      await ranker.save();
      insertedCount += 1;
    }

    return res.status(201).json({
      success: true, status: 201,
      message: `Bulk import completed. ${insertedCount} record(s) added.`,
      summary: { requested: rows.length, inserted: insertedCount, skipped: skipped.length },
      skipped,
    });
  } catch (error) {
    next(error);
  }
};

