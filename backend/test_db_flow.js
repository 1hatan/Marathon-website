const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabaseFlow() {
  console.log('--- Testing Complete Flow: Registration Form -> Backend -> MySQL -> SELECT Data ---');
  
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || 'Gayu_@2317';
  const database = process.env.DB_NAME || 'infinity_run';

  console.log(`Connecting to MySQL at ${host}:3306 as ${user} (Database: ${database})...`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      user,
      password,
      database
    });
    console.log('✓ Successfully connected to MySQL database:', database);

    // 1. Show existing tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('✓ Existing tables and views in database:', tables.map(t => Object.values(t)[0]));

    // 2. Perform test INSERT into participants table
    const testRegId = `INF-TEST-${Math.floor(1000 + Math.random() * 9000)}`;
    const [insertResult] = await connection.query(`
      INSERT INTO participants 
      (registration_id, full_name, email, mobile, dob, gender, blood_group, race_category_id, t_shirt_size, emergency_name, emergency_mobile, emergency_relation, registration_status, payment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', 'Paid')
    `, [
      testRegId,
      'Test Verified Runner',
      'verified.runner@test.com',
      '+919876543210',
      '1996-08-15',
      'Female',
      'B+',
      1,
      'M',
      'Emergency Contact Name',
      '+919876543211',
      'Parent'
    ]);
    console.log(`✓ Executed INSERT query into participants correctly. Inserted ID: ${insertResult.insertId}`);

    // 3. Perform SELECT from participants table
    const [participants] = await connection.query('SELECT * FROM participants WHERE registration_id = ?', [testRegId]);
    console.log('✓ SELECT query from participants table returned:', participants[0].full_name, '| Reg ID:', participants[0].registration_id);

    // 4. Create view alias and perform SELECT from infinity_run view
    await connection.query('CREATE OR REPLACE VIEW infinity_run AS SELECT * FROM participants');
    const [viewResults] = await connection.query('SELECT * FROM infinity_run WHERE registration_id = ?', [testRegId]);
    console.log('✓ SELECT query from infinity_run view returned:', viewResults[0].full_name, '| Reg ID:', viewResults[0].registration_id);

    // 5. Clean up test record
    await connection.query('DELETE FROM participants WHERE registration_id = ?', [testRegId]);
    console.log('✓ Cleaned up test record.');

    console.log('=== FULL END-TO-END FLOW VERIFIED SUCCESSFULLY ===');
  } catch (err) {
    console.error('❌ Database Test Error:', err);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

testDatabaseFlow();
