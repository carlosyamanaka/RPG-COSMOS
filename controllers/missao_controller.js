const Missao = require('../models/Missao');

exports.criar_missao = async (req, res) => {
    const { nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio, email_usuario } = req.body;

    if (email_usuario != req.usuario.email_usuario) {
        if (req.usuario.role != 'admin') {
            return res.status(401).json({ error: 'Falta permissão de administrador' });
        }
    }

    try {
        const missao = await Missao.create({ nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio, email_usuario });
        res.status(201).json({ message: 'Missão criada com sucesso!', missao });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}