const { Participant, RaceCategory, ContactMessage } = require('../db');

exports.getStats = async (req, res) => {
  try {
    // 1. Core Summary Metrics
    const total_registrations = await Participant.countDocuments();

    const distinctEmails = await Participant.distinct('email');
    const total_participants = distinctEmails.length || total_registrations;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const today_registrations = await Participant.countDocuments({ created_at: { $gte: startOfToday } });

    const confirmed_registrations = await Participant.countDocuments({ registration_status: 'Confirmed' });
    const pending_registrations = await Participant.countDocuments({ registration_status: 'Pending' });
    const total_messages = await ContactMessage.countDocuments();

    // 2. Gender Breakdown
    const male_participants = await Participant.countDocuments({ gender: /^male$/i });
    const female_participants = await Participant.countDocuments({ gender: /^female$/i });
    const other_participants = await Participant.countDocuments({
      gender: { $not: /^male$|^female$/i }
    });

    // 3. Race Categories & Distance Breakdown
    const races = await RaceCategory.find().lean();
    const raceMap = new Map(races.map(r => [r.id, r]));

    const reg_3k = await Participant.countDocuments({ race_category_id: 1 });
    const reg_5k = await Participant.countDocuments({ race_category_id: 2 });
    const reg_10k = await Participant.countDocuments({ race_category_id: 3 });
    const reg_21k = await Participant.countDocuments({ race_category_id: 4 });
    const reg_42k = await Participant.countDocuments({ race_category_id: 5 });

    // 4. Total Revenue Calculation
    const paidParticipants = await Participant.find({ payment_status: 'Paid' }, 'race_category_id').lean();
    let total_revenue = 0;
    paidParticipants.forEach(p => {
      const race = raceMap.get(p.race_category_id);
      total_revenue += race ? race.fee : 499;
    });

    // 5. Category-wise Registrations Aggregation
    const categoryStats = races.map(r => {
      const count = paidParticipants.filter(p => p.race_category_id === r.id).length;
      return {
        category: r.name,
        distance: r.distance,
        count: count,
        revenue: count * r.fee
      };
    });

    // 6. Gender Stats Array
    const genderAgg = await Participant.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);
    const genderStats = genderAgg.map(g => ({
      gender: g._id || 'Not Specified',
      count: g.count
    }));

    // 7. T-Shirt Size Distribution Array
    const tshirtAgg = await Participant.aggregate([
      { $group: { _id: '$t_shirt_size', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const tshirtStats = tshirtAgg.map(t => ({
      size: t._id || 'M',
      count: t.count
    }));

    // 8. T-Shirt Category Matrix Breakdown
    const matrixAgg = await Participant.aggregate([
      {
        $group: {
          _id: { race_id: '$race_category_id', size: '$t_shirt_size' },
          count: { $sum: 1 }
        }
      }
    ]);
    const tshirtMatrix = matrixAgg.map(m => {
      const race = raceMap.get(m._id.race_id);
      return {
        race_name: race ? race.name : '3K Fun Run',
        size: m._id.size || 'M',
        count: m.count
      };
    });

    // 9. Recent Registrations
    const recentRaw = await Participant.find()
      .sort({ created_at: -1 })
      .limit(10)
      .lean();

    const recentRegistrations = recentRaw.map(p => {
      const race = raceMap.get(p.race_category_id);
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
      return {
        ...p,
        id: p._id.toString(),
        race_name: race ? race.name : '3K Fun Run',
        race_distance: race ? race.distance : '3K',
        age
      };
    });

    // 10. Recent Contact Messages
    const recentMessagesRaw = await ContactMessage.find()
      .sort({ created_at: -1 })
      .limit(10)
      .lean();

    const recentMessages = recentMessagesRaw.map(m => ({
      ...m,
      id: m._id.toString()
    }));

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
      tshirtMatrix: tshirtMatrix || [],
      recentRegistrations: recentRegistrations || [],
      recentMessages: recentMessages || []
    });
  } catch (err) {
    console.error('Dashboard Stats Error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to aggregate dashboard metrics from MongoDB Atlas.',
      error: err.message
    });
  }
};
