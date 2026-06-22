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
      type: DataTypes.ENUM("vocabulary", "listening", "reading", "grammar"),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    media: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
Modules.hasMany(ModuleSection, { foreignKey: "module_id" });
ModuleSection.belongsTo(Modules, { foreignKey: "module_id" });

module.exports = ModuleSection;
