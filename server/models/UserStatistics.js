const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const UserStatistics = sequelize.define(
  "UserStatistics",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    flashcards_correct: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    listening_correct: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    completed_exercise_types: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },

    first_chat_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "user_statistics",
    timestamps: false,
  }
);

module.exports = UserStatistics;