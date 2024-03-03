const User = require('../models/User');
const path = require('path');

const rootDir = path.dirname(require.main.filename);

exports.createNewUser = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        // Make sure to use the correct property names in req.body
        const result = await User.create({
            // Fixed typo: 'password' instead of 'pasword'
            name,
            email,
            password
          
        });

        console.log(result);
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.checkUser = async (req, res) =>{
    try{
        if(await User.findOne({
            where : {
                email : req.body.userEmail
            }
        })){
            return true;
        }
        return false;
    }
    catch(err){
        console.error(err);
    }
}

exports.signupForm = (req, res) => {

    res.sendFile(path.join(rootDir, 'views', 'signup.html'));
}


exports.loginForm = (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'login.html'));
}