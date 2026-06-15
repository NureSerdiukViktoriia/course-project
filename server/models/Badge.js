const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Badge = sequelize.define(
  "Badge",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.TEXT,
    description: DataTypes.TEXT,
    icon: DataTypes.TEXT,
    min_xp: DataTypes.INTEGER,
  },
  {
    tableName: "badges",
    timestamps: false,
  }
);

module.exports = Badge;