const sequelize = require('../database/connection');

const Expense = require('../models/Expense');


    

exports.getExpenses = async (req, res) => {
    const expenses = await req.user.getExpenses();
    const isPremium = req.user.dataValues.isPremium
    const data = {   
        isPremium : isPremium,
        expenses : expenses
    }
    res.json(data);
} 




exports.postExpense = async (req, res) => {
    const { amount, description, category} = req.body;

    if(amount == '' || description == '' || category == ''){
        res.json({ error: 'Please fill details'});
    }
    
    await Expense.create({

        amount : amount,

        description : description,

        category : category,

        userId : req.user.id

    })

    .then(result => {

        res.status(200).json({expenseCreated: result});

    })

    .catch(err => {

        console.log(err);

        res.json(err.response);

    })

}




exports.deleteExpense = async (req, res) => {

    await Expense.destroy({ where : {

        id : req.params.id

    }})

    .then(result => {

        res.json(result);

    })

    .catch(err => {

        console.log(err);

        res.json(err.response);

    })

}




exports.editExpense = async (req, res) =>{

    await Expense.update({

        amount : req.body.amount,

        description : req.body.description,

        category : req.body.category

    }, { where : {

        id : req.params.id

    }})

    .then(result => {

        res.json(result);

    })

    .catch(err => {

        console.log(err);

        res.json(err.response);

    })

}