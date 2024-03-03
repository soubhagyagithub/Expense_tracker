const Sequelize = require('sequelize');

const sequelize = new Sequelize('expenses','root','Silu933@#1999',{
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize;