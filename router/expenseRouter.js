const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const authMiddleware = require("../middleware/auth");

router.use(express.static("public"));

router.get("/", expenseController.getHomePage);

router.get("/getExpense",authMiddleware.authenticate,expenseController.getExpenses);
router.post("/addExpense", authMiddleware.authenticate, expenseController.addExpense);
router.put("/editExpense/:id",authMiddleware.authenticate,expenseController.editExpense);
router.delete("/deleteExpense/:id",authMiddleware.authenticate,expenseController.deleteExpense);

module.exports = router;
