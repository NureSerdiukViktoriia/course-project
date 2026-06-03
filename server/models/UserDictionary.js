const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); 

const UserDictionary = sequelize.define('UserDictionary', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id', 
        references: {
            model: User,
            key: 'id'
        }
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
    updatedAt: false,
    freezeTableName: true 
});

User.hasMany(UserDictionary, { foreignKey: 'user_id' });
UserDictionary.belongsTo(User, { foreignKey: 'user_id' });

module.exports = UserDictionary;