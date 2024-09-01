const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/bd');
class Missao extends Model { }

// Modelo de categoria
Missao.init({
    id_missao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    dificuldade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categoria',
            key: 'id_categoria',
        }
    },
    recompensa_em: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    recompensa_ec: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    relatorio: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'Missao',
    timestamps: false,
});

module.exports = Missao;