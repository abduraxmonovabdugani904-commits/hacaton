const { Sequelize } = require('sequelize');
require('dotenv').config();

const useSqlite =
  process.env.DB_DIALECT === 'sqlite' ||
  process.env.USE_SQLITE === 'true' ||
  !process.env.DB_HOST;

const sequelize = useSqlite
  ? new Sequelize({
      dialect: 'sqlite',
      storage: process.env.DB_PATH || './database.sqlite',
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME || 'health_db',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
      }
    );

module.exports = sequelize;
