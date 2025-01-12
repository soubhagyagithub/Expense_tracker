const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const DownloadedReports = sequelize.define("downloadedReports", {
  fileUrl: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },
});

module.exports = DownloadedReports;
