require('dotenv').config();

const app = require('./src/app');
const db = require('./src/config/db'); // 🔥 Make sure path matches your project

const PORT = process.env.PORT || 5050;

// 🔐 Verify DB connection before starting server
async function startServer() {
  try {
    await db.query('SELECT 1');
    console.log('✅ Connected to Railway MySQL');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    process.exit(1); // Stop server if DB fails
  }
}

startServer();