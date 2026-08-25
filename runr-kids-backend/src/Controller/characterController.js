const Character = require("../Model/character");
const config = require("../Config/app");
const { generateSlug } = require("../helper");
const { saveLocalAndCreateWebp, uploadToS3AndCreateWebp, deleteLocalImages, deleteS3Objects } = require("../Utils/imageProcessor");
const moment = require("moment-timezone");

exports.addCharacter = async (req, res, next) => {
  try {
    const body = req.body || {};

    if (body.character_name) {
      body.character_slug = generateSlug(body.character_name);
    }

    if (req.file) {
      if (config.NODE_ENV === "production") {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "character");
        body.character_image = uploadResult.originalKey; 
        body.character_image_webp = uploadResult.webpKey;
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "character");
        body.character_image = result.originalPath;
        body.character_image_webp = result.webpPath;
      }
    }

    const character = await Character.create(body);

    res.status(200).json({
      status: 200,
      message: "Character added successfully",
      data: character,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllCharacters = async (req, res, next) => {
  try {
    const { status, search, limit, offset, sort_by, sort_order,type,_id} = req.body || {};

     let statusFilter;
      if (Array.isArray(status)) {
        statusFilter = status.length ? status : [1, 0];
      } else if (status !== undefined && status !== null && status !== "") {
        statusFilter = [Number(status)]; 
      } else {
        statusFilter = [1, 0]; 
      }
    let query = { status: { $in: statusFilter } };
    if (_id) {
      query._id = _id;
    }
    if (search) {
      query.character_name = { $regex: search, $options: "i" };    
    }
    let selectFields = {};
    if (type) {
      selectFields[type] = 1;
      selectFields["_id"] = 1; 
    }

    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;

    const sortField = sort_by || "createdAt";  
    const sortDirection = sort_order === "asc" ? 1 : -1; 

    let characterQuery = Character.find(query).select(selectFields);

    // If type NOT passed → include created_by / updated_by data
    if (!type) {
      characterQuery = characterQuery
        .populate({ path: "created_by", select: "first_name last_name" })
        .populate({ path: "updated_by", select: "first_name last_name" });
    }

    characterQuery = characterQuery
      .sort({ [sortField]: sortDirection })
      .skip(pageOffset);
      
    if (pageLimit > 0) {
      characterQuery = characterQuery.limit(pageLimit);
    }

    const character = await characterQuery;
    const count = await Character.countDocuments(query);

     if (type) {
      return res.status(200).json({
        status: 200,
        message: "Characters fetched successfully",
        total: count,
        data: character,
      });
    }
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const s3Url = "https://runrkids.s3.ap-south-1.amazonaws.com/media/character";

    const characters = character.map((character) => {
    const fileName = character.character_image ? character.character_image.split('/').pop() : null;
    
      return {
        ...character.toObject(),
        character_image: character.character_image
          ? config.NODE_ENV === "production"
            ? `${s3Url}/${fileName}`
            : `${baseUrl}/media/character/${fileName}`
          : null,
        created_at: moment(character.created_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment(character.updated_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
        created_by: character.created_by ? character.created_by._id : null, // just ID
        created_by_name: character.created_by
            ? `${character.created_by.first_name} ${character.created_by.last_name}`
            : null, // full name
        updated_by: character.updated_by ? character.updated_by._id : null,
        updated_by_name: character.updated_by
            ? `${character.updated_by.first_name} ${character.updated_by.last_name}`
            : null
      };
    });

    res.status(200).json({
      status: 200,
      message: "Characters fetched successfully",
      total: count,
      data: characters,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCharacter = async (req, res, next) => {
  if (!req.body || !req.body.id) {
    return res.status(400).json({
      status: 400,
      error: { id: ["ID field is required."] },
    });
  }

  try {
    const { id } = req.body;
    const body = req.body || {};

    const existingCharacter = await Character.findById(id);
    if (!existingCharacter) {
      return res.status(404).json({
        status: 404,
        message: "Character not found",
      });
    }

    if (req.file) {
      if (config.NODE_ENV === "production") {
        const oldKeys = [];
        if (existingCharacter.character_image)
          oldKeys.push(existingCharacter.character_image.split('/').pop());
        if (existingCharacter.character_image_webp)
          oldKeys.push(existingCharacter.character_image_webp.split('/').pop());
        if (oldKeys.length > 0) {
          await deleteS3Objects(oldKeys, "character");
        }
      } else {
        if (existingCharacter.character_image) {
          deleteLocalImages(existingCharacter.character_image);
        }
        if (existingCharacter.character_image_webp) {
          deleteLocalImages(existingCharacter.character_image_webp);
        }
      }

      if (config.NODE_ENV === "production") {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "character");
        body.character_image = uploadResult.originalKey; 
        body.character_image_webp = uploadResult.webpKey;
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "character");
        body.character_image = result.originalPath;
        body.character_image_webp = result.webpPath;
      }
    }
    body.updated_at = Date.now();
    const updateCharacter = await Character.findByIdAndUpdate(id, body, { new: true });

    res.status(200).json({
      status: 200,
      message: "Character updated successfully",
      data: updateCharacter,
    });

  } catch (err) {
    next(err);
  }
};

exports.deleteCharacter = async (req, res, next) => {
  if (!req.body || !req.body.id) {
    return res.status(400).json({
      status: 400,
      message: "Character ID is required",
    });
  }

  try {
    const { id } = req.body;

    const character = await Character.findByIdAndUpdate(
      id,
      { status: 0, updated_at: Date.now() },
      { new: true }
    );

    if (!character) {
      return res.status(404).json({ message: "Character not found"});
    }

    res.status(200).json({
      status: 200,
      message: "Character deleted successfully",
      data: character,
    });
  } catch (err) {
    next(err);
  }
};