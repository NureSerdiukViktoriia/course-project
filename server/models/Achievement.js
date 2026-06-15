const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Achievement = sequelize.define(
  "Achievement",
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

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    condition_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    condition_value: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    xp_reward: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "achievements",
    timestamps: false,
  }
);

module.exports = Achievement;