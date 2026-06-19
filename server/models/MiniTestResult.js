const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const MiniTest = require("./MiniTest");

const MiniTestResult = sequelize.define(
  "MiniTestResult",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },

    mini_test_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MiniTest,
        key: "id",
      },
    },

    correct_answers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    suggested_level: {
      type: DataTypes.ENUM("A1", "A2", "B1", "B2", "C1"),
      allowNull: true,
    },
  },
  {
    tableName: "mini_test_result",
    timestamps: true,
  },
);

User.hasMany(MiniTestResult, { foreignKey: "user_id" });
MiniTestResult.belongsTo(User, { foreignKey: "user_id" });

MiniTest.hasMany(MiniTestResult, { foreignKey: "mini_test_id" });
MiniTestResult.belongsTo(MiniTest, { foreignKey: "mini_test_id" });

module.exports = MiniTestResult;
