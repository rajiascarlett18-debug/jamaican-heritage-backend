const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');

const {
  createOrder,
  getUserOrders
} = require('../controllers/order.controller');

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);

module.exports = router;