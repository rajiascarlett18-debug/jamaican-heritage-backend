const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [users] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [decoded.id]
    );

    req.user = users[0];
    next();

  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};

module.exports = protect;