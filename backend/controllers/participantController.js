const { Participant, RaceCategory } = require('../db');

// Helper to generate registration ID
function generateRegistrationId() {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `INF-2026-${randomDigits}`;
}

exports.getAll = async (req, res) => {
  try {
    const { search, category_id, status, t_shirt_size } = req.query;
    const filter = {};

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { full_name: searchRegex },
        { email: searchRegex },
        { mobile: searchRegex },
        { registration_id: searchRegex }
      ];
    }

    if (category_id) {
      filter.race_category_id = parseInt(category_id);
    }

    if (status) {
      filter.registration_status = status;
    }

    if (t_shirt_size) {
      filter.t_shirt_size = t_shirt_size;
    }

    const participants = await Participant.find(filter).sort({ created_at: -1 }).lean();
    const races = await RaceCategory.find().lean();
    const raceMap = new Map(races.map(r => [r.id, r]));

    const enriched = participants.map(p => {
      const race = raceMap.get(p.race_category_id) || {};
      return {
        ...p,
        id: p._id.toString(),
        race_name: race.name || '3K Fun Run',
        race_distance: race.distance || '3K',
        race_fee: race.fee || 499
      };
    });

    res.json({ success: true, count: enriched.length, participants: enriched });
  } catch (err) {
    console.error('Get Participants Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve participants.', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    let participant = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      participant = await Participant.findById(id).lean();
    }
    if (!participant) {
      participant = await Participant.findOne({ registration_id: id }).lean();
    }

    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant registration not found.' });
    }

    const race = await RaceCategory.findOne({ id: participant.race_category_id }).lean();
    const enriched = {
      ...participant,
      id: participant._id.toString(),
      race_name: race?.name || '3K Fun Run',
      race_distance: race?.distance || '3K',
      race_fee: race?.fee || 499
    };

    res.json({ success: true, participant: enriched });
  } catch (err) {
    console.error('Get Participant Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve participant details.', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
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
    } = req.body;

    if (!full_name || !email || !mobile) {
      return res.status(400).json({ success: false, message: 'Please enter Full Name, Email, and Phone Number.' });
    }

    // 1. Resolve race category
    let finalCatId = parseInt(race_category_id);
    let selectedRace = null;

    if (!isNaN(finalCatId)) {
      selectedRace = await RaceCategory.findOne({ id: finalCatId }).lean();
    }

    if (!selectedRace) {
      selectedRace = await RaceCategory.findOne({
        $or: [
          { distance: race_category_id },
          { name: new RegExp(String(race_category_id || ''), 'i') }
        ]
      }).lean();
    }

    if (!selectedRace) {
      selectedRace = await RaceCategory.findOne().lean();
    }

    if (!selectedRace) {
      selectedRace = { id: 1, name: '3K Fun Run', distance: '3K', fee: 499 };
    }
    finalCatId = selectedRace.id;

    // 2. Format / Fallback DOB
    let validDob = dob;
    const ageVal = parseInt(age);
    if (!isNaN(ageVal) && ageVal > 0) {
      const birthYear = new Date().getFullYear() - ageVal;
      validDob = `${birthYear}-01-01`;
    } else if (!validDob || String(validDob).trim() === '') {
      validDob = '2000-01-01';
    } else {
      try {
        const d = new Date(validDob);
        validDob = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '2000-01-01';
      } catch (e) {
        validDob = '2000-01-01';
      }
    }

    // 3. Fallbacks for emergency contact
    const eName = emergency_name || `${full_name} Contact`;
    const eMobile = emergency_mobile || mobile;
    const eRelation = emergency_relation || 'Parent/Spouse';

    // 4. Unique Registration ID
    let registration_id = generateRegistrationId();
    let existing = await Participant.findOne({ registration_id });
    while (existing) {
      registration_id = generateRegistrationId();
      existing = await Participant.findOne({ registration_id });
    }

    // 5. Create Participant document in MongoDB
    const newParticipant = await Participant.create({
      registration_id,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      dob: validDob,
      gender: gender || 'Male',
      blood_group: blood_group || 'O+',
      race_category_id: finalCatId,
      t_shirt_size: t_shirt_size || 'M',
      emergency_name: eName,
      emergency_mobile: eMobile,
      emergency_relation: eRelation,
      medical_info: medical_info || null,
      registration_status: 'Confirmed',
      payment_status: 'Paid'
    });

    const participantObj = {
      ...newParticipant.toObject(),
      id: newParticipant._id.toString(),
      race_name: selectedRace.name,
      race_distance: selectedRace.distance,
      race_fee: selectedRace.fee
    };

    console.log(`[MongoDB] New participant registered: ${registration_id} - ${full_name}`);

    return res.status(201).json({
      success: true,
      message: 'Registration completed successfully!',
      registration_id,
      participant: participantObj
    });
  } catch (err) {
    console.error('Create Participant Error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to process registration.'
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { registration_status, payment_status, full_name, email, mobile, t_shirt_size } = req.body;

    let filter = {};
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      filter._id = id;
    } else {
      filter.registration_id = id;
    }

    const updateFields = { updated_at: Date.now() };
    if (registration_status) updateFields.registration_status = registration_status;
    if (payment_status) updateFields.payment_status = payment_status;
    if (full_name) updateFields.full_name = full_name;
    if (email) updateFields.email = email;
    if (mobile) updateFields.mobile = mobile;
    if (t_shirt_size) updateFields.t_shirt_size = t_shirt_size;

    const updated = await Participant.findOneAndUpdate(filter, updateFields, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Participant not found.' });
    }

    res.json({ success: true, message: 'Participant updated successfully.', participant: updated });
  } catch (err) {
    console.error('Update Participant Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update participant.', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    let filter = {};
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      filter._id = id;
    } else {
      filter.registration_id = id;
    }

    const deleted = await Participant.findOneAndDelete(filter);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Participant not found.' });
    }

    res.json({ success: true, message: 'Participant deleted successfully.' });
  } catch (err) {
    console.error('Delete Participant Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete participant.', error: err.message });
  }
};
