const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Modules = require("./Modules");

const ModuleSection = sequelize.define(
  "ModuleSection",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        "vocabulary",
        "listening",
        "reading",
        "grammar",
        "test",
      ),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    media: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modules_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "modules_id",
      references: {
        model: Modules,
        key: "id",
      },
    },
  },
  {
    tableName: "module_section",
    timestamps: false,
  },
);
Modules.hasMany(ModuleSection, { foreignKey: "modules_id" });
ModuleSection.belongsTo(Modules, { foreignKey: "modules_id" });
module.exports = ModuleSection;
