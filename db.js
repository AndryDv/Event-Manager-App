const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL successfully");
    return true; 
  } catch (error) {
    console.error("❌ Unable to connect to MySQL:", error.message);
    process.exit(1); // Termine le processus en cas d'échec
  }
};

module.exports = { sequelize, connectDB };