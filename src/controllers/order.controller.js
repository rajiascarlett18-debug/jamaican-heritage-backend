const pool = require('../config/db');

/* =========================
   CREATE ORDER (After Stripe Success)
========================= */
exports.createOrder = async (req, res) => {

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const userId = req.user.id;
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        message: "Payment confirmation required"
      });
    }

    // Get cart items
    const [cartItems] = await connection.query(
      `SELECT 
        c.product_id,
        c.quantity,
        p.price,
        p.stock
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;

    // Validate stock + calculate total
    for (const item of cartItems) {

      if (item.stock < item.quantity) {
        throw new Error(`Not enough stock for product ${item.product_id}`);
      }

      total += item.price * item.quantity;
    }

    // Insert order as PAID
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
        (user_id, total, status, payment_intent_id)
       VALUES (?, ?, ?, ?)`,
      [userId, total, 'paid', paymentIntentId]
    );

    const orderId = orderResult.insertId;

    // Insert order items + reduce stock
    for (const item of cartItems) {

      await connection.query(
        `INSERT INTO order_items
          (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );

      await connection.query(
        `UPDATE products
         SET stock = stock - ?
         WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await connection.query(
      `DELETE FROM cart_items WHERE user_id = ?`,
      [userId]
    );

    await connection.commit();

    res.status(201).json({
      orderId,
      total,
      status: "paid"
    });

  } catch (error) {

    await connection.rollback();
    console.error(error);

    res.status(500).json({
      message: "Order creation failed"
    });

  } finally {
    connection.release();
  }
};


/* =========================
   GET USER ORDERS
========================= */
exports.getUserOrders = async (req, res) => {
  try {

    const userId = req.user.id;

    const [orders] = await pool.query(
      `SELECT id, total, status, payment_intent_id, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    for (let order of orders) {

      const [items] = await pool.query(
        `SELECT 
          oi.quantity,
          oi.price,
          p.name,
          p.image
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );

      order.items = items;
    }

    res.json(orders);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};