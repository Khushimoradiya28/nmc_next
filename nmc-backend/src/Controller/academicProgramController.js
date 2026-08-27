const AcademicProgram = require('../Model/academicProgram');
const crypto = require('crypto');

function slugifyText(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function generateGuid() {
  return crypto.randomBytes(6).toString('hex');
}

const generateUniqueSlug = async (text, currentId = null) => {
  let baseSlug = slugifyText(text) || 'program';
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const query = { slug, is_deleted: false };
    if (currentId) {
      query['_id'] = { $ne: currentId };
    }
    const existing = await AcademicProgram.findOne(query);
    if (!existing) break;
    slug = baseSlug + '-' + count++;
  }
  return slug;
};

// 422 Unprocessable Entity Validation Helper
const validateProgramInputs = (data, isUpdate = false) => {
  const errors = [];
  const validProgramTypes = ['ug', 'pg', 'diploma'];
  const validStatuses = ['active', 'inactive'];

  if (!isUpdate || data.programType !== undefined) {
    if (!data.programType || typeof data.programType !== 'string' || !data.programType.trim()) {
      errors.push('programType is required and cannot be blank (e.g. ug, pg, diploma).');
    } else if (!validProgramTypes.includes(data.programType.toLowerCase())) {
      errors.push('Invalid programType. Allowed values: ' + validProgramTypes.join(', '));
    }
  }

  if (!isUpdate || data.shortTitle !== undefined) {
    if (!data.shortTitle || typeof data.shortTitle !== 'string' || !data.shortTitle.trim()) {
      errors.push('shortTitle is required and cannot be blank (e.g. B.B.A.).');
    }
  }

  if (!isUpdate || data.fullName !== undefined) {
    if (!data.fullName || typeof data.fullName !== 'string' || !data.fullName.trim()) {
      errors.push('fullName is required and cannot be blank (e.g. Bachelor of Business Administration).');
    }
  }

  if (!isUpdate || data.description !== undefined) {
    if (!data.description || typeof data.description !== 'string' || !data.description.trim()) {
      errors.push('description is required and cannot be blank.');
    }
  }

  if (!isUpdate || data.duration !== undefined) {
    if (!data.duration || typeof data.duration !== 'string' || !data.duration.trim()) {
      errors.push('duration is required and cannot be blank (e.g. 3 Years (6 Sems)).');
    }
  }

  if (!isUpdate || data.fees !== undefined) {
    if (!data.fees || typeof data.fees !== 'string' || !data.fees.trim()) {
      errors.push('fees is required and cannot be blank (e.g. ₹8,000 / Sem).');
    }
  }

  if (data.status !== undefined) {
    if (!validStatuses.includes(data.status)) {
      errors.push('Invalid status. Allowed values: ' + validStatuses.join(', '));
    }
  }

  if (data.sort_order !== undefined && data.sort_order !== null && data.sort_order !== '') {
    const num = Number(data.sort_order);
    if (isNaN(num) || num < 0) {
      errors.push('sort_order must be a valid positive number.');
    }
  }

  return errors;
};

// 1. Get All Academic Programs
exports.getAllPrograms = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = '',
      status = '',
      programType = '',
    } = req.query;

    const query = { is_deleted: false };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (programType && programType !== 'all') {
      query.programType = programType.toLowerCase();
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query['$or'] = [
        { shortTitle: searchRegex },
        { fullName: searchRegex },
        { degreeBadge: searchRegex },
        { description: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 50);
    const skip = (pageNum - 1) * limitNum;

    const [programs, total] = await Promise.all([
      AcademicProgram.find(query)
        .sort({ sort_order: 1, created_at: -1 })
        .skip(skip)
        .limit(limitNum),
      AcademicProgram.countDocuments(query),
    ]);

    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Academic programs fetched successfully',
      data: programs,
      programs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// 2. Get Single Program by Slug or ID
exports.getProgramById = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== 'string' || !slug.trim()) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: 'Program slug or ID is required.',
      });
    }

    const query = {
      is_deleted: false,
    };
    
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      query['$or'] = [{ _id: slug }, { slug: slug }];
    } else {
      query.slug = slug.trim();
    }

    const program = await AcademicProgram.findOne(query);

    if (!program) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Academic program not found.',
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Academic program fetched successfully',
      data: program,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// 3. Create New Academic Program
