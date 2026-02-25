const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const { createPaymentIntent } = require('../controllers/payment.controller');

router.post('/create-intent', protect, createPaymentIntent);

module.exports = router;