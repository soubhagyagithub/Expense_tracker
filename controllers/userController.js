const path = require("path");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Generate access token for user authentication
function generateAccessToken(id, email, name) {
  return jwt.sign({ userId: id, email, name }, process.env.TOKEN);
}

// Middleware to check if the user is a premium user
const isPremiumUser = async (req, res) => {
  try {
    const premiumStatus = req.user.isPremiumUser ? true : false;
    return res.json({ isPremiumUser: premiumStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Serve login page
const getLoginPage = async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../public/views/login.html"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Unable to load login page" });
  }
};

// User signup handler
const postUserSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This email is already taken. Please choose another one.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// User login handler
const postUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist!",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      const token = generateAccessToken(user.id, user.email, user.name);
      return res.status(200).json({
        success: true,
        message: "Login successful!",
        token: token,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Password incorrect!",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  generateAccessToken,
  isPremiumUser,
  getLoginPage,
  postUserSignUp,
  postUserLogin,
};
