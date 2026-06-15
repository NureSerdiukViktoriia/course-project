const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const AiConversation = sequelize.define(
  "AiConversation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: "english",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "ai_conversation",
    timestamps: false,
  }
);

module.exports = AiConversation;