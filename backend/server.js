const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config();

const { initializeDatabase } = require('./db');

const authRoutes = require('./routes/authRoutes');
const participantRoutes = require('./routes/participantRoutes');
const raceRoutes = require('./routes/raceRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const faqRoutes = require('./routes/faqRoutes');
const contactRoutes = require('./routes/contactRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

// Configured CORS setup for deployed Vercel domain & local development
const allowedOrigins = [
  'https://marathon-website-8fi8-f8vki5isc-1hatans-projects.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app') || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Serverless DB Auto-initialization Middleware for Vercel
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
    } catch (e) {
      console.error('Database serverless init warning:', e.message);
    }
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Infinity Run Backend API', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/races', raceRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  async function startServer() {
    try {
      await initializeDatabase();
      dbInitialized = true;
      app.listen(PORT, () => {
        console.log(`=================================================`);
        console.log(`  Infinity Run API Server running on port ${PORT}`);
        console.log(`  Health Check: http://localhost:${PORT}/api/health`);
        console.log(`=================================================`);
      });
    } catch (err) {
      console.error('Failed to initialize database or start server:', err);
    }
  }
  startServer();
}

module.exports = app;
