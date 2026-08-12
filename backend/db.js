const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let sqlite3 = null;
try {
  sqlite3 = require('sqlite3').verbose();
} catch (e) {
  // SQLite optional fallback
}

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'infinity_run',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
};

let activeDriver = 'mysql'; // 'mysql' or 'sqlite'
let mysqlPool = null;
let sqliteDb = null;

// Helper to run SQLite async query matching mysql2 interface [rows, fields]
function querySqlite(sql, params = []) {
  return new Promise((resolve, reject) => {
    const trimmed = sql.trim();
    const isSelect = /^SELECT/i.test(trimmed);

    // Convert MySQL queries (e.g. CURDATE(), TIMESTAMP, ON DUPLICATE KEY UPDATE) if using SQLite fallback
    let modifiedSql = sql
      .replace(/CURDATE\(\)/gi, "date('now')")
      .replace(/AUTO_INCREMENT/gi, "AUTOINCREMENT")
      .replace(/ON DUPLICATE KEY UPDATE[\s\S]*/gi, "");

    if (isSelect) {
      sqliteDb.all(modifiedSql, params, (err, rows) => {
        if (err) return reject(err);
        resolve([rows || [], null]);
      });
    } else {
      sqliteDb.run(modifiedSql, params, function (err) {
        if (err) return reject(err);
        const result = {
          insertId: this.lastID,
          affectedRows: this.changes
        };
        resolve([result, null]);
      });
    }
  });
}

const poolWrapper = {
  async query(sql, params = []) {
    if (activeDriver === 'mysql' && mysqlPool) {
      return await mysqlPool.query(sql, params);
    } else if (sqliteDb) {
      return await querySqlite(sql, params);
    } else {
      throw new Error('No active database connection available.');
    }
  }
};

async function getPool() {
  return poolWrapper;
}

