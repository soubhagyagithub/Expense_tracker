const express = require("express");

const purchaseMembershipController = require("../controllers/purchaseMembershipController");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/premiumMembership",authMiddleware.authenticate,purchaseMembershipController.purchasePremium);

router.post("/updateTransactionStatus",authMiddleware.authenticate,purchaseMembershipController.updateTransactionStatus);

module.exports = router;
