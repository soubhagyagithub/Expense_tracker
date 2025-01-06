const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_SCHEMA,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
    dialect: process.env.DIALECT,
    host: process.env.DB_HOST
    }
);

module.exports = sequelize;