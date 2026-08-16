const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Workout = sequelize.define('Workout', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false,
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Workout;
