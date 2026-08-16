const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Medicine = sequelize.define('Medicine', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dose: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'taken', 'skipped'),
    defaultValue: 'pending',
  },
});

module.exports = Medicine;
