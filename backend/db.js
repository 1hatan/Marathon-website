const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

let cachedConn = null;
let cachedPromise = null;

async function connectDB() {
  if (cachedConn && mongoose.connection.readyState === 1) {
    return cachedConn;
  }
  if (!cachedPromise) {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/infinity_run';
    console.log('[MongoDB] Connecting to database...');
    cachedPromise = mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    }).then((m) => {
      console.log(`[MongoDB] Connected successfully: ${m.connection.name}`);
      return m;
    });
  }
  try {
    cachedConn = await cachedPromise;
  } catch (e) {
    cachedPromise = null;
    throw e;
  }
  return cachedConn;
}

// Schemas & Models
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
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const sponsorSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String, required: true },
  tier: { type: String, default: 'Silver' },
  logo_url: { type: String },
  website_url: { type: String },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

const gallerySchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String, required: true },
  image_url: { type: String, required: true },
  category: { type: String, default: 'General' },
  is_featured: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

const faqSchema = new mongoose.Schema({
  id: { type: Number },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' },
  is_active: { type: Boolean, default: true },
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
  event_name: { type: String, default: 'Infinity Run 2026' },
  event_date: { type: String, default: 'Sunday, November 15, 2026' },
  venue: { type: String, default: 'Salem Sports Complex' },
  location: { type: String, default: 'Salem, Tamil Nadu' },
  registration_open: { type: Boolean, default: true },
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
  await connectDB();

  // 1. Seed Race Categories if empty
  const raceCount = await RaceCategory.countDocuments();
  if (raceCount === 0) {
    await RaceCategory.insertMany([
      { id: 1, name: '3K Fun Run', distance: '3K', fee: 499, description: 'Ideal for beginners, families, and casual runners looking to be part of the movement.', age_limit: 'Open to all ages' },
      { id: 2, name: '5K Run', distance: '5K', fee: 699, description: 'A popular distance for fitness enthusiasts testing their endurance and speed.', age_limit: 'Min. 12 years old' },
      { id: 3, name: '10K Challenge', distance: '10K', fee: 899, description: 'A timed competitive race for seasoned runners seeking speed and endurance.', age_limit: 'Min. 15 years old' },
      { id: 4, name: '21K Half Marathon', distance: '21K', fee: 1199, description: 'The flagship endurance test with chip timing, pace pacers, and prize purse.', age_limit: 'Min. 18 years old' }
    ]);
    console.log('[DB Seed] Default race categories created in MongoDB.');
  }

  // 2. Seed Default Admin User if empty
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const adminEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'admin@infinityrun.com').trim().toLowerCase();
    const adminPass = process.env.ADMIN_DEFAULT_PASS || 'admin123';
    const hashedPassword = bcrypt.hashSync(adminPass, 10);

    await Admin.create({
      id: 1,
      name: 'Infinity Admin',
      email: adminEmail,
      password_hash: hashedPassword
    });
    console.log(`[DB Seed] Default admin created: ${adminEmail}`);
  }

  // 3. Seed Event Settings if empty
  const settingCount = await EventSetting.countDocuments();
  if (settingCount === 0) {
    await EventSetting.create({
      event_name: 'Infinity Run 2026',
      event_date: 'Sunday, November 15, 2026',
      venue: 'Salem Sports Complex',
      location: 'Salem, Tamil Nadu',
      registration_open: true
    });
    console.log('[DB Seed] Default event settings created in MongoDB.');
  }
}

module.exports = {
  connectDB,
  initializeDatabase,
  Participant,
  RaceCategory,
  Sponsor,
  GalleryItem,
  Faq,
  ContactMessage,
  EventSetting,
  Admin
};
