const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const RewardWheel = sequelize.define(
  "RewardWheel",
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
    reward_type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reward_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    spin_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "reward_wheel",
    timestamps: false,
  }
);

module.exports = RewardWheel;