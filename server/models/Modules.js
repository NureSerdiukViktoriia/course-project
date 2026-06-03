const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Modules = sequelize.define(
  "Modules",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "modules",
    timestamps: false,
  },
);

module.exports = Modules;
