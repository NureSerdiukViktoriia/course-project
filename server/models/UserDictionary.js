const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); 

const UserDictionary = sequelize.define('UserDictionary', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    word: {
        type: DataTypes.STRING,
        allowNull: false
    },
    translation: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'user_dictionary',
    timestamps: true,
    createdAt: 'added_at',
    updatedAt: false
});

UserDictionary.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(UserDictionary, { foreignKey: 'user_id' });

module.exports = UserDictionary;