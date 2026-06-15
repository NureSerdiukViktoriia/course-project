const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const AiMessage = sequelize.define(
  "AiMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sender_role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text_content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "ai_message",
    timestamps: false,
  }
);

module.exports = AiMessage;