const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ExerciseSetting = sequelize.define(
  "ExerciseSetting",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    exercise_type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    xp_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },

    question_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
  },
  {
    tableName: "ExerciseSettings",
    timestamps: false,
  }
);

module.exports = ExerciseSetting;