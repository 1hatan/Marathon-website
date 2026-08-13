const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore fallback error if DNS custom servers unsupported
}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config();

let connectPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectPromise) {
    const defaultMongoUri = 'mongodb+srv://InfinityRun:Run_123@cluster0.gutqbpe.mongodb.net/infinity_run?retryWrites=true&w=majority';
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || defaultMongoUri;

    console.log('[MongoDB Atlas] Initiating database connection...');
    connectPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    }).then(async (conn) => {
      console.log(`[MongoDB Atlas] Connected successfully to database: ${conn.connection.name}`);
      await initializeDatabase();
      return conn;
    }).catch((error) => {
      connectPromise = null;
      console.error('[MongoDB Atlas] Connection failed:', error.message);
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    });
  }

  try {
    await connectPromise;
  } catch (e) {
    connectPromise = null;
    throw e;
  }
};

// Mongoose Schemas & Models
const participantSchema = new mongoose.Schema({
  registration_id: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  dob: { type: String, default: '2000-01-01' },
  gender: { type: String, default: 'Male' },
  blood_group: { type: String, default: 'O+' },
  race_category_id: { type: Number, required: true },
  t_shirt_size: { type: String, default: 'M' },
  emergency_name: { type: String },
  emergency_mobile: { type: String },
  emergency_relation: { type: String },
  medical_info: { type: String },
  registration_status: { type: String, default: 'Confirmed' },
  payment_status: { type: String, default: 'Paid' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const raceCategorySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  distance: { type: String, required: true },
  fee: { type: Number, required: true },
  description: { type: String },
  age_limit: { type: String, default: 'Open to all ages' },
  status: { type: String, default: 'active' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const sponsorSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String, required: true },
  tier: { type: String, default: 'Silver' },
  logo: { type: String },
  website: { type: String },
  status: { type: String, default: 'active' },
  created_at: { type: Date, default: Date.now }
});

const gallerySchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String, required: true },
  image_url: { type: String, required: true },
  category: { type: String, default: 'General' },
  status: { type: String, default: 'active' },
  created_at: { type: Date, default: Date.now }
});

const faqSchema = new mongoose.Schema({
  id: { type: Number },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' },
  status: { type: String, default: 'active' },
  sort_order: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  status: { type: String, default: 'Unread' },
  created_at: { type: Date, default: Date.now }
});

const eventSettingSchema = new mongoose.Schema({
  id: { type: Number, default: 1 },
  event_name: { type: String, default: 'Infinity Run' },
  event_date: { type: String, default: 'Sunday, November 15, 2026' },
  venue: { type: String, default: 'Salem Sports Complex & Mahatma Gandhi Stadium' },
  location: { type: String, default: 'Salem, Tamil Nadu' },
  reporting_time: { type: String, default: '05:00 AM' },
  flagoff_time: { type: String, default: '05:30 AM (21K) | 06:00 AM (10K) | 06:30 AM (5K/3K)' },
  registration_deadline: { type: String, default: 'November 10, 2026' },
  contact_email: { type: String, default: 'saleminfo@infinityrun.org' },
  contact_phone: { type: String, default: '+91 98765 43210' },
  updated_at: { type: Date, default: Date.now }
});

const adminSchema = new mongoose.Schema({
  id: { type: Number, default: 1 },
  name: { type: String, default: 'Infinity Admin' },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const Participant = mongoose.models.Participant || mongoose.model('Participant', participantSchema);
const RaceCategory = mongoose.models.RaceCategory || mongoose.model('RaceCategory', raceCategorySchema);
const Sponsor = mongoose.models.Sponsor || mongoose.model('Sponsor', sponsorSchema);
const GalleryItem = mongoose.models.GalleryItem || mongoose.model('GalleryItem', gallerySchema);
const Faq = mongoose.models.Faq || mongoose.model('Faq', faqSchema);
const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);
const EventSetting = mongoose.models.EventSetting || mongoose.model('EventSetting', eventSettingSchema);
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

async function initializeDatabase() {
  try {
    // 1. Seed default race categories if empty
    const raceCount = await RaceCategory.countDocuments();
    if (raceCount === 0) {
      await RaceCategory.insertMany([
        { id: 1, name: '3K Fun Run', distance: '3K', fee: 499, description: 'Ideal for beginners, families, and casual runners looking to be part of the movement.', age_limit: 'Open to all ages', status: 'active' },
        { id: 2, name: '5K Run', distance: '5K', fee: 699, description: 'A popular distance for fitness enthusiasts testing their endurance and speed.', age_limit: 'Min. 12 years old', status: 'active' },
        { id: 3, name: '10K Challenge', distance: '10K', fee: 899, description: 'A timed competitive race for seasoned runners seeking speed and endurance.', age_limit: 'Min. 15 years old', status: 'active' },
        { id: 4, name: '21K Half Marathon', distance: '21K', fee: 1199, description: 'The flagship endurance test with chip timing, pace pacers, and prize purse.', age_limit: 'Min. 18 years old', status: 'active' }
      ]);
      console.log('[MongoDB Atlas] Seeded default race categories.');
    }

    // 2. Seed default admin user if empty
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'admin@infinityrun.com').trim().toLowerCase();
      const defaultPass = process.env.ADMIN_DEFAULT_PASS || 'admin123';
      const hashedPassword = bcrypt.hashSync(defaultPass, 10);

      await Admin.create({
        id: 1,
        name: 'Infinity Admin',
        email: defaultEmail,
        password_hash: hashedPassword
      });
      console.log(`[MongoDB Atlas] Seeded default admin user: ${defaultEmail}`);
    }

    // 3. Seed default event settings if empty
    const settingCount = await EventSetting.countDocuments();
    if (settingCount === 0) {
      await EventSetting.create({
        id: 1,
        event_name: 'Infinity Run',
        event_date: 'Sunday, November 15, 2026',
        venue: 'Salem Sports Complex & Mahatma Gandhi Stadium',
        location: 'Salem, Tamil Nadu',
        reporting_time: '05:00 AM',
        flagoff_time: '05:30 AM (21K) | 06:00 AM (10K) | 06:30 AM (5K/3K)',
        registration_deadline: 'November 10, 2026',
        contact_email: 'saleminfo@infinityrun.org',
        contact_phone: '+91 98765 43210'
      });
      console.log('[MongoDB Atlas] Seeded default event settings.');
    }
  } catch (err) {
    console.error('[MongoDB Atlas] Database seed warning:', err.message);
  }
}

module.exports = {
  connectDB,
  Participant,
  RaceCategory,
  Sponsor,
  GalleryItem,
  Faq,
  ContactMessage,
  EventSetting,
  Admin
};
