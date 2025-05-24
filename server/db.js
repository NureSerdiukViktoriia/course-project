const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./courseprojectdb.sqlite",
  logging: false,
});

module.exports = sequelize;