exports.addProgram = async (req, res) => {
  try {
    const errors = validateProgramInputs(req.body, false);

    if (errors.length > 0) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: 'Validation error: Unable to process input fields',
        errors,
      });
    }

    const {
      programType,
      degreeBadge,
      shortTitle,
      fullName,
      description,
      highlights,
      duration,
      fees,
      sort_order,
      status,
      isActive,
    } = req.body;

    let parsedHighlights = [];
    if (Array.isArray(highlights)) {
      parsedHighlights = highlights.map((c) => String(c).trim()).filter((point) => point.length > 0);
    } else if (typeof highlights === 'string' && highlights.trim() !== '') {
      try {
        const p = JSON.parse(highlights);
        if (Array.isArray(p)) {
          parsedHighlights = p.map((c) => String(c).trim()).filter((point) => point.length > 0);
        } else {
          parsedHighlights = [String(p).trim()].filter(Boolean);
        }
      } catch (e) {
        parsedHighlights = highlights.split('\n').map((h) => h.trim()).filter((h) => h.length > 0);
      }
    }

    const slug = await generateUniqueSlug(shortTitle + ' ' + fullName);

    const newProgram = new AcademicProgram({
      programType: programType.toLowerCase().trim(),
      degreeBadge: (degreeBadge || 'UG DEGREE').trim(),
      shortTitle: shortTitle.trim(),
      fullName: fullName.trim(),
      description: description.trim(),
      highlights: parsedHighlights,
      duration: duration.trim(),
      fees: fees.trim(),
      sort_order: (sort_order !== undefined && sort_order !== null && sort_order !== '') ? Number(sort_order) : 1,
      status: status || 'active',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      guid: generateGuid(),
      slug,
    });

    await newProgram.save();

    return res.status(201).json({
      status: 201,
      success: true,
      message: 'Academic program created successfully',
      data: newProgram,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// 4. Update Academic Program
exports.updateProgram = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== 'string' || !slug.trim()) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: 'Program slug or ID is required to update.',
      });
    }

    const errors = validateProgramInputs(req.body, true);

    if (errors.length > 0) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: 'Validation error: Unable to process input fields',
        errors,
      });
    }

    const query = {
      is_deleted: false,
    };
    
    if (slug.trim().match(/^[0-9a-fA-F]{24}$/)) {
      query['$or'] = [{ _id: slug.trim() }, { slug: slug.trim() }];
    } else {
      query.slug = slug.trim();
    }

    const existingProgram = await AcademicProgram.findOne(query);

    if (!existingProgram) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Academic program not found to update',
      });
    }

    const {
      programType,
      degreeBadge,
      shortTitle,
      fullName,
      description,
      highlights,
      duration,
      fees,
      sort_order,
      status,
      isActive,
    } = req.body;

    if (programType !== undefined) existingProgram.programType = programType.toLowerCase().trim();
    if (degreeBadge !== undefined) existingProgram.degreeBadge = degreeBadge.trim();
    if (description !== undefined) existingProgram.description = description.trim();
    if (duration !== undefined) existingProgram.duration = duration.trim();
    if (fees !== undefined) existingProgram.fees = fees.trim();
    if (sort_order !== undefined && sort_order !== null && sort_order !== '') {
      existingProgram.sort_order = Number(sort_order);
    }
    if (status !== undefined) existingProgram.status = status;
    if (isActive !== undefined) existingProgram.isActive = Boolean(isActive);

    if (shortTitle !== undefined && shortTitle.trim() !== existingProgram.shortTitle) {
      existingProgram.shortTitle = shortTitle.trim();
      existingProgram.slug = await generateUniqueSlug(
        shortTitle + ' ' + (fullName || existingProgram.fullName),
        existingProgram._id
      );
    }

    if (fullName !== undefined && fullName.trim() !== existingProgram.fullName) {
      existingProgram.fullName = fullName.trim();
    }

    if (highlights !== undefined) {
      if (Array.isArray(highlights)) {
        existingProgram.highlights = highlights.map((c) => String(c).trim()).filter((point) => point.length > 0);
      } else if (typeof highlights === 'string') {
        try {
          const p = JSON.parse(highlights);
          if (Array.isArray(p)) {
            existingProgram.highlights = p.map((c) => String(c).trim()).filter((point) => point.length > 0);
          } else {
            existingProgram.highlights = [String(p).trim()].filter(Boolean);
          }
        } catch (e) {
          existingProgram.highlights = highlights.split('\n').map((h) => h.trim()).filter((h) => h.length > 0);
        }
      }
    }

    await existingProgram.save();

    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Academic program updated successfully',
      data: existingProgram,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// 5. Delete Academic Program (Soft Delete)
exports.deleteProgram = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== 'string' || !slug.trim()) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: 'Program slug or ID is required to delete.',
      });
    }

    const query = {
      is_deleted: false,
    };
    
    if (slug.trim().match(/^[0-9a-fA-F]{24}$/)) {
      query['$or'] = [{ _id: slug.trim() }, { slug: slug.trim() }];
    } else {
      query.slug = slug.trim();
    }

    const program = await AcademicProgram.findOneAndUpdate(
      query,
      { is_deleted: true, status: 'inactive', isActive: false },
      { new: true }
    );

    if (!program) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Academic program not found to delete',
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Academic program deleted successfully',
      data: { slug: program.slug, _id: program._id },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
