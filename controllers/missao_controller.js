const Missao = require('../models/Missao');
const Usuario = require('../models/Usuario');
const { MissaoUsuario } = require('./install_controller');

exports.criar_missao = async (req, res) => {
    try {
        if (req.usuario.role == 'admin') {
            //Se um adm criar, ele define o mestre da missão
            const { nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio, email_mestre, email_participantes } = req.body;

            //Cria a missão no banco de dados
            const missao = await Missao.create({ nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio, email_mestre });

            //Adiciona o mestre na tabela MissaoUsuarios
            missao.addUsuario(email_mestre, { through: { eh_mestre: true } })

            //Adiciona os participantes na tabela MissaoUsuarios
            await email_participantes.map((participante) => {
                missao.addUsuario(participante, { through: { eh_mestre: false } })
            });

            res.status(201).json({ message: 'Missão criada com sucesso!', missao });
        } else if (req.usuario.role == 'mestre') {
            //Se um mestre criar, ele é atribuido para ser o mestre da missão
            const { nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio, email_participantes } = req.body;

            const email_mestre = req.usuario.email_usuario;

            //Cria a missão no banco
            const missao = await Missao.create({ nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio, email_mestre });

            //Adiciona o mestre na tabela MissaoUsuarios
            missao.addUsuario(email_mestre, { through: { eh_mestre: true } })

            //Adiciona os participantes na tabela MissaoUsuarios
            await Promise.all(email_participantes.map(async (participante) => {
                await missao.addUsuario(participante, { through: { eh_mestre: false } });
            }));

            res.status(201).json({ message: 'Missão criada com sucesso!', missao });
        } else {
            //Apenas admins e mestres podem criar missões
            return res.status(401).json({ error: 'Apenas administradores e mestres podem criar missões' });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
    }
};


exports.get_all_missoes = async (req, res) => {
    //Usuários podem puxar missões
    const { limite, pagina } = req.query;

    // Validação dos parâmetros
    const valor_limite = parseInt(limite);
    const valor_pagina = parseInt(pagina);

    if (![5, 10, 30].includes(valor_limite) || valor_pagina <= 0) {
        return res.status(500).json({
            error: 'O limite deve ser 5, 10 ou 30 e a página deve ser maior que 0.'
        });
    }

    try {
        const missao = await Missao.findAll({ limit: limite, offset: (pagina - 1) * limite });
        res.status(201).json(missao);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.update_missao = async (req, res) => {
    const { id } = req.params;
    try {
        const { nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio, email_usuario } = req.body;

        //Apenas admins podem trocar o mestre da missão
        //Mestres podem alterar os dados apenas da própria missão
        if (req.usuario.role == 'admin' || req.usuario.email_usuario == email_usuario) {

            const missao = await Missao.findByPk(id);

            if (!missao) {
                return res.status(404).json({ error: 'Missao não encontrada.' });
            }

            await missao.update({ nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio });

            res.status(200).json({ message: 'Missão atualizada com sucesso!', missao });
        } else {
            return res.status(401).json({ error: 'Apenas administradores e o mestre da missão pode editá-la.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.delete_missao = async (req, res) => {
    const { id } = req.params;

    try {
        // Encontrar a missão pelo ID
        const missao = await Missao.findByPk(id);

        if (!missao) {
            return res.status(404).json({ error: 'Missão não encontrada' });
        }

        if (req.usuario.role == 'admin') {
            // Remova o relacionamento entre a missão e o usuário
            await missao.removeUsuario(req.usuario.email_usuario);

            // Destruir a missão
            await missao.destroy();

            res.json({ message: 'Missão apagada com sucesso' });
        } else if (req.usuario.role == 'mestre') {
            const missaoUsuario = await MissaoUsuario.findOne({
                where: { id_missao: id, email_usuario: req.usuario.email_usuario }
            });
            if (!missaoUsuario) {
                return res.status(404).json({ error: 'Não foi encontrada nenhuma missão correspondente (Com id passado e que pertence a você)' });
            }

            if (missaoUsuario.email_usuario == req.usuario.email_usuario) {

                // Remova o relacionamento entre a missão e o usuário
                await missao.removeUsuario(req.usuario.email_usuario);

                // Destruir a missão
                await missao.destroy();

                res.json({ message: 'Missão apagada com sucesso' });

            }
        } else {
            return res.status(401).json({ error: 'Não autorizado' });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
