const Contact = require("../Model/contact");
const moment = require("moment-timezone");

/**
 * Format contact record for client response with Asia/Kolkata timezone
 */
const formatContact = (item) => {
  const doc = item._doc || item;
  return {
    ...doc,
    created_at: moment(doc.created_at || doc.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment(doc.updated_at || doc.updatedAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
  };
};

// @desc    Submit a new contact / inquiry (from contact page OR popup modal)
// @route   POST /api/contact
// @route   POST /api/contacts
// @access  Public
exports.createContact = async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = [];

    const firstName = (body.firstName || body.first_name || "").toString().trim();
    const lastName  = (body.lastName  || body.last_name  || "").toString().trim();
    const website   = (body.website   || "").toString().trim();
    const reason    = (body.reason    || "").toString().trim();
    const course    = (body.course    || "").toString().trim();
    const teacher   = (body.teacher   || "").toString().trim();
    const message   = (body.message   || "").toString().trim();

    if (!firstName) errors.push("First name is required and cannot be blank.");
    if (!lastName)  errors.push("Last name is required and cannot be blank.");
    if (!reason)    errors.push("Reason is required and cannot be blank.");
    if (!course)    errors.push("Course is required and cannot be blank.");
    if (!teacher)   errors.push("Teacher/Department is required and cannot be blank.");

    if (errors.length > 0) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors,
      });
    }

    const created_by = req.user ? req.user._id : (body.created_by || null);

    const newContact = new Contact({
      firstName,
      lastName,
      website,
      reason,
      course,
      teacher,
      message,
      isActive: true,
      status: "active",
      created_by,
      updated_by: created_by,
      created_at: moment().tz("Asia/Kolkata").toDate(),
      updated_at: moment().tz("Asia/Kolkata").toDate(),
    });

    await newContact.save();

    return res.status(201).json({
      status: 201,
      success: true,
      message: "Message submitted successfully. Our representative will get back to you within 24 hours.",
      data: formatContact(newContact),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact inquiries (paginated, searchable)
// @route   GET /api/contacts
// @route   POST /api/contacts/list
// @access  Admin
exports.getContacts = async (req, res, next) => {
  try {
    const queryParams = req.method === "POST" ? req.body : req.query;
    const {
      search = "",
      status,
      page = 1,
      limit = 10,
      sort_by = "created_at",
      sort_order = "desc",
    } = queryParams || {};

    const filter = { is_deleted: false };

    if (status) filter.status = status.toLowerCase().trim();

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { firstName: searchRegex },
        { lastName:  searchRegex },
        { course:    searchRegex },
        { reason:    searchRegex },
        { message:   searchRegex },
      ];
    }

    const pageNum    = Math.max(1, parseInt(page));
    const limitNum   = Math.max(1, parseInt(limit));
    const skip       = (pageNum - 1) * limitNum;
    const sortDir    = sort_order === "asc" ? 1 : -1;
    const sortOption = { [sort_by]: sortDir };

    const [contacts, totalRecords] = await Promise.all([
      Contact.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Contact.countDocuments(filter),
    ]);

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Contact inquiries fetched successfully.",
      data: contacts.map(formatContact),
      meta: {
        total_records: totalRecords,
        current_page: pageNum,
        total_pages: Math.ceil(totalRecords / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact by ID or Slug
// @route   GET /api/contacts/:idOrSlug
// @access  Admin
exports.getContactById = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    if (!idOrSlug) {
      return res.status(400).json({ status: 400, success: false, message: "ID or slug is required." });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const contact = await Contact.findOne(query);
    if (!contact) {
      return res.status(404).json({ status: 404, success: false, message: "Contact not found." });
    }

    return res.status(200).json({ status: 200, success: true, data: formatContact(contact) });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete contact by ID or Slug
// @route   DELETE /api/contacts/:idOrSlug
// @route   POST /api/contacts/delete
// @access  Admin
exports.deleteContact = async (req, res, next) => {
  try {
    const idOrSlug = req.params.idOrSlug || req.params.id || (req.body && (req.body.id || req.body.slug));
    if (!idOrSlug) {
      return res.status(400).json({ status: 400, success: false, message: "ID or slug is required." });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const contact = await Contact.findOne(query);
    if (!contact) {
      return res.status(404).json({ status: 404, success: false, message: "Contact not found or already deleted." });
    }

    contact.is_deleted = true;
    contact.status     = "inactive";
    contact.isActive   = false;
    contact.updated_at = moment().tz("Asia/Kolkata").toDate();
    if (req.user) contact.updated_by = req.user._id;

    await contact.save();

    return res.status(200).json({
      status: 200, success: true,
      message: "Contact deleted successfully.",
      data: { id: contact._id, slug: contact.slug, is_deleted: true },
    });
  } catch (error) {
    next(error);
  }
};
