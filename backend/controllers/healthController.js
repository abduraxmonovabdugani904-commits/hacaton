const User = require('../models/User');
const Water = require('../models/Water');
const Workout = require('../models/Workout');
const Sleep = require('../models/Sleep');
const Medicine = require('../models/Medicine');
const { Op } = require('sequelize');

exports.calculateHealthScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Water score (max 20)
    const waterToday = await Water.sum('amount', {
      where: { userId, timestamp: { [Op.gte]: today } }
    }) || 0;
    const waterScore = Math.min(20, (waterToday / 2000) * 20);

    // Workout score (max 30)
    const workoutToday = await Workout.sum('duration', {
      where: { userId, timestamp: { [Op.gte]: today } }
    }) || 0;
    const workoutScore = Math.min(30, (workoutToday / 60) * 30);

    // Sleep score (max 30)
    const sleepToday = await Sleep.findOne({
      where: { userId, timestamp: { [Op.gte]: today } },
      order: [['timestamp', 'DESC']]
    });
    const sleepScore = sleepToday ? Math.min(30, (sleepToday.duration / 8) * 30) : 0;

    // Medicine score (max 20)
    const medicineTotal = await Medicine.count({ where: { userId } });
    const medicineTaken = await Medicine.count({ where: { userId, status: 'taken' } });
    const medicineScore = medicineTotal > 0 ? (medicineTaken / medicineTotal) * 20 : 20;

    const totalScore = Math.round(waterScore + workoutScore + sleepScore + medicineScore);

    await User.update({ health_score: totalScore }, { where: { id: userId } });

    res.json({
      health_score: totalScore,
      details: {
        waterScore,
        workoutScore,
        sleepScore,
        medicineScore
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
