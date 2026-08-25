const express = require('express');
const router = express.Router();
const { addColor, getAllColors, updateColor, deleteColor } = require('../Controller/colorController');
const { getMulterUpload } = require('../Utils/multerStorage');

const upload = getMulterUpload('color');

// ✅ Routes
router.post('/add', addColor);
router.post('/list', getAllColors);
router.post('/update', updateColor);
router.post('/delete', deleteColor);

module.exports = router;