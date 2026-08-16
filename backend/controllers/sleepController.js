const Sleep = require('../models/Sleep');

exports.addSleep = async (req, res) => {
  try {
    const { duration, quality } = req.body;
    const sleep = await Sleep.create({ userId: req.user.id, duration, quality });
    res.status(201).json(sleep);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSleepLogs = async (req, res) => {
  try {
    const logs = await Sleep.findAll({ where: { userId: req.user.id } });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
