const Water = require('../models/Water');

exports.addWater = async (req, res) => {
  try {
    const { amount } = req.body;
    const water = await Water.create({ userId: req.user.id, amount });
    res.status(201).json(water);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWaterLogs = async (req, res) => {
  try {
    const logs = await Water.findAll({ where: { userId: req.user.id } });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
