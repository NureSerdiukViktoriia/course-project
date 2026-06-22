const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const AISuggestion = sequelize.define(
  "AISuggestion",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "AISuggestions",
    timestamps: false,
  }
);

module.exports = AISuggestion;