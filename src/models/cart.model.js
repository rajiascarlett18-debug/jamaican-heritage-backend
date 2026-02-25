exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  await pool.query(
    "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
    [req.user.id, productId, quantity]
  );

  res.json({ message: "Added to cart" });
};