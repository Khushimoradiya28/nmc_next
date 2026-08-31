const AdmissionLead = require("../Model/admissionLead");
const moment = require("moment-timezone");
const { logActivity } = require("../Utils/activityLogger");

/**
 * Format admission lead with Asia/Kolkata timestamps
 */
const formatAdmissionLead = (item) => {
  const doc = item._doc || item;
  return {
    _id: doc._id,
    full_name: doc.full_name || "",
    mobile: doc.mobile || "",
    email: doc.email || "",
    dob: doc.dob || "",
    gender: doc.gender || "",
    city_village: doc.city_village || "",
    course: doc.course || "",
    last_qualification: doc.last_qualification || "",
    status: doc.status || "pending",
    guid: doc.guid,
    is_deleted: doc.is_deleted ?? false,
    created_at: moment(doc.created_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment(doc.updated_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
  };
};

// @desc    Submit new Admission Application / Lead (Public)
// @route   POST /api/admission/submit or POST /api/admission or POST /api/admission/add
exports.submitAdmissionLead = async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = [];

    const full_name = (body.full_name || body.fullName || "").toString().trim();
    const mobile = (body.mobile || body.mobileNumber || body.phone || "").toString().trim();
    const email = (body.email || body.emailAddress || "").toString().toLowerCase().trim();
    const dob = (body.dob || body.dateOfBirth || "").toString().trim();
    const gender = (body.gender || "").toString().trim();
    const city_village = (body.city_village || body.city || body.village || "").toString().trim();
    const course = (body.course || body.courseInterestedIn || "").toString().trim();
    const last_qualification = (body.last_qualification || body.lastQualification || "").toString().trim();

    if (!full_name) {
      errors.push("full_name is required and cannot be blank.");
    }
    if (!mobile) {
      errors.push("mobile is required and cannot be blank.");
    }
    if (!course) {
      errors.push("course (Course Interested In) is required and cannot be blank.");
    }

    if (errors.length > 0) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors,
      });
    }

    const newLead = new AdmissionLead({
      full_name,
      mobile,
      email,
      dob,
      gender,
      city_village,
      course,
      last_qualification,
      status: "pending",
      created_at: moment().tz("Asia/Kolkata").toDate(),
      updated_at: moment().tz("Asia/Kolkata").toDate(),
    });

    await newLead.save();

    return res.status(201).json({
      success: true,
      status: 201,
      message: "Your admission application has been submitted successfully. Our counselor will get in touch with you shortly.",
      data: formatAdmissionLead(newLead),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all admission leads with filters (Super Admin & Department Only)
// @route   GET /api/admission or POST /api/admission/list
exports.getAdmissionLeads = async (req, res, next) => {
  try {
    const queryParams = req.method === "POST" ? req.body : req.query;
    const {
      page = 1,
      limit = 10,
      search,
      status,
      course,
      city_village,
      gender,
      sort_by = "created_at",
      sort_order = "desc",
    } = queryParams || {};

    const filter = { is_deleted: false };

    if (status && status !== "all") {
      filter.status = status.toLowerCase().trim();
    }

    if (course && course !== "all") {
      filter.course = { $regex: course.trim(), $options: "i" };
    }

    if (gender && gender !== "all") {
      filter.gender = { $regex: new RegExp(`^${gender.trim()}$`, "i") };
    }

    if (city_village && city_village !== "all") {
      filter.city_village = { $regex: city_village.trim(), $options: "i" };
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { full_name: searchRegex },
        { mobile: searchRegex },
        { email: searchRegex },
        { course: searchRegex },
        { city_village: searchRegex },
        { last_qualification: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageLimit = Math.max(1, parseInt(limit) || 10);
    const skip = (pageNum - 1) * pageLimit;
    const sortDirection = sort_order === "asc" ? 1 : -1;

    const [leads, totalCount] = await Promise.all([
      AdmissionLead.find(filter)
        .sort({ [sort_by]: sortDirection })
        .skip(skip)
        .limit(pageLimit),
      AdmissionLead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageLimit) || 1;

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Admission leads fetched successfully.",
      data: leads.map(formatAdmissionLead),
      meta: {
        total_records: totalCount,
        current_page: pageNum,
        total_pages: totalPages,
        limit: pageLimit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single admission lead by ID or GUID
// @route   GET /api/admission/:id
exports.getAdmissionLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !id.toString().trim()) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors: ["Lead ID is required."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id.toString().trim());
    const query = isMongoId
      ? { _id: id.toString().trim(), is_deleted: false }
      : { guid: id.toString().trim(), is_deleted: false };

    const lead = await AdmissionLead.findOne(query);
    if (!lead) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Admission lead not found or has been deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Admission lead fetched successfully.",
      data: formatAdmissionLead(lead),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admission lead status / notes (Super Admin & Department Only)
// @route   PUT /api/admission/:id or POST /api/admission/update
exports.updateAdmissionLead = async (req, res, next) => {
  try {
    const id =
      req.params.id ||
      (req.body && (req.body.id || req.body._id || req.body.guid)) ||
      (req.query && (req.query.id || req.query._id || req.query.guid));

    if (!id || !id.toString().trim()) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors: ["Lead ID is required for update."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id.toString().trim());
    const query = isMongoId
      ? { _id: id.toString().trim(), is_deleted: false }
      : { guid: id.toString().trim(), is_deleted: false };

    const existingLead = await AdmissionLead.findOne(query);
    if (!existingLead) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Admission lead not found or has been deleted.",
      });
    }

    const body = req.body || {};
    const errors = [];

    if (body.status !== undefined && body.status !== null && body.status !== "") {
      const statusLower = body.status.toString().toLowerCase().trim();
      if (!["pending", "in_progress", "contacted", "enrolled", "rejected", "closed"].includes(statusLower)) {
        errors.push("status must be one of: 'pending', 'in_progress', 'contacted', 'enrolled', 'rejected', 'closed'.");
      } else {
        existingLead.status = statusLower;
      }
    }

    if (errors.length > 0) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors,
      });
    }

    if (body.full_name !== undefined) existingLead.full_name = body.full_name.toString().trim();
    if (body.mobile !== undefined) existingLead.mobile = body.mobile.toString().trim();
    if (body.email !== undefined) existingLead.email = body.email.toString().trim();
    if (body.dob !== undefined) existingLead.dob = body.dob.toString().trim();
    if (body.gender !== undefined) existingLead.gender = body.gender.toString().trim();
    if (body.city_village !== undefined) existingLead.city_village = body.city_village.toString().trim();
    if (body.course !== undefined) existingLead.course = body.course.toString().trim();
    if (body.last_qualification !== undefined) existingLead.last_qualification = body.last_qualification.toString().trim();

    existingLead.updated_at = moment().tz("Asia/Kolkata").toDate();
    await existingLead.save();

    // Log Activity
    await logActivity({
      req,
      action: "UPDATE",
      module: "admission_leads",
      record_id: existingLead._id,
      record_title: existingLead.full_name,
      description: `Updated admission application status to '${existingLead.status}'`,
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Admission lead updated successfully.",
      data: formatAdmissionLead(existingLead),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete admission lead (Super Admin Only)
// @route   DELETE /api/admission/:id or POST /api/admission/delete
exports.deleteAdmissionLead = async (req, res, next) => {
  try {
    const id =
      req.params.id ||
      (req.body && (req.body.id || req.body._id || req.body.guid)) ||
      (req.query && (req.query.id || req.query._id || req.query.guid));

    if (!id || !id.toString().trim()) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors: ["Lead ID is required for deletion."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id.toString().trim());
    const query = isMongoId
      ? { _id: id.toString().trim(), is_deleted: false }
      : { guid: id.toString().trim(), is_deleted: false };

    const lead = await AdmissionLead.findOne(query);
    if (!lead) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Admission lead not found or already deleted.",
      });
    }

    lead.is_deleted = true;
    lead.status = "closed";
    lead.isActive = false;
    lead.updated_at = moment().tz("Asia/Kolkata").toDate();
    if (req.user) lead.updated_by = req.user.id;
    await lead.save();

    // Log Activity
    await logActivity({
      req,
      action: "DELETE",
      module: "admission_leads",
      record_id: lead._id,
      record_title: lead.full_name,
      description: `Deleted admission application of '${lead.full_name}'`,
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Admission lead deleted successfully.",
      data: {
        id: lead._id,
        is_deleted: true,
      },
    });
  } catch (error) {
    next(error);
  }
};
