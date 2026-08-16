const Medicine = require('../models/Medicine');

exports.addMedicine = async (req, res) => {
  try {
    const { name, dose, time } = req.body;
    const medicine = await Medicine.create({ userId: req.user.id, name, dose, time });
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMedicineStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Medicine.update({ status }, { where: { id, userId: req.user.id } });
    res.json({ message: 'Holat yangilandi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.findAll({ where: { userId: req.user.id } });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
