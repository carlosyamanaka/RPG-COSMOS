const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

class Usuario extends Model { }

// Modelo de Usuario
Usuario.init({
    email_usuario: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    saldo_em: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    saldo_ec: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    data_ingresso_mestre: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    quantidade_missoes_mestradas: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    saldo_pm: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
}, {
    sequelize,
    tableName: 'Usuario',
    timestamps: false,
});

module.exports = Usuario;