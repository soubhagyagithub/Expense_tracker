const sequelize = require('../database/connection');
const User = require('../models/User');
const Expense = require('../models/Expense');

exports.getLeaderboard = async (req, res) => {
    try{
        const leaderboard = await User.findAll({
            attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group:['user.id'],
            order:[['total_cost', 'DESC']]
        })
        res.json(leaderboard);
    }
    catch(err){
        console.log(err);
    }
}