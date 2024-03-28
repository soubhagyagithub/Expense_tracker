const Sequelize = require('sequelize');
const sequelize = require('../database/connection')

const ForgotPassword = sequelize.define('forgotpassword_tb', {
    id:{
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,  
});

module.exports = ForgotPassword;
