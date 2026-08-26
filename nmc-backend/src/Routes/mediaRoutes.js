const express = require("express");
const router = express.Router();
const { fileUpload} = require('../Utils/fileupload');

const {
  getAllMedia,
  addMedia,
  deleteMedia,
  updateMedia
} = require("../Controller/mediaController");

router.post("/list", getAllMedia);
router.post("/delete", deleteMedia);
router.post('/add', fileUpload('media_images')('media_file'), addMedia);
router.post('/update', fileUpload('media_images')('media_file'), updateMedia);
module.exports = router;
