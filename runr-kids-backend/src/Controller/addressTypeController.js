const AddressType = require("../Model/addressType");

exports.addAddressType = async (req, res, next) => {
  try {
    const addressType = await AddressType.create(req.body);

    res.status(200).json({
      status: 200,
      message: "Address Type added successfully",
      data: addressType,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllAddressType = async (req, res, next) => {
  try {
    const { status, search, limit, offset, sort_by, sort_order } = req.body || {};

    const statusFilter = status && status.length ? status : ["1", "0"];
    let query = { status: { $in: statusFilter } };

    if (search) {
      query.address_type = { $regex: search, $options: "i" };
    }

    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;

    const sortField = sort_by || "created_at";
    const sortDirection = sort_order === "asc" ? 1 : -1;

    let addressTypeQuery = AddressType.find(query)
      .sort({ [sortField]: sortDirection })
      .skip(pageOffset);

    if (pageLimit > 0) {
      addressTypeQuery = addressTypeQuery.limit(pageLimit);
    }

    const addressTypes = await addressTypeQuery;
    const count = await AddressType.countDocuments(query);

    res.status(200).json({
      message: "Address Types fetched successfully",
      status: 200,
      count,
      data: addressTypes,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAddressType = async (req, res, next) => {
  // ✅ Step 1: Always check ID first (before try-catch)
  if (!req.body || !req.body.id) {
    return res.status(400).json({
      status: 400,
      error: { id: ["ID field is required."] },
    });
  }

  try {
    const { id, address_type, status } = req.body;

    const updateData = {};
    if (address_type !== undefined) updateData.address_type = address_type;
    if (status !== undefined) updateData.status = status;
    updateData.updated_at = Date.now();

    const type = await AddressType.findByIdAndUpdate(id, updateData, { new: true });

    if (!type) {
      return res.status(404).json({
        status: 404,
        error: { message: "Address Type not found." },
      });
    }

    res.status(200).json({
      status: 200,
      message: "Address Type updated successfully",
      data: type,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAddressType = async (req, res, next) => {
  // ✅ Step 1: Always check ID first (before try-catch)
  if (!req.body || !req.body.id) {
    return res.status(400).json({
      status: 400,
      error: { id: ["ID field is required."] },
    });
  }

  try {
    const { id } = req.body;

    const type = await AddressType.findByIdAndDelete(
      id,
      { status: 0, updated_at: Date.now() },
      { new: true } 
    );
    if (!type) {
      return res.status(404).json({
        status: 404,
        error: { message: "Address Type not found." },
      });
    }

    res.status(200).json({
      status: 200,
      message: "Address Type deleted successfully",
      data: type,
    });
  } catch (error) {
    next(error);
  }
};