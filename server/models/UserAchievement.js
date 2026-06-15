const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const UserAchievement = sequelize.define("UserAchievement", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  achievement_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  earned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = UserAchievement;