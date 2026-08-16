const SOS = require('../models/SOS');

exports.addSOSContact = async (req, res) => {
  try {
    const { contactName, contactPhone, message } = req.body;
    const sos = await SOS.create({ userId: req.user.id, contactName, contactPhone, message });
    res.status(201).json(sos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSOSContacts = async (req, res) => {
  try {
    const contacts = await SOS.findAll({ where: { userId: req.user.id } });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendSOS = async (req, res) => {
  try {
    const contacts = await SOS.findAll({ where: { userId: req.user.id } });
    // In a real app, you would use an SMS API (like Twilio) here
    res.json({ message: `SOS yuborildi ${contacts.length} ta kontaktga`, contacts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
