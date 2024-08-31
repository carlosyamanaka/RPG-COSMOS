const Categoria = require('../models/Categoria');
const Missao = require('../models/Missao');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.register_usuario = async (req, res) => {
    try {
        const { email_usuario, senha } = req.body;
        const novo_usuario = await Usuario.create({ email_usuario, senha });

        res.status(201).json(novo_usuario);

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
}