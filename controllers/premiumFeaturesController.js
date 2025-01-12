const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const Downloads = require("../models/downloadedReportsModel");
const sequelize = require("sequelize");
const { uploadToS3 } = require("../services/awsS3service");

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.findAll({
      attributes: ["id", "name", "totalExpenses"],
      order: [["totalExpenses", "DESC"]],
    });
    res.status(200).json(leaderboard);
  } catch (err) {
    console.log(err);
    res.status(400).json(null);
  }
};

// Get Expense Report
exports.getExpenseReport = async (req, res) => {
  try {
    const userId = req.user.id; // Accessing userId from req.user
    console.log(userId);

    const overAllExpenses = await Expense.findAll({
      attributes: [
        "amount",
        "description",
        "category",
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"], // Formating createdAt to date only
      ],
      where: { userId },
    });

    if (overAllExpenses) {
      const stringifiedExpenses = JSON.stringify(overAllExpenses);

      const fileName = `expensereport${userId}/${new Date()}.json`;
      const fileUrl = await uploadToS3(stringifiedExpenses, fileName);

      if (fileUrl) {
        await Downloads.create({ fileUrl, userId });
        return res.status(200).json({ fileUrl, success: true });
      }
    } else {
      return res.json({ message: "no data exists..", success: false });
    }
  } catch (err) {
    console.log("Error in fetching expenses data: ", err);
    res.status(500).json({ fileUrl: "", success: false, err });
  }
};

// Show User Previous Download
exports.showUsersDownloads = async (req, res) => {
  try {
    if (req.user.isPremiumUser == null) {
      return res.send(null);
    } else {
      const userId = req.user.id;
      const prevDownloads = await Downloads.findAll({ where: { userId } });
      if (prevDownloads) {
        return res.status(200).json({ prevDownloads, success: true });
      } else {
        return res.json({ message: "No previous Downloads..", success: false });
      }
    }
  } catch (err) {
    console.log("Error in fetching previous Downloads data , error: ", err);
    res.status(500).json(err.message);
  }
};
