const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const ModuleSection = require("./ModuleSection");
const User = require("./User");

const ModuleSectionProgress = sequelize.define(
  "ModuleSectionProgress",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: User,
        key: "id",
      },
    },
    module_section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "module_section_id",
      references: {
        model: ModuleSection,
        key: "id",
      },
    },
  },
  {
    tableName: "module_section_progress",
    timestamps: false,
  },
);
ModuleSection.hasMany(ModuleSectionProgress, {
  foreignKey: "module_section_id",
});
ModuleSectionProgress.belongsTo(ModuleSection, {
  foreignKey: "module_section_id",
});

User.hasMany(ModuleSectionProgress, { foreignKey: "user_id" });
ModuleSectionProgress.belongsTo(User, { foreignKey: "user_id" });

module.exports = ModuleSectionProgress;
