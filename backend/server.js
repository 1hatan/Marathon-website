const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config();

const { connectDB } = require('./db');

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
  'http://localhost:5050',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com') || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Serverless / App DB Connection Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (e) {
    console.error('Database connection middleware warning:', e.message);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Infinity Run Backend API (MongoDB Atlas)', timestamp: new Date() });
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

// Serve frontend static production build files for unified Render deployment
const fs = require('fs');
const frontendDistPath = fs.existsSync(path.resolve(__dirname, '../frontend/dist'))
  ? path.resolve(__dirname, '../frontend/dist')
  : path.resolve(process.cwd(), 'frontend/dist');

app.use(express.static(frontendDistPath));

// SPA Fallback for client-side routing (/admin/login, /admin, /register, /about, /contact, etc.)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(frontendDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
      <head><title>404 - Frontend Not Built</title></head>
      <body style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h2>Frontend Build Not Found</h2>
        <p>The backend is running, but the frontend distribution files were not found at <code>${frontendDistPath}</code>.</p>
        <p><strong>To fix this on Render:</strong> Set your Web Service <strong>Build Command</strong> to: <br/><code>npm install && npm run build</code></p>
      </body>
    </html>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5050;

if (require.main === module) {
  async function startServer() {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`=================================================`);
        console.log(`  Infinity Run API Server running on port ${PORT}`);
        console.log(`  Database Engine: MongoDB Atlas`);
        console.log(`  Health Check: http://localhost:${PORT}/api/health`);
        console.log(`=================================================`);
      });
    } catch (err) {
      console.error('Failed to connect to MongoDB Atlas or start server:', err);
    }
  }
  startServer();
}

module.exports = app;
