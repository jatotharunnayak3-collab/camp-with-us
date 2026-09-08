require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5501',
  'http://127.0.0.1:5501',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  // Railway / production domains — add your frontend URL here after deploy
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.railway.app') ||
      origin.endsWith('.up.railway.app') ||
      origin.endsWith('.netlify.app')
    ) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─── BODY PARSERS ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── REQUEST LOGGER (dev only) ───────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/hotels',       require('./routes/hotels'));
app.use('/api/planner',      require('./routes/planner'));
app.use('/api/ai',           require('./routes/ai'));
app.use('/api/reviews',      require('./routes/reviews'));
app.use('/api/businesses',   require('./routes/businesses'));
app.use('/api/safety',       require('./routes/safety'));

// ─── HEALTH CHECKS ──────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Camp With Us API is running',
    version: '1.0.0',
    tagline: 'Travel Smart • Travel Safe'
  });
});

app.get('/api/test', (_req, res) => {
  res.json({
    success: true,
    message: 'Camp With Us API is healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ─── 404 HANDLER ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Server Error]', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// ─── MONGODB CONNECTION ──────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI || MONGO_URI.includes('<username>')) {
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('  ERROR: MONGO_URI is not configured in .env');
  console.error('  Please set a valid MongoDB Atlas connection string.');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  // Still start so /api/test can respond, but log the issue
}

mongoose.connect(MONGO_URI || '', {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅  MongoDB connected successfully');
})
.catch(err => {
  console.error('❌  MongoDB connection failed:', err.message);
  console.error('    Check MONGO_URI in backend/.env');
});

// ─── START SERVER ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  🏕️  Camp With Us server running on port', PORT);
  console.log('  Travel Smart • Travel Safe');
  console.log('  API: http://localhost:' + PORT + '/api');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

module.exports = app;
