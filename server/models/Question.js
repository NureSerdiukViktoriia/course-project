const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    exercise_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    question_text: {
      type: DataTypes.TEXT,
    },
    options: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("options");
        return rawValue ? JSON.parse(rawValue) : [];
      },
    },
    correct_answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    word_to_learn: {
      type: DataTypes.STRING,
    },
    translation: {
      type: DataTypes.TEXT,
    },

    difficulty_level: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "початковий",
    },
  },
  {
    tableName: "questions",
    timestamps: false,
  }
);

module.exports = Question;
