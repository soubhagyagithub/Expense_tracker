const express = require('express');
const userController = require('../controllers/user')


const router = express.Router();

router.get('/signup', userController.signupForm);
router.post('/signup', userController.createNewUser);
router.post('/checkUser', userController.checkUser);

module.exports = router; 