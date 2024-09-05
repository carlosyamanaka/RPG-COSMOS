const Missao = require('../models/Missao');
const Usuario = require('../models/Usuario');

exports.criar_missao = async (req, res) => {
    try {
        if (req.usuario.role == 'admin') {
            //Se um adm criar, ele define o mestre da missão
            const { nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio, email_usuario } = req.body;

            const missao = await Missao.create({ nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio, email_usuario });
            res.status(201).json({ message: 'Missão criada com sucesso!', missao });
        } else if (req.usuario.role == 'mestre') {
            //Se um mestre criar, ele é atribuido para ser o mestre da missão
            const { nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio } = req.body;
            const { email_usuario } = req.usuario.email_usuario;

            const missao = await Missao.create({ nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio, email_usuario });
            res.status(201).json({ message: 'Missão criada com sucesso!', missao });
        } else {
            //Apenas admins e mestres podem criar missões
            return res.status(401).json({ error: 'Apenas administradores e mestres podem criar missões' });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.get_missao = async (req, res) => {
    //Usuarios podem puxar as missões também
    const { id } = req.params;

    try {
        const missao = await Missao.findByPk(id);

        if (!missao) {
            return res.status(404).json({ error: 'Missão não encontrada.' });
        }

        res.status(200).json({ missao });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.update_missao = async (req, res) => {
    const { id } = req.params;
    try {
        if (req.usuario.role == 'admin') {
            //Apenas admins podem trocar o mestre da missão
            const { nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio, email_usuario } = req.body;

            const mestre_missao = await Usuario.findByPk(email_usuario) //Mestre da missão que irá sofrer o update

            const missao = await Missao.findByPk(id);

            if (!missao) {
                return res.status(404).json({ error: 'Missao não encontrada.' });
            }

            await missao.update({ nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio });

            res.status(200).json({ message: 'Produto atualizado com sucesso!', missao });
        } else if (req.usuario.email == mestre_missao) {
            //Não dá pra mestres trocarem o mestre da missão
            const { nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio } = req.body;
            const { email_usuario } = req.usuario.email_usuario;

            const missao = await Missao.findByPk(id);

            if (!missao) {
                return res.status(404).json({ error: 'Missao não encontrada.' });
            }

            await missao.update({ nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio, email_usuario });

            res.status(200).json({ message: 'Produto atualizado com sucesso!', missao });
        } else {
            return res.status(401).json({ error: 'Apenas administradores e o mestre da missão pode editá-la.' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
