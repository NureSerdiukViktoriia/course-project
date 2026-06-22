const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const AITopic = sequelize.define(
  "AITopic",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "💬",
    },
  },
  {
    tableName: "AITopics",
    timestamps: false,
  }
);

module.exports = AITopic;