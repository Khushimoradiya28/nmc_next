const express = require('express');
const router = express.Router();

const {
    addDeliveryAddress,
    getAllDeliveryAddress,
    updateDeliveryAddress,
    deleteDeliveryAddress
} = require('../Controller/deliveryAddressController');

router.post('/add', addDeliveryAddress);
router.post('/list', getAllDeliveryAddress);
router.post('/update', updateDeliveryAddress);
router.post('/delete', deleteDeliveryAddress);

module.exports = router;