const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SOS = sequelize.define('SOS', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  contactName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    defaultValue: 'I need help! This is an SOS message from my Health App.',
  },
});

module.exports = SOS;
