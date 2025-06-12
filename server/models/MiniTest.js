const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const MiniTest = sequelize.define(
  "MiniTest",
  {
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    correctAnswerIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 3,
      },
    },
    level: {
      type: DataTypes.ENUM("початковий", "середній", "просунутий"),
      allowNull: false,
    },
  },
  {
    tableName: "miniTest",
    timestamps: false,
  }
);

module.exports = MiniTest;
