const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../config/db');

exports.createPaymentIntent = async (req, res) => {
  try {

    const userId = req.user.id;

    const [cartItems] = await pool.query(
      `SELECT c.quantity, p.price
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;

    cartItems.forEach(item => {
      total += item.price * item.quantity;
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe needs cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Stripe error' });
  }
};