const path = require("path");
const Expense = require("../models/expenseModel");
const { Op } = require("sequelize");

exports.getReportsPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "reports.html"));
};

exports.dailyReports = async (req, res, next) => {
  try {
    const date = req.body.date;

    if (!date) {
      return res.status(400).send("Date is required");
    }

    const [year, month, day] = date.split("-").map(Number);
    const startDate = new Date(year, month - 1, day);
    const endDate = new Date(year, month - 1, day + 1); // Add 1 day to include the whole day

    const expenses = await Expense.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        userId: req.user.id,
      },
    });

    return res.send(expenses);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};

exports.monthlyReports = async (req, res, next) => {
  try {
    const month = req.body.month;

    if (!month) {
      return res.status(400).send("Month is required");
    }

    const [year, monthNum] = month.split("-").map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0); // Last day of the month

    const expenses = await Expense.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        userId: req.user.id,
      },
    });

    return res.send(expenses);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};
