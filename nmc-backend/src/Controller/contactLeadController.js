const ContactLead = require("../Model/contactLead");
const moment = require("moment-timezone");
const { logActivity } = require("../Utils/activityLogger");

/**
 * Format contact lead with Asia/Kolkata timestamps
 */
const formatContactLead = (item) => {
  const doc = item._doc || item;
  return {
    _id: doc._id,
    first_name: doc.first_name || "",
    last_name: doc.last_name || "",
    full_name: `${doc.first_name || ""} ${doc.last_name || ""}`.trim(),
    email: doc.email || "",
    phone: doc.phone || "",
    website: doc.website || "",
    reason: doc.reason || "",
    course: doc.course || "",
    teacher: doc.teacher || "",
    message: doc.message || "",
    source: doc.source || "contact_us",
    status: doc.status || "pending",
    guid: doc.guid,
    is_deleted: doc.is_deleted ?? false,
    created_at: moment(doc.created_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment(doc.updated_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
  };
};

// @desc    Submit new contact inquiry / lead (Public for Frontend Modal & Page)
// @route   POST /api/contact or POST /api/contact/submit or POST /api/contact/add
exports.submitContactLead = async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = [];

    let first_name = (body.first_name || body.firstName || body.fullName || body.name || "").toString().trim();
    let last_name = (body.last_name || body.lastName || "").toString().trim();
    if (!last_name && first_name.includes(" ")) {
      const parts = first_name.split(" ");
      first_name = parts[0];
      last_name = parts.slice(1).join(" ");
    }
    const website = (body.website || "").toString().trim();
    const reason = (body.reason || body.reasonContacting || "").toString().trim();
    const course = (body.course || body.choseCourse || body.chooseCourse || "").toString().trim();
    const teacher = (body.teacher || body.choseTeacher || body.chooseTeacher || "").toString().trim();
    const message = (body.message || body.yourMessage || "").toString().trim();
    const email = (body.email || "").toString().toLowerCase().trim();
    const phone = (body.phone || body.mobile || "").toString().trim();
    const source = (body.source || "contact_us").toString().toLowerCase().trim();

    if (!first_name) {
      errors.push("first_name (or name) is required and cannot be blank.");
    }

    if (errors.length > 0) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors,
      });
    }

    const newLead = new ContactLead({
      first_name,
      last_name,
      email,
      phone,
      website,
      reason,
      course,
      teacher,
      message,
      source: ["modal", "page", "contact_us", "other"].includes(source) ? source : "contact_us",
      status: "pending",
      created_at: moment().tz("Asia/Kolkata").toDate(),
      updated_at: moment().tz("Asia/Kolkata").toDate(),
    });

    await newLead.save();

    return res.status(201).json({
      success: true,
      status: 201,
      message: "Your message has been submitted successfully. Our representative will get back to you within 24 hours.",
      data: formatContactLead(newLead),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact leads with filters (Super Admin & Department only)
// @route   GET /api/contact or POST /api/contact/list
exports.getContactLeads = async (req, res, next) => {
  try {
    const queryParams = req.method === "POST" ? req.body : req.query;
    const {
      page = 1,
      limit = 10,
      search,
      status,
      source,
      course,
      teacher,
      sort_by = "created_at",
      sort_order = "desc",
    } = queryParams || {};

    const filter = { is_deleted: false };

    if (status && status !== "all") {
      filter.status = status.toLowerCase().trim();
    }

    if (source && source !== "all") {
      filter.source = source.toLowerCase().trim();
    }

    if (course && course !== "all") {
      filter.course = { $regex: course.trim(), $options: "i" };
    }

    if (teacher && teacher !== "all") {
      filter.teacher = { $regex: teacher.trim(), $options: "i" };
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { first_name: searchRegex },
        { last_name: searchRegex },
        { website: searchRegex },
        { reason: searchRegex },
        { course: searchRegex },
        { teacher: searchRegex },
        { message: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageLimit = Math.max(1, parseInt(limit) || 10);
    const skip = (pageNum - 1) * pageLimit;
    const sortDirection = sort_order === "asc" ? 1 : -1;

    const [leads, totalCount] = await Promise.all([
      ContactLead.find(filter)
        .sort({ [sort_by]: sortDirection })
        .skip(skip)
        .limit(pageLimit),
      ContactLead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageLimit) || 1;

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Contact leads fetched successfully.",
      data: leads.map(formatContactLead),
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

// @desc    Get single contact lead by ID or GUID
// @route   GET /api/contact/:id
exports.getContactLeadById = async (req, res, next) => {
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

    const lead = await ContactLead.findOne(query);
    if (!lead) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Contact lead not found or has been deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Contact lead fetched successfully.",
      data: formatContactLead(lead),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead status / notes (Super Admin & Department only)
// @route   PUT /api/contact/:id or POST /api/contact/update
exports.updateContactLead = async (req, res, next) => {
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

    const existingLead = await ContactLead.findOne(query);
    if (!existingLead) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Contact lead not found or has been deleted.",
      });
    }

    const body = req.body || {};
    const errors = [];

    if (body.status !== undefined && body.status !== null && body.status !== "") {
      const statusLower = body.status.toString().toLowerCase().trim();
      if (!["pending", "in_progress", "contacted", "closed"].includes(statusLower)) {
        errors.push("status must be one of: 'pending', 'in_progress', 'contacted', 'closed'.");
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

    if (body.first_name !== undefined) existingLead.first_name = body.first_name.toString().trim();
    if (body.last_name !== undefined) existingLead.last_name = body.last_name.toString().trim();
    if (body.website !== undefined) existingLead.website = body.website.toString().trim();
    if (body.reason !== undefined) existingLead.reason = body.reason.toString().trim();
    if (body.course !== undefined) existingLead.course = body.course.toString().trim();
    if (body.teacher !== undefined) existingLead.teacher = body.teacher.toString().trim();
    if (body.message !== undefined) existingLead.message = body.message.toString().trim();

    existingLead.updated_at = moment().tz("Asia/Kolkata").toDate();
    await existingLead.save();

    // Log Activity
    await logActivity({
      req,
      action: "UPDATE",
      module: "contact_leads",
      record_id: existingLead._id,
      record_title: `${existingLead.first_name} ${existingLead.last_name}`.trim(),
      description: `Updated contact lead status to '${existingLead.status}'`,
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Contact lead updated successfully.",
      data: formatContactLead(existingLead),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete contact lead (Super Admin only)
// @route   DELETE /api/contact/:id or POST /api/contact/delete
exports.deleteContactLead = async (req, res, next) => {
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

    const lead = await ContactLead.findOne(query);
    if (!lead) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Contact lead not found or already deleted.",
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
      module: "contact_leads",
      record_id: lead._id,
      record_title: `${lead.first_name} ${lead.last_name}`.trim(),
      description: `Deleted contact lead of '${lead.first_name} ${lead.last_name}'`,
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Contact lead deleted successfully.",
      data: {
        id: lead._id,
        is_deleted: true,
      },
    });
  } catch (error) {
    next(error);
  }
};
