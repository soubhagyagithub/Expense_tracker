const router = require('express').Router();
const premController = require('../controllers/premiumFeaturesController')
const authMiddleware = require("../middleware/auth");


router.get('/getRankers', authMiddleware.authenticate, premController.getLeaderboard);
router.get('/downloadExpensesReport', authMiddleware.authenticate, premController.getExpenseReport)

router.get('/showPrevDownloads',authMiddleware.authenticate, premController.showUsersDownloads)

module.exports = router;                  