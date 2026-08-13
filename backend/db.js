const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let sqlite3 = null;
try {
  sqlite3 = require('sqlite3').verbose();
} catch (e) {
  // Optional sqlite3 fallback for local dev
}

// Support DATABASE_URL or individual DB_* env variables for MySQL
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

if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    dbConfig.host = url.hostname;
    dbConfig.port = parseInt(url.port || '3306');
    dbConfig.user = url.username;
    dbConfig.password = url.password;
    dbConfig.database = url.pathname.replace(/^\//, '') || 'infinity_run';
  } catch (e) {
    console.warn('[DB] Could not parse DATABASE_URL, using individual DB_* variables.');
  }
}

let activeDriver = 'mysql'; // 'mysql' or 'sqlite'
let mysqlPool = null;
let sqliteDb = null;

// Helper to run SQLite async query matching mysql2 interface [rows, fields]
function querySqlite(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (!sqliteDb) {
      return reject(new Error('SQLite database not initialized.'));
    }
    const trimmed = sql.trim();
    const isSelect = /^SELECT/i.test(trimmed);

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
      throw new Error('No active MySQL database connection available.');
    }
  }
};

async function getPool() {
  return poolWrapper;
}

async function initializeDatabase() {
  // 1. Try MySQL connection using DB_* env variables
  const commonPasswords = [
    process.env.DB_PASSWORD || 'Gayu_@2317',
    'Gayu_@2317',
    'root',
    '',
    'password',
    '123456',
    'admin123'
  ];
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
      console.log(`[DB] Connected to MySQL server successfully (host: ${dbConfig.host}, user: ${dbConfig.user}, db: ${dbConfig.database})`);
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
      console.warn('[DB] MySQL setup warning, attempting fallback driver:', err.message);
      if (connection) await connection.end();
    }
  }

  // 2. Fallback to SQLite if local MySQL server is not running
  if (sqlite3) {
    console.log('[DB] Using SQLite embedded engine as local database provider...');
    activeDriver = 'sqlite';

    const dbDir = path.join(__dirname, '../database');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const sqlitePath = path.join(dbDir, 'infinity_run.sqlite');
    sqliteDb = new sqlite3.Database(sqlitePath);

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
        fee REAL NOT NULL,
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
        dob TEXT NOT NULL,
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

    // Seed default race categories if empty
    const [races] = await querySqlite('SELECT COUNT(*) as count FROM race_categories');
    if (!races || !races[0] || races[0].count === 0) {
      await querySqlite(`
        INSERT INTO race_categories (id, name, distance, description, age_limit, fee, status) VALUES
        (1, '3K Fun Run', '3K', 'Ideal for beginners, families, and casual runners looking to be part of the movement.', 'Open to all ages', 499.00, 'active'),
        (2, '5K Run', '5K', 'A popular distance for fitness enthusiasts testing their endurance and speed.', 'Min. 12 years old', 699.00, 'active'),
        (3, '10K Challenge', '10K', 'A timed competitive race for seasoned runners seeking speed and endurance.', 'Min. 15 years old', 899.00, 'active'),
        (4, '21K Half Marathon', '21K', 'The flagship endurance test with chip timing, pace pacers, and prize purse.', 'Min. 18 years old', 1199.00, 'active');
      `);
    }

    await seedAdmin(poolWrapper);
    console.log('[DB] SQLite database initialized successfully.');
  }
}

async function seedAdmin(pool) {
  try {
    const defaultEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'admin@infinityrun.com').trim().toLowerCase();
    const defaultPass = process.env.ADMIN_DEFAULT_PASS || 'admin123';

    const [rows] = await pool.query('SELECT * FROM admins WHERE LOWER(email) = ?', [defaultEmail]);
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash(defaultPass, 10);
      await pool.query(
        'INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)',
        ['Infinity Admin', defaultEmail, hashedPassword]
      );
      console.log(`[DB Seed] Default admin created in MySQL: ${defaultEmail}`);
    }
  } catch (err) {
    console.error('[DB Seed] Error seeding admin:', err.message);
  }
}

module.exports = {
  getPool,
  initializeDatabase,
  poolWrapper
};
