const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userAuthentication = require("../middleware/auth");

router.use(express.static("public"));

router.get("/", userController.getLoginPage);
router.get("/login", userController.getLoginPage);
router.get("/signUp", userController.getLoginPage);


router.post("/login", userController.postUserLogin);
router.post("/signUp", userController.postUserSignUp);
router.get('/checkPremium',userAuthentication, userController.isPremiumUser);

module.exports = router;
