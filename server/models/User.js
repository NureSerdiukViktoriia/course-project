const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define(
  "User",
  {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    second_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.ENUM("Початковий", "Середній", "Просунутий"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = User;
