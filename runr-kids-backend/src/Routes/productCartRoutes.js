const express = require('express');
const router = express.Router();

const { addToCart, getAllCarts, removeFromCart, updateCartVisitor, updateCart, getCartSummary } = require('../Controller/productCartController');

router.post('/add', addToCart);
router.post('/list', getAllCarts);
router.post('/remove', removeFromCart);
router.post('/updatevisitor', updateCartVisitor);
router.post('/update', updateCart);
const { verifyToken } = require('../Middleware/authMiddleware');

router.post('/summary', verifyToken, getCartSummary);

module.exports = router;