const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

const User = sequelize.define('User',{
   id: {
    type : Sequelize.INTEGER,
    primaryKey : true,
    autoIncrement : true,
    allowNull : false
   },
   name : {
    type : Sequelize.STRING,
    allowNull : false
   },
   email : {
    type : Sequelize.STRING,
    allowNull : false
   },
   password : {
    type : Sequelize.STRING,
    allowNull : false
   }


})

module.exports = User;