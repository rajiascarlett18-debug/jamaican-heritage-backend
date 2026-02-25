const express = require('express');
const router = express.Router();

const protect = require('../middleware/auth.middleware');

const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart
} = require('../controllers/cart.controller');

/*
  POST    /api/cart        -> Add item to cart
  GET     /api/cart        -> Get user's cart
  DELETE  /api/cart/:id    -> Remove single cart item
  DELETE  /api/cart        -> Clear entire cart
*/

router.post('/', protect, addToCart);
router.get('/', protect, getCart);
router.delete('/:id', protect, removeFromCart);
router.delete('/', protect, clearCart);

module.exports = router;