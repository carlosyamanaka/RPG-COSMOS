
const Missao = require('../models/Missao');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const MissaoUsuario = require('./install_controller');

dotenv.config();

exports.register_usuario = async (req, res) => {
    try {
        const { email_usuario, senha } = req.body;
        const usuario = await Usuario.create({ email_usuario, senha });

        res.status(201).json(usuario);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.login_usuario = async (req, res) => {
    const { email_usuario, senha } = req.body

    try { //Faz o login
        const usuario = await Usuario.findOne({ where: { email_usuario, senha } });
        if (usuario) {
            const token = jwt.sign({ email_usuario: usuario.email_usuario, role: usuario.role }, process.env.JWT_SECRET, {
                expiresIn: '2h'
            })
            //Se usuario estiver correto, retorna o token de acesso
            res.json({ status: true, token: token })
        } else {
            // Nao possui acesso
            res.status(403).json({ status: false, mensagem: "Usuario e senha invalidos" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.update_usuario = async (req, res) => {
    const { email_usuario } = req.params; //Pega o email do usuario que quer alterar
    const { senha, saldo_em, saldo_ec, quantidade_missoes_mestradas, saldo_pm, data_ingresso_mestre } = req.body; //Novos dados que serão atualizados no update

    try {
        const usuario = await Usuario.findByPk(email_usuario);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (email_usuario != req.usuario.email_usuario) { //Se o usuario estiver tentando se atualizar, ele irá conseguir
            if (req.usuario.role != 'admin') { //Se não for adm não pode atualizar os outros
                return res.status(401).json({ error: 'Não autorizado' });
            }
        }

        //Utilização do || para reatribuir, se for passado um novo valor, ele irá atualizar, se não, ele manterá o antigo
        usuario.senha = senha || usuario.senha;
        usuario.saldo_em = saldo_em || usuario.saldo_em;
        usuario.saldo_ec = saldo_ec || usuario.saldo_ec;
        usuario.saldo_pm = saldo_pm || usuario.saldo_pm;
        usuario.quantidade_missoes_mestradas = quantidade_missoes_mestradas || usuario.quantidade_missoes_mestradas;
        usuario.data_ingresso_mestre = data_ingresso_mestre || usuario.data_ingresso_mestre;

        await usuario.save();

        res.json({ usuario: usuario, message: 'Usuário atualizado com sucesso' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.delete_usuario = async (req, res) => {
    const { email_usuario } = req.params; //Pega o email do usuario que quer alterar

    try {
        const usuario = await Usuario.findByPk(email_usuario);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (email_usuario != req.usuario.email_usuario) { //Se o usuario estiver tentando se atualizar, ele irá conseguir
            if (req.usuario.role != 'admin') { //Se não for adm não pode atualizar os outros
                return res.status(401).json({ error: 'Não autorizado' });
            }
        }

        await usuario.removeMissao()
        await usuario.destroy();

        res.json({ usuario: usuario, message: 'Usuário apagado com sucesso' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};