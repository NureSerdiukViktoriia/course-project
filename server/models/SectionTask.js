const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const ModuleSection = require("./ModuleSection");

const SectionTask = sequelize.define(
  "SectionTask",
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

    type: {
      type: DataTypes.ENUM(
        "true_false",
        "multiple_choice",
        "matching",
        "fill_blank",
        "listening_question",
      ),
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { tableName: "section_task", timestamps: false },
);

ModuleSection.hasMany(SectionTask, { foreignKey: "module_section_id" });
SectionTask.belongsTo(ModuleSection, { foreignKey: "module_section_id" });

module.exports = SectionTask;
