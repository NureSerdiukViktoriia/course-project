const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Modules = require("./Modules");
const User = require("./User");

const ModuleProgress = sequelize.define(
  "ModuleProgress",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("not_started", "in_progress", "completed"),
      defaultValue: "not_started",
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
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "module_id",
      references: {
        model: Modules,
        key: "id",
      },
    },
  },
  {
    tableName: "module_progress",
    timestamps: false,
  },
);
Modules.hasMany(ModuleProgress, { foreignKey: "module_id" });
ModuleProgress.belongsTo(Modules, { foreignKey: "module_id" });

User.hasMany(ModuleProgress, { foreignKey: "user_id" });
ModuleProgress.belongsTo(User, { foreignKey: "user_id" });

module.exports = ModuleProgress;
