const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const ModuleSection = require("./ModuleSection");

const TestListeningTask = sequelize.define(
  "TestListeningTask",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    module_section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ModuleSection,
        key: "id",
      },
    },
    category: {
      type: DataTypes.ENUM("listening", "grammar", "vocabulary"),
      allowNull: false,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    options: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    correct_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "test_listening_task",
    timestamps: false,
  },
);

ModuleSection.hasMany(TestListeningTask, { foreignKey: "module_section_id" });
TestListeningTask.belongsTo(ModuleSection, { foreignKey: "module_section_id" });

module.exports = TestListeningTask;
