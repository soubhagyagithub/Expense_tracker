const path = require("path");
const User = require("../models/userModel");
const ResetPassword = require("../models/resetPasswordModel");
const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;

// Utility function to hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

// Serve forgot password page
exports.forgotPasswordPage = async (req, res) => {
  try {
    res
      .status(200)
      .sendFile(path.join(__dirname, "../public/views/forgotPassword.html"));
  } catch (error) {
    console.error(error);
  }
};

// Handle sending reset password email
exports.sendMail = async (req, res) => {
  try {
    const { email } = req.body;
    const requestId = uuidv4();
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "Please provide the registered email!",
      });
    }

    await ResetPassword.create({
      id: requestId,
      isActive: true,
      userId: user.id,
    });

    const client = Sib.ApiClient.instance;
    client.authentications["api-key"].apiKey =
      process.env.RESET_PASSWORD_API_KEY;

    const transEmailApi = new Sib.TransactionalEmailsApi();
    const sender = { email: "ssoubhagyaranjan98@gmail.com", name: "Soubhagya" };
    const receivers = [{ email }];

    await transEmailApi.sendTransacEmail({
      sender,
      To: receivers,
      subject: "Expense Tracker Reset Password",
      textContent: "Link Below",
      htmlContent: `
        <h3>Hi! We received a password reset request. Here is your link:</h3>
        <a href="https://trackmoney.xyz/password/resetPasswordPage/{{params.requestId}}">Click Here</a>`,
      params: { requestId },
    });

    res.status(200).json({
      message: "Link for resetting the password has been successfully sent!",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(409).json({ message: "Failed to send password reset link!" });
  }
};

// Serve reset password page
exports.resetPasswordPage = async (req, res) => {
  try {
    res
      .status(200)
      .sendFile(path.join(__dirname, "../public/views/resetPassword.html"));
  } catch (error) {
    console.error(error);
  }
};

// Update user's password
exports.updatePassword = async (req, res) => {
  try {
    const requestId = req.headers.referer.split("/").pop();
    const { password } = req.body;

    const resetRequest = await ResetPassword.findOne({
      where: { id: requestId, isActive: true },
    });

    if (!resetRequest) {
      return res.status(409).json({
        message: "Link is already used once. Please request a new link!",
      });
    }

    await ResetPassword.update(
      { isActive: false },
      { where: { id: requestId } }
    );
    const newPassword = await hashPassword(password);

    await User.update(
      { password: newPassword },
      { where: { id: resetRequest.userId } }
    );

    res.status(200).json({ message: "Password changed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(409).json({ message: "Failed to change password!" });
  }
};
