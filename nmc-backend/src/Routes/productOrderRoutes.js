const express = require('express');
const router = express.Router();

const { orderSummary, verifyPayment, paymentFailure, getAllOrder, getOrderRevenueSummary, getOrderStatusCounts, getCategoryOrderStats, getBrandOrderStats, cancelOrder, getHighestSellingProducts, manageOrder, resendInvoiceEmail, resendCancellationEmail } = require('../Controller/productOrderController');

router.post('/ordersummary', orderSummary);
router.post('/payment/verify', verifyPayment);
router.post('/payment/failure', paymentFailure);
router.post('/list', getAllOrder);
router.post('/revenue-summary', getOrderRevenueSummary);
router.post('/order-status', getOrderStatusCounts);
router.post('/category-stats', getCategoryOrderStats);
router.post('/brand-stats', getBrandOrderStats);
router.post('/highest-selling-products', getHighestSellingProducts);
router.post('/cancel-order', cancelOrder);
router.post('/manage-order', manageOrder);
router.post('/manage-invoice-email', resendInvoiceEmail);
router.post('/manage-cancellation-email', resendCancellationEmail);

module.exports = router;