const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

/* =========================
   GLOBAL MIDDLEWARE
========================= */

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

/* =========================
   HEALTH CHECK
========================= */

app.get('/api/health', (req, res) => {
  res.json({ message: "Jamaican Heritage Backend Running 🔥" });
});

/* =========================
   ROUTES
========================= */

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/payments', require('./routes/payment.routes'));

/* =========================
   EXPORT
========================= */

module.exports = app;