const User = require('../models/User');
const path = require('path');

const rootDir = path.dirname(require.main.filename);

function isStringInvalid(string){
    if(string==undefined || string.length===0){
        return true
    }else{
        return false
    }
}
exports.createNewUser=async (req,res,next) =>{
    try{
        const { name,email,password}= req.body;
        console.log(email, email, password)
        if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password) ){
            return res.status(400).json({err:'Something Is missing'})
        }
        
            await User.create({name,email,password})
            res.status(201).json({message:'Sign Up Succesful'}) 
    }      
    catch(err){
        console.log(err)
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


exports.loginForm = (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'login.html'));
}

exports.authenticateUser = async (req, res) =>{
    try{
        const user = await User.findOne({
            where : {
                email : req.params.email
            }
        });
        if(user){
            if(user.password === req.body.userPassword){
                res.send('User Authenticated')
            }else{
                res.status(401).send('Incorrect Email or Password')
            }
        }else{
            res.status(404).send("Account Doesn't Exist");
        }
    }
    catch(err){
        console.error(err);
    }
}