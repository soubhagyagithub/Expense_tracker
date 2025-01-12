const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization token missing" });
    }

    // Decode the token
    const decodedToken = jwt.verify(token, process.env.TOKEN);

    // Fetch the full user instance from the database using the userId from the token
    const user = await User.findByPk(decodedToken.userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // Attach the user instance to req.user and also attach userId directly to req.user
    req.user = user;
    req.user.userId = user.id; // Add userId directly to req.user

    next();
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed" });
  }
};
