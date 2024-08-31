const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

let ids = 0;
let missoes = [];

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

// module.exports = {
//     new(nome) {
//         let missao = { id: ++ids, name: nome };
//         missoes.push(task);
//         return missao;
//     },
//     update(id, nome) {
//         let pos = this.getPositionById(id)
//         if (pos >= 0) {
//             missoes[pos].name = nome;
//         }
//         return missoes[pos]
//     },
//     list() {
//         return missoes;
//     },
//     getElementById(id) {
//         let pos = this.getPositionById(id)
//         if (pos >= 0) {
//             return missoes[pos];
//         }
//         return null;
//     },
//     getPositionById(id) {
//         for (let i = 0; i < missoes.length; i++) {
//             if (missoes[i].id == id) {
//                 return i;
//             }
//         }
//         return -1;
//     },
//     delete(id) {
//         let i = this.getPositionById(id);
//         if (i >= 0) {
//             let obj = missoes[i]
//             missoes.splice(i, 1);
//             return obj;
//         }
//         return null;
//     }
// }