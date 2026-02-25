const pool = require('../config/db');

/* =========================
   ADD TO CART
========================= */
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product ID and quantity required" });
    }

    // Check product exists
    const [products] = await pool.query(
      "SELECT id, stock FROM products WHERE id = ?",
      [productId]
    );

    if (!products.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (products[0].stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Check if product already in cart
    const [existing] = await pool.query(
      "SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?",
      [req.user.id, productId]
    );

    if (existing.length > 0) {
      // Update quantity instead of duplicate insert
      await pool.query(
        "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
        [quantity, existing[0].id]
      );

      return res.json({ message: "Cart quantity updated" });
    }

    // Insert new cart item
    await pool.query(
      "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [req.user.id, productId, quantity]
    );

    res.json({ message: "Added to cart" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET CART
========================= */
exports.getCart = async (req, res) => {
  try {
    const [items] = await pool.query(
      `SELECT 
        c.id,
        p.id AS productId,
        p.name,
        p.price,
        p.image,
        c.quantity,
        (p.price * c.quantity) AS total
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?`,
      [req.user.id]
    );

    res.json(items);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   REMOVE SINGLE ITEM
========================= */
exports.removeFromCart = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM cart_items WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    res.json({ message: "Item removed from cart" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   CLEAR ENTIRE CART
========================= */
exports.clearCart = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM cart_items WHERE user_id = ?",
      [req.user.id]
    );

    res.json({ message: "Cart cleared" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};