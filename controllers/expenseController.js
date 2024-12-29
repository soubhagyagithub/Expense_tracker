const path = require("path");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../util/database");

exports.getHomePage = async (req, res, next) => {
  try {
    res.sendFile(
      path.join(__dirname, "../", "public", "views", "homePage.html")
    );
  } catch {
    (err) => console.log(err);
  }
};

exports.addExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { category, description, amount } = req.body;

    await User.update(
      { totalExpenses: req.user.totalExpenses + Number(amount) },
      { where: { id: req.user.id }, transaction: t }
    );

    await Expense.create(
      {
        category: category,
        description: description,
        amount: amount,
        userId: req.user.id,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(200).json({ success: true });
  } catch (err) {
    await t.rollback();
    console.log(err);
    res.status(500).json({ success: false });
  }
};

exports.getExpenses= async (req, res, next) => {
  try {
    if(!req.query.page){
      req.query = {
          page : 1,
          size : 10
      }
    }
   
    console.log(req.query);
        const expenses = await req.user.getExpenses({
            offset : ((parseInt(req.query.page)-1) * parseInt(req.query.size)),
            limit: parseInt(req.query.size),
            order: [['createdAt', 'DESC']]
        });   
        const totalExpenses = await req.user.getExpenses({
          attributes: [
              [sequelize.fn('COUNT', sequelize.col('id')), 'TOTAL_EXPENSES'],
          ]
        });
        const isPremium = req.user.dataValues.isPremiumUser
        const data = {
            isPremium : isPremium,
            expenses : expenses,
            totalExpenses : totalExpenses[0].dataValues.TOTAL_EXPENSES
        }
        res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
};


exports.deleteExpense = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
      const expenseId = req.params.id;

      // Find the expense to get its amount
      const expense = await Expense.findByPk(expenseId, { transaction });

      if (!expense) {
          await transaction.rollback();
          return res.status(404).json({ message: "Expense not found" });
      }

      const amount = expense.amount;

      // Delete the expense
      await Expense.destroy({
          where: { id: expenseId },
          transaction
      });

      // Update the totalExpenses in User table
      await req.user.update({
          totalExpenses: req.user.totalExpenses - amount
      }, { transaction });

      // Commit the transaction if everything is successful
      await transaction.commit();
      res.json({ success: true });
  } catch (err) {
      console.log(err);
      // Rollback the transaction in case of error
      await transaction.rollback();
      res.status(500).json(null);
  }
}

exports.editExpense = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
      const { amount, description, category } = req.body;
      const expenseId = req.params.id;

      // Find the expense to get the old amount
      const expense = await Expense.findByPk(expenseId, { transaction });

      if (!expense) {
          await transaction.rollback();
          return res.status(404).json({ message: "Expense not found" });
      }

      const oldAmount = expense.amount;

      // Update the expense
      await Expense.update({
          amount,
          description,
          category
      }, {
          where: { id: expenseId },
          transaction
      });

      // Update the totalExpenses in User table
      await req.user.update({
          totalExpenses: req.user.totalExpenses - oldAmount + Number(amount)
      }, { transaction });

      // Commit the transaction if everything is successful
      await transaction.commit();
      res.json({ success: true });
  } catch (err) {
      console.log(err);
      // Rollback the transaction in case of error
      await transaction.rollback();
      res.status(500).json(null);
  }
}
