const Sequelize = require('sequelize');
const sequelize = require('../database/connection');
const User = sequelize.define('User', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        allowNul : false
    },
    name : {
        type : Sequelize.STRING,
        allowNul : false
    },
    email : {
        type : Sequelize.STRING,
        unique : true,
        allowNul : false
    },
    password : {
        type : Sequelize.STRING,
        allowNul : false
    },
    jwt : {
        type: Sequelize.STRING,
        allowNul : true
    }
});

module.exports = User;