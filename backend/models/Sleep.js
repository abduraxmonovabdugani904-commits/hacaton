const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Sleep = sequelize.define('Sleep', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  duration: {
    type: DataTypes.FLOAT, // in hours
    allowNull: false,
  },
  quality: {
    type: DataTypes.ENUM('poor', 'fair', 'good', 'excellent'),
    defaultValue: 'good',
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Sleep;
