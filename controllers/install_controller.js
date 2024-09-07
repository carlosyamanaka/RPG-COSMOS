const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');
const Categoria = require('../models/Categoria');
const Missao = require('../models/Missao');
const Usuario = require('../models/Usuario');

//Ligação N:M Missão - Usuário
exports.MissaoUsuario = sequelize.define(
    'MissaoUsuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    eh_mestre: DataTypes.BOOLEAN,
}, { timestamps: false },
)
Missao.belongsToMany(Usuario, { through: 'MissaoUsuario', foreignKey: 'id_missao' })
Usuario.belongsToMany(Missao, { through: 'MissaoUsuario', foreignKey: 'email_usuario' })

//Ligação 1:N Missão - Categoria
Missao.belongsTo(Categoria, { foreignKey: "id_categoria", timestamps: false })
Categoria.hasMany(Missao, { foreignKey: "id_categoria", timestamps: false })


exports.install = async (req, res) => {
    try {
        await sequelize.sync({ force: true }); //Cria o banco de dados

        //Usuário adm
        const usuario_adm = await Usuario.create({ email_usuario: 'admin@gmail.com', senha: 'admin', saldo_em: 0, saldo_ec: 0, role: 'admin', data_ingresso_mestre: null, quantidade_missoes_mestradas: 0, saldo_pm: 0 });

        //Popular o banco
        const usuarios = await Usuario.bulkCreate([
            { email_usuario: 'mestre@gmail.com', senha: 'mestre', saldo_em: 10, saldo_ec: 10, role: 'mestre', data_ingresso_mestre: '1980-01-01', quantidade_missoes_mestradas: 3, saldo_pm: 9 },
            { email_usuario: 'j2@gmail.com', senha: 'jogador2', saldo_em: 10, saldo_ec: 10, role: 'player', data_ingresso_mestre: null, quantidade_missoes_mestradas: 0, saldo_pm: 0 },
            { email_usuario: 'j3@gmail.com', senha: 'jogador3', saldo_em: 10, saldo_ec: 10, role: 'player', data_ingresso_mestre: null, quantidade_missoes_mestradas: 0, saldo_pm: 0 },
            { email_usuario: 'j4@gmail.com', senha: 'jogador4', saldo_em: 10, saldo_ec: 10, role: 'player', data_ingresso_mestre: null, quantidade_missoes_mestradas: 0, saldo_pm: 0 },
            { email_usuario: 'j5@gmail.com', senha: 'jogador5', saldo_em: 10, saldo_ec: 10, role: 'player', data_ingresso_mestre: null, quantidade_missoes_mestradas: 0, saldo_pm: 0 },
        ]);

        const categorias = await Categoria.bulkCreate([
            { nome: 'Frenetica' },
            { nome: 'Narrativa' },
            { nome: 'Completa' },
            { nome: 'Horda' },
            { nome: 'Contratempo' },
        ]);

        const missoes = await Missao.bulkCreate([
            { nome: 'Campos floridos', data: '2025-09-26', dificuldade: 3, id_categoria: 2, recompensa_em: 1, recompensa_ec: 1, relatorio: 'Missao narrativa para desenvolvimento de personagem', role: 'mestre' },
            { nome: 'Biblioteca de sangue', data: '2025-01-01', dificuldade: 2, id_categoria: 1, recompensa_em: 2, recompensa_ec: 2, relatorio: 'Missao de combate contra uma criatura chamada Lótus negra' },
            { nome: 'Caos vivo', data: '2025-01-10', dificuldade: 1, id_categoria: 3, recompensa_em: 3, recompensa_ec: 3, relatorio: 'Missao completa que envolveu um combate contra uma criatura de energia e resolução de enigmas' },
            { nome: 'Infestação zumbi', data: '2025-03-02', dificuldade: 2, id_categoria: 4, recompensa_em: 2, recompensa_ec: 2, relatorio: 'Missao de sobrevivencia contra o Infecticídio' },
            { nome: 'Caos vivo', data: '2025-09-17', dificuldade: 1, id_categoria: 5, recompensa_em: 3, recompensa_ec: 3, relatorio: 'Missao de contratempo em que precisavam desarmar uma bomba em 1 hora' },
        ]);

        //Relação N:M
        await missoes[0].addUsuario(usuarios[0], { through: { eh_mestre: true } })
        await missoes[0].addUsuario(usuarios[1], { through: { eh_mestre: false } })
        await missoes[0].addUsuario(usuarios[2], { through: { eh_mestre: false } })
        await missoes[0].addUsuario(usuarios[3], { through: { eh_mestre: false } })
        
        await missoes[1].addUsuario(usuarios[0], { through: { eh_mestre: true } })
        await missoes[1].addUsuario(usuarios[1], { through: { eh_mestre: false } })
        await missoes[1].addUsuario(usuarios[2], { through: { eh_mestre: false } })
        await missoes[1].addUsuario(usuarios[4], { through: { eh_mestre: false } })

        await missoes[2].addUsuario(usuarios[0], { through: { eh_mestre: true } })
        await missoes[2].addUsuario(usuarios[1], { through: { eh_mestre: false } })
        await missoes[2].addUsuario(usuarios[3], { through: { eh_mestre: false } })
        await missoes[2].addUsuario(usuarios[4], { through: { eh_mestre: false } })

        await missoes[3].addUsuario(usuarios[0], { through: { eh_mestre: true } })
        await missoes[3].addUsuario(usuarios[2], { through: { eh_mestre: false } })
        await missoes[3].addUsuario(usuarios[3], { through: { eh_mestre: false } })
        await missoes[3].addUsuario(usuarios[4], { through: { eh_mestre: false } })

        await missoes[4].addUsuario(usuarios[0], { through: { eh_mestre: true } })
        await missoes[4].addUsuario(usuarios[1], { through: { eh_mestre: false } })
        await missoes[4].addUsuario(usuarios[2], { through: { eh_mestre: false } })
        await missoes[4].addUsuario(usuarios[3], { through: { eh_mestre: false } })


        res.status(201).json({ message: 'Banco de dados criado e usuário administrador inserido!' });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: error.message });
    }
};
