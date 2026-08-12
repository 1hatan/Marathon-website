const { getPool } = require('../db');

exports.getStats = async (req, res) => {
  try {
    const pool = await getPool();

    // 1. Core Summary Metrics
    const [regRows] = await pool.query('SELECT COUNT(*) as total_registrations FROM participants');
    const total_registrations = regRows[0]?.total_registrations || 0;

    const [partRows] = await pool.query('SELECT COUNT(DISTINCT email) as total_participants FROM participants');
    const total_participants = partRows[0]?.total_participants || total_registrations;

    const [todayRows] = await pool.query('SELECT COUNT(*) as today_registrations FROM participants WHERE DATE(created_at) = CURDATE()');
    const today_registrations = todayRows[0]?.today_registrations || 0;

    const [confRows] = await pool.query("SELECT COUNT(*) as confirmed_registrations FROM participants WHERE registration_status = 'Confirmed'");
    const confirmed_registrations = confRows[0]?.confirmed_registrations || 0;

    const [pendRows] = await pool.query("SELECT COUNT(*) as pending_registrations FROM participants WHERE registration_status = 'Pending'");
    const pending_registrations = pendRows[0]?.pending_registrations || 0;

    const [msgRows] = await pool.query('SELECT COUNT(*) as total_messages FROM contact_messages');
    const total_messages = msgRows[0]?.total_messages || 0;

    // 2. Gender Breakdown
    const [maleRows] = await pool.query("SELECT COUNT(*) as count FROM participants WHERE LOWER(gender) = 'male'");
    const male_participants = maleRows[0]?.count || 0;

    const [femaleRows] = await pool.query("SELECT COUNT(*) as count FROM participants WHERE LOWER(gender) = 'female'");
    const female_participants = femaleRows[0]?.count || 0;

    const [otherRows] = await pool.query("SELECT COUNT(*) as count FROM participants WHERE LOWER(gender) NOT IN ('male', 'female')");
    const other_participants = otherRows[0]?.count || 0;

    // 3. Race Distance Breakdown
    const [r3k] = await pool.query(`
      SELECT COUNT(p.id) as count 
      FROM participants p 
      JOIN race_categories r ON p.race_category_id = r.id 
      WHERE r.distance = '3K' OR r.name LIKE '%3K%'
    `);
    const reg_3k = r3k[0]?.count || 0;

    const [r5k] = await pool.query(`
      SELECT COUNT(p.id) as count 
      FROM participants p 
      JOIN race_categories r ON p.race_category_id = r.id 
      WHERE r.distance = '5K' OR r.name LIKE '%5K%'
    `);
    const reg_5k = r5k[0]?.count || 0;

    const [r10k] = await pool.query(`
      SELECT COUNT(p.id) as count 
      FROM participants p 
      JOIN race_categories r ON p.race_category_id = r.id 
      WHERE r.distance = '10K' OR r.name LIKE '%10K%'
    `);
    const reg_10k = r10k[0]?.count || 0;

    const [r21k] = await pool.query(`
      SELECT COUNT(p.id) as count 
      FROM participants p 
      JOIN race_categories r ON p.race_category_id = r.id 
      WHERE r.distance = '21K' OR r.name LIKE '%21K%' OR r.name LIKE '%Half Marathon%'
    `);
    const reg_21k = r21k[0]?.count || 0;

    const [r42k] = await pool.query(`
      SELECT COUNT(p.id) as count 
      FROM participants p 
      JOIN race_categories r ON p.race_category_id = r.id 
      WHERE r.distance = '42K' OR r.name LIKE '%42K%' OR r.name LIKE '%Full Marathon%'
    `);
    const reg_42k = r42k[0]?.count || 0;

    // 4. Total Revenue Calculation
    const [revenueRows] = await pool.query(`
      SELECT SUM(r.fee) as total_revenue 
      FROM participants p 
      LEFT JOIN race_categories r ON p.race_category_id = r.id 
      WHERE p.payment_status = 'Paid'
    `);
    const total_revenue = parseFloat(revenueRows[0]?.total_revenue || 0);

    // 5. Category-wise Registrations
    const [categoryStats] = await pool.query(`
      SELECT r.name as category, r.distance, COUNT(p.id) as count, COALESCE(SUM(r.fee), 0) as revenue
      FROM race_categories r
      LEFT JOIN participants p ON r.id = p.race_category_id
      GROUP BY r.id, r.name, r.distance
    `);

    // 6. Gender Stats Array
    const [genderStats] = await pool.query(`
      SELECT gender, COUNT(*) as count
      FROM participants
      GROUP BY gender
    `);

    // 7. T-Shirt Size Distribution Array
    const [tshirtStats] = await pool.query(`
      SELECT t_shirt_size as size, COUNT(*) as count
      FROM participants
      GROUP BY t_shirt_size
      ORDER BY count DESC
    `);

    // 8. Recent Registrations (Calculating Age safely in JS)
    const [recentRegistrationsRaw] = await pool.query(`
      SELECT 
        p.id,
        p.registration_id,
        p.full_name,
        p.email,
        p.mobile,
        p.gender,
        p.dob,
        p.t_shirt_size,
        p.registration_status,
        p.created_at,
        r.name as race_name,
        r.distance as race_distance
      FROM participants p
      LEFT JOIN race_categories r ON p.race_category_id = r.id
      ORDER BY p.created_at DESC
      LIMIT 10
    `);

    const recentRegistrations = (recentRegistrationsRaw || []).map(p => {
      let age = null;
      if (p.dob) {
        const birth = new Date(p.dob);
        if (!isNaN(birth.getTime()) && birth.getFullYear() > 1900) {
          const today = new Date();
          age = today.getFullYear() - birth.getFullYear();
          const m = today.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
          }
        }
      }
      return { ...p, age };
    });

    // 9. Recent Contact Messages
    const [recentMessages] = await pool.query(`
      SELECT id, name, email, phone, subject, message, status, created_at
      FROM contact_messages
      ORDER BY created_at DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      summary: {
        total_registrations,
        total_participants,
        today_registrations,
        confirmed_registrations,
        pending_registrations,
        total_revenue,
        total_messages,
        male_participants,
        female_participants,
        other_participants,
        reg_3k,
        reg_5k,
        reg_10k,
        reg_21k,
        reg_42k
      },
      categoryStats: categoryStats || [],
      genderStats: genderStats || [],
      tshirtStats: tshirtStats || [],
      recentRegistrations: recentRegistrations || [],
      recentMessages: recentMessages || []
    });
  } catch (err) {
    console.error('Dashboard Stats Error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate dashboard statistics from database.', error: err.message });
  }
};
