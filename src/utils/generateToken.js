const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'fallback_secret_dev_only',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    }
  );
};

module.exports = generateToken;