const User = require('../models/User');
const path = require('path');

exports.createNewUser = async (req, res) => {

    try {
        User.create({
            name: req.body.userName,
            email:req.body.userEmail,
            pasword: req.body.userPassword
    
        }).then(result => {
            console.log(result);
        } )
    } catch (error) {
        console.log(error);
    }

}

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