const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const ModuleSection = require("./ModuleSection");

const Task = sequelize.define(
  "Task",
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
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },

    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    options: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    correct_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "task",
    timestamps: false,
  },
);

ModuleSection.hasMany(Task, { foreignKey: "module_section_id" });
Task.belongsTo(ModuleSection, { foreignKey: "module_section_id" });

module.exports = Task;
