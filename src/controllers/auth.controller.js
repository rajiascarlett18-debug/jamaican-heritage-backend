const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const generateToken = require('../utils/generateToken');

/* =========================
   REGISTER
========================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check existing user
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      id: result.insertId,
      token: generateToken(result.insertId)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};


/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!users.length) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};

/* =========================
   GET CURRENT USER
========================= */
exports.getMe = async (req, res) => {
  try {

    const [users] = await pool.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!users.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(users[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};