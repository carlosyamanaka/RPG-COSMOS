const Missao = require('../models/Missao');
const { MissaoUsuario } = require('./install_controller');

exports.criar_missao = async (req, res) => {
    /*
    #swagger.tags = ['Missões']
    #swagger.summary = 'Cria uma nova missão'
    #swagger.description = 'Endpoint para criar uma nova missão.'
    #swagger.parameters['body'] = { 
        in: 'body',
        description: 'Dados da missão a ser criada',
        required: true,
        schema: { 
            nome: 'string', 
            data: 'string', 
            dificuldade: 'string', 
            id_categoria: 'integer', 
            recompensa_em: 'integer', 
            recompensa_ec: 'integer', 
            relatorio: 'string', 
            email_mestre: 'string',
            email_participantes: ['string'] 
        }
    }
    #swagger.responses[201] = {
        description: 'Missão criada com sucesso.',
        schema: { message: 'Missão criada com sucesso!', missao: { id: 1, nome: 'Missão Exemplo' } }
    }
    #swagger.responses[401] = {
        description: 'Apenas administradores e mestres podem criar missões.',
        schema: { error: 'Apenas administradores e mestres podem criar missões' }
    }
    #swagger.responses[500] = {
        description: 'Erro ao criar a missão.',
        schema: { error: 'Mensagem de erro' }
    }
    */
    try {
        if (req.usuario.role == 'admin') {
            const { nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio, email_mestre, email_participantes } = req.body;

            const missao = await Missao.create({ nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio, email_mestre });

            missao.addUsuario(email_mestre, { through: { eh_mestre: true } });

            await Promise.all(email_participantes.map(async (participante) => {
                await missao.addUsuario(participante, { through: { eh_mestre: false } });
            }));

            res.status(201).json({ message: 'Missão criada com sucesso!', missao });
        } else if (req.usuario.role == 'mestre') {
            const { nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio, email_participantes } = req.body;

            const email_mestre = req.usuario.email_usuario;

            const missao = await Missao.create({ nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio, email_mestre });

            missao.addUsuario(email_mestre, { through: { eh_mestre: true } });

            await Promise.all(email_participantes.map(async (participante) => {
                await missao.addUsuario(participante, { through: { eh_mestre: false } });
            }));

            res.status(201).json({ message: 'Missão criada com sucesso!', missao });
        } else {
            return res.status(401).json({ error: 'Apenas administradores e mestres podem criar missões' });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.get_missao = async (req, res) => {
    /*
    #swagger.tags = ['Missões']
    #swagger.summary = 'Obtém uma missão específica'
    #swagger.description = 'Endpoint para obter uma missão pelo ID.'
    #swagger.parameters['id'] = { 
        in: 'path',
        description: 'ID da missão a ser obtida',
        required: true,
        type: 'integer'
    }
    #swagger.responses[200] = {
        description: 'Missão obtida com sucesso.',
        schema: { id: 1, nome: 'Missão Exemplo' }
    }
    #swagger.responses[404] = {
        description: 'Missão não encontrada.',
        schema: { error: 'Missão não encontrada.' }
    }
    #swagger.responses[500] = {
        description: 'Erro ao obter a missão.',
        schema: { error: 'Mensagem de erro' }
    }
    */
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
    
    /*
    #swagger.tags = ['Missões']
    #swagger.summary = 'Obtém todas as missões'
    #swagger.description = 'Endpoint para obter todas as missões com paginação.'
    #swagger.parameters['limite'] = { 
        in: 'query',
        description: 'Número de missões por página (deve ser 5, 10 ou 30)',
        required: true,
        type: 'integer'
    }
    #swagger.parameters['pagina'] = { 
        in: 'query',
        description: 'Número da página (deve ser maior que 0)',
        required: true,
        type: 'integer'
    }
    #swagger.responses[200] = {
        description: 'Missões obtidas com sucesso.',
        schema: [{ id: 1, nome: 'Missão Exemplo' }]
    }
    #swagger.responses[500] = {
        description: 'Erro ao obter missões.',
        schema: { error: 'Mensagem de erro' }
    }
    */
    const { limite, pagina } = req.query;

    const valor_limite = parseInt(limite);
    const valor_pagina = parseInt(pagina);

    if (![5, 10, 30].includes(valor_limite) || valor_pagina <= 0) {
        return res.status(500).json({
            error: 'O limite deve ser 5, 10 ou 30 e a página deve ser maior que 0.'
        });
    }

    try {
        const missoes = await Missao.findAll({ limit: limite, offset: (pagina - 1) * limite });
        res.status(200).json(missoes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.update_missao = async (req, res) => {
    /*
    #swagger.tags = ['Missões']
    #swagger.summary = 'Atualiza uma missão específica'
    #swagger.description = 'Endpoint para atualizar uma missão pelo ID.'
    #swagger.parameters['id'] = { 
        in: 'path',
        description: 'ID da missão a ser atualizada',
        required: true,
        type: 'integer'
    }
    #swagger.parameters['body'] = { 
        in: 'body',
        description: 'Dados da missão a ser atualizada',
        required: true,
        schema: { 
            nome: 'string', 
            data: 'string', 
            dificuldade: 'string', 
            id_categoria: 'integer', 
            recompensa_em: 'integer', 
            recompensa_ec: 'integer', 
            relatorio: 'string', 
            email_usuario: 'string' 
        }
    }
    #swagger.responses[200] = {
        description: 'Missão atualizada com sucesso.',
        schema: { message: 'Missão atualizada com sucesso!', missao: { id: 1, nome: 'Missão Atualizada' } }
    }
    #swagger.responses[401] = {
        description: 'Apenas administradores e o mestre da missão podem editá-la.',
        schema: { error: 'Apenas administradores e o mestre da missão podem editá-la.' }
    }
    #swagger.responses[404] = {
        description: 'Missão não encontrada.',
        schema: { error: 'Missao não encontrada.' }
    }
    #swagger.responses[500] = {
        description: 'Erro ao atualizar a missão.',
        schema: { error: 'Mensagem de erro' }
    }
    */
    const { id } = req.params;
    try {
        const { nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio, email_usuario } = req.body;

        if (req.usuario.role == 'admin' || req.usuario.email_usuario == email_usuario) {
            const missao = await Missao.findByPk(id);

            if (!missao) {
                return res.status(404).json({ error: 'Missao não encontrada.' });
            }

            await missao.update({ nome, data, dificuldade, id_categoria, recompensa_em, recompensa_ec, relatorio });

            res.status(200).json({ message: 'Missão atualizada com sucesso!', missao });
        } else {
            return res.status(401).json({ error: 'Apenas administradores e o mestre da missão podem editá-la.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.delete_missao = async (req, res) => {
    /*
    #swagger.tags = ['Missões']
    #swagger.summary = 'Apaga uma missão específica'
    #swagger.description = 'Endpoint para apagar uma missão pelo ID.'
    #swagger.parameters['id'] = { 
        in: 'path',
        description: 'ID da missão a ser apagada',
        required: true,
        type: 'integer'
    }
    #swagger.responses[200] = {
        description: 'Missão apagada com sucesso.',
        schema: { message: 'Missão apagada com sucesso', missao: { id: 1, nome: 'Missão Exemplo' } }
    }
    #swagger.responses[401] = {
        description: 'Apenas administradores e o mestre da missão podem apagá-la.',
        schema: { error: 'Não autorizado' }
    }
    #swagger.responses[404] = {
        description: 'Missão não encontrada.',
        schema: { error: 'Missão não encontrada' }
    }
    #swagger.responses[500] = {
        description: 'Erro ao apagar a missão.',
        schema: { error: 'Mensagem de erro' }
    }
    */
    const { id } = req.params;

    try {
        const missao = await Missao.findByPk(id);

        if (!missao) {
            return res.status(404).json({ error: 'Missão não encontrada' });
        }

        if (req.usuario.role == 'admin') {
            await missao.removeUsuario(req.usuario.email_usuario);

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
                await missao.removeUsuario(req.usuario.email_usuario);

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

exports.get_total_missoes = async (req, res) => {
    /*
    #swagger.tags = ['Missões']
    #swagger.summary = 'Obtém o total de missões'
    #swagger.description = 'Endpoint para obter o número total de missões.'
    #swagger.responses[200] = {
        description: 'Total de missões obtido com sucesso.',
        schema: { total: 10 }
    }
    #swagger.responses[500] = {
        description: 'Erro ao obter o total de missões.',
        schema: { error: 'Mensagem de erro' }
    }
    */
    var total = 0;

    try {
        const missoes = await Missao.findAll();
        missoes.map((x) => {
            total += 1;
        });

        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.get_total_missoes_by_categoria = async (req, res) => {
    /*
    #swagger.tags = ['Missões']
    #swagger.summary = 'Obtém o total de missões por categoria'
    #swagger.description = 'Endpoint para obter o número total de missões por categoria.'
    #swagger.parameters['id'] = { 
        in: 'path',
        description: 'ID da categoria das missões a serem contadas',
        required: true,
        type: 'integer'
    }
    #swagger.responses[200] = {
        description: 'Total de missões por categoria obtido com sucesso.',
        schema: { total: 5 }
    }
    #swagger.responses[500] = {
        description: 'Erro ao obter o total de missões por categoria.',
        schema: { error: 'Mensagem de erro' }
    }
    */
    const { id } = req.params;

    var total = 0;

    try {
        const missoes = await Missao.findAll({ where: { id_categoria: id } });
        missoes.map((x) => {
            total += 1;
        });

        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
