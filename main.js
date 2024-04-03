const express = require('express')
const app = express()

require('dotenv').config()
const cors = require('cors')
const fs = require('fs');
const https = require('https')
const bodyParser =require('body-parser')
const sequelize = require('./database/connection')
const path = require('path')



//models
const User =require('./models/userModels')
const Expense =require('./models/expensesModel')
const Order = require('./models/ordersModel')
const Forgotpassword = require('./models/forgotpasswordModel');
const Downloads = require('./model/downloadedReportsModel'); 



//importing routes
const adminRoute = require('./routes/adminRoutes');
const userRoute = require('./routes/userRoutes');
const orderRoute = require('./routes/purchaseRoutes');
const premiumUserRoutes = require('./routes/premiumFeaturesRoutes')
const PasswordRouter = require('./routes/resetPasswordRoutes')
   


//log file
const accessLogstream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public/view/signup.html'));
});
//middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));




//registering routes to app
app.use(adminRoute); 
app.use(userRoute); 
app.use(orderRoute); 
app.use('/premium',premiumUserRoutes)
app.use('/password',PasswordRouter)





  
  
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname,'public/view/404.html'));
});





//Associations
User.hasMany(Expense,{foreignKey: 'usersTbId',sourceKey: 'id', onDelete:'CASCADE'});
Expense.belongsTo(User,{Constraints: true, onDelete: "CASCADE"});

User.hasMany(Order,{foreignKey: 'usersTbId',sourceKey: 'id', onDelete:'CASCADE'})
Order.belongsTo(User,{Constraints: true, onDelete: "CASCADE"})

User.hasMany(Forgotpassword,{foreignKey: 'usersTbId',sourceKey: 'id', onDelete:'CASCADE'});
Forgotpassword.belongsTo(User,{Constraints: true, onDelete: "CASCADE"});


sequelize.sync()
    .then(res=>{ app.listen(3000) })
    .catch(err=>console.log("error in connection..",err))

