const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

class Categoria extends Model { }

// Modelo de categoria
Categoria.init({
    id_categoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'Categoria',
    timestamps: false,
});

module.exports = Categoria;