const express = require('express');
const router = express.Router();
const { addCommodity, getAllCommodity, updateCommodity, deleteCommodity } = require('../Controller/commodityController');

// ✅ Routes
router.post('/add', addCommodity);
router.post('/list', getAllCommodity);
router.post('/update', updateCommodity);
router.post('/delete', deleteCommodity);

module.exports = router;