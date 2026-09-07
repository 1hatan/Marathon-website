const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Participant, RaceCategory } = require('../db');

// Helper to generate registration ID
function generateRegistrationId() {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `INF-2026-${randomDigits}`;
}

// Get Razorpay Key ID for frontend initialization
exports.getRazorpayKey = (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key_id';
  res.json({
    success: true,
    key_id: keyId,
    is_mock: !process.env.RAZORPAY_KEY_ID
  });
};

// Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { race_category_id } = req.body;

    let catId = parseInt(race_category_id);
    let selectedRace = null;

    if (!isNaN(catId)) {
      selectedRace = await RaceCategory.findOne({ id: catId }).lean();
    }
    if (!selectedRace) {
      selectedRace = await RaceCategory.findOne().lean();
    }
    if (!selectedRace) {
      selectedRace = { id: 1, name: '3K Fun Run', distance: '3K', fee: 499 };
    }

    const feeAmount = selectedRace.fee || 499;
    const amountInPaise = Math.round(feeAmount * 100);

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if real Razorpay credentials are present
    if (keyId && keySecret && !keyId.includes('YOUR_') && !keySecret.includes('YOUR_')) {
      const razorpayInstance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret
      });

      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        notes: {
          race_name: selectedRace.name,
          race_distance: selectedRace.distance
        }
      };

      const order = await razorpayInstance.orders.create(options);

      return res.json({
        success: true,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: keyId,
        race_fee: feeAmount,
        race_name: selectedRace.name,
        is_mock: false
      });
    } else {
      // Mock / Demo Order fallback when live keys are not configured yet
      const mockOrderId = `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      console.log(`[Razorpay Payment] Created MOCK order ${mockOrderId} for ₹${feeAmount} (${selectedRace.name})`);

      return res.json({
        success: true,
        order_id: mockOrderId,
        amount: amountInPaise,
        currency: 'INR',
        key_id: 'rzp_test_mock_key_id',
        race_fee: feeAmount,
        race_name: selectedRace.name,
        is_mock: true,
        message: 'Running in Razorpay demo/mock mode. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env for live payments.'
      });
    }
  } catch (err) {
    console.error('[Razorpay Create Order Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment order.',
      error: err.message
    });
  }
};

// Verify Payment Signature and complete participant registration
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      participantData
    } = req.body;

    if (!participantData || !participantData.full_name || !participantData.mobile) {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration details provided.'
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isMockOrder = razorpay_order_id && razorpay_order_id.startsWith('order_mock_');

    if (!isMockOrder && keySecret && !keySecret.includes('YOUR_')) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        console.error('[Razorpay Signature Verification Failed]');
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed. Invalid signature.'
        });
      }
    } else {
      console.log(`[Razorpay Payment Verified] MOCK verification for order ${razorpay_order_id}`);
    }

    // Process participant registration after successful payment
    const {
      full_name,
      email,
      mobile,
      age,
      dob,
      gender,
      blood_group,
      race_category_id,
      t_shirt_size,
      emergency_name,
      emergency_mobile,
      emergency_relation,
      medical_info
    } = participantData;

    let finalCatId = parseInt(race_category_id);
    let selectedRace = null;

    if (!isNaN(finalCatId)) {
      selectedRace = await RaceCategory.findOne({ id: finalCatId }).lean();
    }
    if (!selectedRace) {
      selectedRace = await RaceCategory.findOne().lean();
    }
    if (!selectedRace) {
      selectedRace = { id: 1, name: '3K Fun Run', distance: '3K', fee: 499 };
    }
    finalCatId = selectedRace.id;

    let validDob = dob;
    const ageVal = parseInt(age);
    if (!isNaN(ageVal) && ageVal > 0) {
      const birthYear = new Date().getFullYear() - ageVal;
      validDob = `${birthYear}-01-01`;
    } else if (!validDob || String(validDob).trim() === '') {
      validDob = '2000-01-01';
    }

    let registration_id = generateRegistrationId();
    let existing = await Participant.findOne({ registration_id });
    while (existing) {
      registration_id = generateRegistrationId();
      existing = await Participant.findOne({ registration_id });
    }

    const newParticipant = await Participant.create({
      registration_id,
      full_name: full_name.trim(),
      email: email ? email.trim().toLowerCase() : `${mobile}@infinityrun.org`,
      mobile: mobile.trim(),
      dob: validDob,
      gender: gender || 'Male',
      blood_group: blood_group || 'O+',
      race_category_id: finalCatId,
      t_shirt_size: t_shirt_size || 'M',
      emergency_name: emergency_name || `${full_name} Contact`,
      emergency_mobile: emergency_mobile || mobile,
      emergency_relation: emergency_relation || 'Contact',
      medical_info: medical_info || null,
      registration_status: 'Confirmed',
      payment_status: 'Paid',
      razorpay_order_id: razorpay_order_id || null,
      razorpay_payment_id: razorpay_payment_id || `pay_mock_${Date.now()}`,
      razorpay_signature: razorpay_signature || 'mock_signature'
    });

    const participantObj = {
      ...newParticipant.toObject(),
      id: newParticipant._id.toString(),
      race_name: selectedRace.name,
      race_distance: selectedRace.distance,
      race_fee: selectedRace.fee
    };

    console.log(`[Razorpay Payment Successful] Participant ${registration_id} (${full_name}) registered with payment ID ${newParticipant.razorpay_payment_id}`);

    return res.status(201).json({
      success: true,
      message: 'Payment verified and registration completed successfully!',
      registration_id,
      participant: participantObj
    });
  } catch (err) {
    console.error('[Razorpay Verify Payment Error]:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Payment verification or registration failed.'
    });
  }
};
