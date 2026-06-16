const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const WheelReward = sequelize.define(
  "WheelReward",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reward_type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reward_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "wheel_rewards",
    timestamps: false,
  }
);

module.exports = WheelReward;