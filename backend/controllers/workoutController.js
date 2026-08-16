const Workout = require('../models/Workout');

exports.addWorkout = async (req, res) => {
  try {
    const { type, duration, calories } = req.body;
    const workout = await Workout.create({ userId: req.user.id, type, duration, calories });
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.findAll({ where: { userId: req.user.id } });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
