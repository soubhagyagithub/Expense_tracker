const express = require("express");
const router = express.Router();
const leaderboardController = require("../controllers/leaderboardController");

router.get("/getRankers", leaderboardController.getLeaderboard);

// router.get("/getLeaderboard", leaderboardController.getLeaderboard);

module.exports = router;
