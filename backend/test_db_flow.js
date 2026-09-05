const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config();

const { connectDB, Participant, RaceCategory, Admin } = require('./db');

async function testDatabaseFlow() {
  console.log('=================================================================');
  console.log('   Testing Complete Flow: Backend -> MongoDB Atlas -> Mongoose');
  console.log('=================================================================');

  try {
    // 1. Initiate connection
    console.log('1. Connecting to MongoDB Atlas...');
    await connectDB();
    console.log('✓ Successfully connected to MongoDB Atlas database!');

    // 2. Query Race Categories
    const categories = await RaceCategory.find().lean();
    console.log(`✓ Fetched ${categories.length} active race categories:`, categories.map(c => c.name).join(', '));

    // 3. Perform Test Participant INSERT
    const testRegId = `INF-TEST-${Math.floor(1000 + Math.random() * 9000)}`;
    console.log(`2. Creating test participant record (${testRegId})...`);
    
    const newParticipant = await Participant.create({
      registration_id: testRegId,
      full_name: 'Verified Test Runner',
      email: 'verified.testrunner@infinityrun.org',
      mobile: '+919876543210',
      dob: '1998-05-20',
      gender: 'Female',
      blood_group: 'A+',
      race_category_id: 2,
      t_shirt_size: 'L',
      emergency_name: 'Guardian Test',
      emergency_mobile: '+919876543211',
      emergency_relation: 'Parent',
      medical_info: 'None',
      registration_status: 'Confirmed',
      payment_status: 'Paid'
    });
    console.log('✓ Test participant inserted cleanly with ID:', newParticipant._id.toString());

    // 4. Perform SELECT query
    console.log('3. Querying inserted participant from MongoDB Atlas...');
    const foundParticipant = await Participant.findOne({ registration_id: testRegId }).lean();
    if (!foundParticipant) {
      throw new Error('Test participant not found after insertion!');
    }
    console.log(`✓ Query returned participant: ${foundParticipant.full_name} | Reg ID: ${foundParticipant.registration_id} | Status: ${foundParticipant.registration_status}`);

    // 5. Clean up test record
    console.log('4. Cleaning up test record from MongoDB Atlas...');
    await Participant.deleteOne({ registration_id: testRegId });
    console.log('✓ Cleaned up test record.');

    // 6. Admin user status check
    const adminCount = await Admin.countDocuments();
    console.log(`✓ Admin accounts count in database: ${adminCount}`);

    console.log('=================================================================');
    console.log('   🎉 MONGODB ATLAS END-TO-END FLOW VERIFIED SUCCESSFULLY');
    console.log('=================================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB Atlas Test Error:', err);
    process.exit(1);
  }
}

testDatabaseFlow();
