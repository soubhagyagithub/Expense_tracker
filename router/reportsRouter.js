const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");
const authMiddleware = require("../middleware/auth");

router.get("/getReportsPage", reportsController.getReportsPage);
router.post(
  "/dailyReports",
  authMiddleware.authenticate,
  reportsController.dailyReports
);
router.post(
  "/weeklyReports",
  authMiddleware.authenticate,
  reportsController.weeklyReports
);
router.post(
  "/monthlyReports",
  authMiddleware.authenticate,
  reportsController.monthlyReports
);

module.exports = router;
