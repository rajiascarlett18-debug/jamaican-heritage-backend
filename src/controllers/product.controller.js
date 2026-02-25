const pool = require('../config/db');

/* =========================
   GET ALL PRODUCTS
========================= */
exports.getProducts = async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

/* =========================
   GET PRODUCT BY ID
========================= */
exports.getProductById = async (req, res) => {
  try {
    const [products] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    if (!products.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(products[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};