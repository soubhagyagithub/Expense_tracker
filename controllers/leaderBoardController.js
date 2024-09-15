
const User = require("../models/userModel");
const Expense = require("../models/expenseModel");
const sequelize = require("../util/database");



exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.findAll({
            attributes: ['id', 'name', 'totalExpenses'],
            order: [['totalExpenses', 'DESC']]
        });
        res.status(200).json(leaderboard);
    } catch (err) {
        console.log(err);
        res.status(400).json(null);
    }
};


// exports.getLeaderboard = (req, res, next) => {
//   Expense.findAll({
//     attributes: [
//       [sequelize.fn("sum", sequelize.col("amount")), "totalExpense"],
//       [sequelize.col("user.name"), "name"],
//     ],
//     group: ["userId"],
//     include: [
//       {
//         model: User,
//         attributes: [],
//       },
//     ],
//     order: [[sequelize.fn("sum", sequelize.col("amount")), "DESC"]],
//   })
//     .then((expenses) => {
//       const result = expenses.map((expense) => ({
//         name: expense.getDataValue("name"),
//         amount: expense.getDataValue("totalExpense"),
//       }));
//       res.send(JSON.stringify(result));
//     })
//     .catch((err) => console.log(err));
// };