async function initializeDatabase() {
  // 1. Try MySQL connection
  const commonPasswords = [process.env.DB_PASSWORD || 'Gayu_@2317', 'Gayu_@2317', 'Gayu_*123', '', 'root', 'password', '123456', 'MySQL80', 'admin', 'admin123', 'Password123!'];
  let mysqlConnected = false;
  let connection = null;

  for (const pwd of commonPasswords) {
    try {
      connection = await mysql.createConnection({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: pwd,
        multipleStatements: true
      });
      dbConfig.password = pwd;
      mysqlConnected = true;
      console.log(`[DB] Connected to MySQL server successfully (user: ${dbConfig.user})`);
      break;
    } catch (err) {
      // try next password
    }
  }

  if (mysqlConnected && connection) {
    activeDriver = 'mysql';
    try {
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
      await connection.query(`USE \`${dbConfig.database}\``);

      mysqlPool = mysql.createPool(dbConfig);

      const schemaPath = path.join(__dirname, '../database/schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await connection.query(schemaSql);
        await connection.query('CREATE OR REPLACE VIEW infinity_run AS SELECT * FROM participants');
        console.log('[DB] Applied MySQL schema, views & seeds.');
      }

      await seedAdmin(poolWrapper);
      console.log('[DB] MySQL database initialized successfully.');
      await connection.end();
      return;
    } catch (err) {
      console.warn('[DB] MySQL setup error, attempting fallback driver:', err.message);
      if (connection) await connection.end();
    }
  }

  // 2. Fallback to SQLite if MySQL fails or isn't available with current passwords
  console.log('[DB] Using SQLite embedded engine as local database provider...');
  activeDriver = 'sqlite';

  const dbDir = path.join(__dirname, '../database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const sqlitePath = path.join(dbDir, 'infinity_run.sqlite');
  sqliteDb = new sqlite3.Database(sqlitePath);

  // Initialize SQLite tables
  await querySqlite(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await querySqlite(`
    CREATE TABLE IF NOT EXISTS race_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      distance TEXT NOT NULL,
      description TEXT,
      age_limit TEXT,
      fee DECIMAL(10, 2) NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await querySqlite(`
    CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_id TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      mobile TEXT NOT NULL,
      dob DATE NOT NULL,
      gender TEXT NOT NULL,
      blood_group TEXT NOT NULL,
      race_category_id INTEGER NOT NULL,
      t_shirt_size TEXT NOT NULL,
      emergency_name TEXT NOT NULL,
      emergency_mobile TEXT NOT NULL,
      emergency_relation TEXT NOT NULL,
      medical_info TEXT,
      registration_status TEXT DEFAULT 'Confirmed',
      payment_status TEXT DEFAULT 'Paid',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await querySqlite(`
    CREATE TABLE IF NOT EXISTS sponsors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo TEXT NOT NULL,
      tier TEXT NOT NULL,
      website TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await querySqlite(`
    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      title TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await querySqlite(`
    CREATE TABLE IF NOT EXISTS faq (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await querySqlite(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'Unread',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await querySqlite(`
    CREATE TABLE IF NOT EXISTS event_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_name TEXT DEFAULT 'Infinity Run',
      event_date TEXT DEFAULT 'Sunday, November 15, 2026',
      venue TEXT DEFAULT 'Salem Sports Complex & Mahatma Gandhi Stadium',
      location TEXT DEFAULT 'Salem, Tamil Nadu',
      reporting_time TEXT DEFAULT '05:00 AM',
      flagoff_time TEXT DEFAULT '05:30 AM (21K) | 06:00 AM (10K) | 06:30 AM (5K/3K)',
      registration_deadline TEXT DEFAULT 'November 10, 2026',
      contact_email TEXT DEFAULT 'saleminfo@infinityrun.org',
      contact_phone TEXT DEFAULT '+91 98765 43210',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed SQLite default data
  const [raceRows] = await querySqlite('SELECT COUNT(*) as count FROM race_categories');
  if (raceRows[0].count === 0) {
    await querySqlite(`
      INSERT INTO race_categories (id, name, distance, description, age_limit, fee, status) VALUES
      (1, '3K Fun Run', '3K', 'Ideal for beginners, families, and casual runners looking to be part of the movement.', 'Open to all ages', 499.00, 'active'),
      (2, '5K Run', '5K', 'A popular distance for fitness enthusiasts testing their endurance and speed.', 'Min. 12 years old', 699.00, 'active'),
      (3, '10K Challenge', '10K', 'A timed competitive race for seasoned runners seeking speed and endurance.', 'Min. 15 years old', 899.00, 'active'),
      (4, '21K Half Marathon', '21K', 'The flagship endurance test with chip timing, pace pacers, and prize purse.', 'Min. 18 years old', 1199.00, 'active');
    `);
  }

  const [settingsRows] = await querySqlite('SELECT COUNT(*) as count FROM event_settings');
  if (settingsRows[0].count === 0) {
    await querySqlite(`
      INSERT INTO event_settings (id, event_name, event_date, venue, location, reporting_time, flagoff_time, registration_deadline, contact_email, contact_phone)
      VALUES (1, 'Infinity Run', 'Sunday, November 15, 2026', 'Salem Sports Complex & Mahatma Gandhi Stadium', 'Salem, Tamil Nadu', '05:00 AM', '05:30 AM (21K) | 06:00 AM (10K) | 06:30 AM (5K/3K)', 'November 10, 2026', 'saleminfo@infinityrun.org', '+91 98765 43210');
    `);
  } else {
    await querySqlite(`
      UPDATE event_settings SET venue = 'Salem Sports Complex & Mahatma Gandhi Stadium', location = 'Salem, Tamil Nadu', contact_email = 'saleminfo@infinityrun.org', contact_phone = '+91 98765 43210' WHERE id = 1;
    `);
  }

  const [faqRows] = await querySqlite('SELECT COUNT(*) as count FROM faq');
  if (faqRows[0].count === 0) {
    await querySqlite(`
      INSERT INTO faq (question, answer, status) VALUES
      ('Who can participate in Infinity Run?', 'Infinity Run is open to runners of all fitness levels. The 3K Fun Run welcomes all ages, while timed races (5K, 10K, 21K) have minimum age limits of 12, 15, and 18 years respectively.', 'active'),
      ('How do I receive my registration confirmation?', 'Upon completing the multi-step online registration, you will receive an instant on-screen digital registration pass with a unique Registration ID (e.g. INF-2026-XXXX). An email confirmation will also be dispatched.', 'active'),
      ('What is included in the registration fee?', 'Your registration fee includes an official dry-fit running T-shirt, personalized bib with timing chip (for 5K, 10K, 21K), finisher medal, e-certificate, hot breakfast refreshments, and hydration support along the route.', 'active'),
      ('Where and when can I collect my Bib and Race Kit?', 'Race kit collection will take place at the Marathon Expo (Salem Sports Complex, Salem, Tamil Nadu) on Friday, Nov 13, and Saturday, Nov 14, from 10:00 AM to 6:00 PM. Please bring your registration confirmation ID and photo ID.', 'active');
    `);
  }

  const [sponsorRows] = await querySqlite('SELECT COUNT(*) as count FROM sponsors');
  if (sponsorRows[0].count === 0) {
    await querySqlite(`
      INSERT INTO sponsors (name, logo, tier, website, status) VALUES
      ('Apex Athletics', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80', 'Title Sponsor', 'https://apexathletics.com', 'active'),
      ('HydroMax Hydration', 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&auto=format&fit=crop&q=80', 'Gold Sponsor', 'https://hydromax.com', 'active'),
      ('FitNutrition Co.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=80', 'Gold Sponsor', 'https://fitnutrition.com', 'active'),
      ('Pulse Wearables', 'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=300&auto=format&fit=crop&q=80', 'Silver Sponsor', 'https://pulsewearables.com', 'active'),
      ('City HealthCare', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=300&auto=format&fit=crop&q=80', 'Supporting Partner', 'https://cityhealthcare.org', 'active');
    `);
  }

  const [galleryRows] = await querySqlite('SELECT COUNT(*) as count FROM gallery');
  if (galleryRows[0].count === 0) {
    await querySqlite(`
      INSERT INTO gallery (image_url, title, status) VALUES
      ('https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=80', 'Marathon Flag Off', 'active'),
      ('https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80', 'Runners at Sunrise', 'active'),
      ('https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80', 'Finisher Celebration', 'active'),
      ('https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&auto=format&fit=crop&q=80', 'Hydration Point Joy', 'active'),
      ('https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80', 'Medal Presentation', 'active'),
      ('https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80', 'Community Spirit', 'active');
    `);
  }

  await seedAdmin(poolWrapper);
  console.log('[DB] Local embedded database setup completed.');
}

async function seedAdmin(pool) {
  try {
    const defaultEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'admin@infinityrun.com').trim().toLowerCase();
    const defaultPass = process.env.ADMIN_DEFAULT_PASS || 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(defaultPass, salt);

    const [rows] = await pool.query('SELECT * FROM admins WHERE LOWER(email) = ?', [defaultEmail]);
    if (rows.length === 0) {
      await pool.query(
        'INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)',
        ['Super Admin', defaultEmail, hash]
      );
      console.log(`[DB] Created default admin user: ${defaultEmail} / ${defaultPass}`);
    } else {
      await pool.query(
        'UPDATE admins SET password_hash = ? WHERE LOWER(email) = ?',
        [hash, defaultEmail]
      );
      console.log(`[DB] Refreshed credentials for default admin: ${defaultEmail}`);
    }
  } catch (err) {
    console.error('[DB] Admin seeding error:', err);
  }
}

module.exports = {
  getPool,
  initializeDatabase
};
