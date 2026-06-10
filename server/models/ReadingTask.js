const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const ModuleSection = require("./ModuleSection");

const ReadingTask = sequelize.define(
  "ReadingTask",
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

    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    answer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "reading_task",
    timestamps: false,
  }
);

ModuleSection.hasMany(ReadingTask, { foreignKey: "module_section_id" });
ReadingTask.belongsTo(ModuleSection, { foreignKey: "module_section_id" });

module.exports = ReadingTask;