const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
// const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();
const sequelize = require("./util/database");

//log file
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("combined", { stream: accessLogStream }));
// app.use(helmet());

// Routers
const userRouter = require("./router/userRouter");
const expenseRouter = require("./router/expenseRouter");
const purchaseMembershipRouter = require("./router/purchaseMembershipRouter");
const premiumFeaturesRouter = require("./router/premiumFeaturesRouter");
const resetPasswordRouter = require("./router/resetPasswordRouter");
const reportsRouter = require("./router/reportsRouter");

app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/homePage", expenseRouter);
app.use("/expense", expenseRouter);
app.use("/purchase", purchaseMembershipRouter);
app.use("/premium", premiumFeaturesRouter);
app.use("/password", resetPasswordRouter);
app.use("/reports", reportsRouter);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "views", "404.html"));
});

// Models and associations
const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const Order = require("./models/ordersModel");
const ResetPassword = require("./models/resetPasswordModel");
const Downloads = require("./models/downloadedReportsModel");

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ResetPassword);
ResetPassword.belongsTo(User);

User.hasMany(Downloads);
Downloads.belongsTo(User);

// Sync database and start server
sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(process.env.PORT || 3005);
  })
  .catch((err) => console.error(err));
