const Missao = require('../models/Missao');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.register_usuario = async (req, res) => {
    /*
    #swagger.tags = ['Usuários']
    #swagger.summary = 'Registra um novo usuário'
    #swagger.description = 'Endpoint para registrar um novo usuário.'
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Dados do usuário a ser registrado',
        required: true,
        schema: { $email_usuario: 'string', $senha: 'string' }
    }
    #swagger.responses[200] = {
        description: 'Usuário registrado com sucesso.',
        schema: { $ref: '#/definitions/Usuario' }
    }
    #swagger.responses[401] = {
        description: 'Já existe um usuário com esse email.',
        schema: { error: 'string' }
    }
    #swagger.responses[400] = {
        description: 'Erro ao registrar o usuário.',
        schema: { error: 'string' }
    }
    */
    const { email_usuario, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { email_usuario, senha } });
        if (usuario) {
            return res.status(401).json({ error: 'Já existe um usuário com esse email' });
        }

        const novo_usuario = await Usuario.create({ email_usuario, senha });

        res.status(200).json(novo_usuario);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.login_usuario = async (req, res) => {
    /*
    #swagger.tags = ['Usuários']
    #swagger.summary = 'Realiza login de um usuário'
    #swagger.description = 'Endpoint para realizar o login de um usuário e gerar um token de acesso.'
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Credenciais do usuário',
        required: true,
        schema: { $email_usuario: 'string', $senha: 'string' }
    }
    #swagger.responses[200] = {
        description: 'Login realizado com sucesso.',
        schema: { status: 'boolean', token: 'string' }
    }
    #swagger.responses[403] = {
        description: 'Credenciais inválidas.',
        schema: { status: 'boolean', mensagem: 'string' }
    }
    #swagger.responses[500] = {
        description: 'Erro ao realizar o login.',
        schema: { error: 'string' }
    }
    */

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
    /*
    #swagger.tags = ['Usuários']
    #swagger.summary = 'Atualiza os dados de um usuário'
    #swagger.description = 'Endpoint para atualizar os dados de um usuário existente.'
    #swagger.parameters['email_usuario'] = {
        in: 'path',
        description: 'Email do usuário a ser atualizado',
        required: true,
        type: 'string'
    }
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Novos dados do usuário',
        required: true,
        schema: {
            senha: 'string',
            saldo_em: 'number',
            saldo_ec: 'number',
            quantidade_missoes_mestradas: 'number',
            saldo_pm: 'number',
            data_ingresso_mestre: 'string'
        }
    }
    #swagger.responses[200] = {
        description: 'Usuário atualizado com sucesso.',
        schema: { $ref: '#/definitions/Usuario' }
    }
    #swagger.responses[401] = {
        description: 'Não autorizado.',
        schema: { error: 'string' }
    }
    #swagger.responses[404] = {
        description: 'Usuário não encontrado.',
        schema: { error: 'string' }
    }
    #swagger.responses[500] = {
        description: 'Erro ao atualizar o usuário.',
        schema: { error: 'string' }
    }
    */
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

exports.update_role = async (req, res) => {/*
    #swagger.tags = ['Usuários']
    #swagger.summary = 'Atualiza o papel (role) de um usuário'
    #swagger.description = 'Endpoint para atualizar o papel (role) de um usuário.'
    #swagger.parameters['email_usuario'] = {
        in: 'path',
        description: 'Email do usuário a ser atualizado',
        required: true,
        type: 'string'
    }
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Novo papel do usuário',
        required: true,
        schema: { role: 'string' }
    }
    #swagger.responses[200] = {
        description: 'Papel do usuário atualizado com sucesso.',
        schema: { $ref: '#/definitions/Usuario' }
    }
    #swagger.responses[401] = {
        description: 'Não autorizado.',
        schema: { error: 'string' }
    }
    #swagger.responses[404] = {
        description: 'Usuário não encontrado.',
        schema: { error: 'string' }
    }
    #swagger.responses[500] = {
        description: 'Erro ao atualizar o papel do usuário.',
        schema: { error: 'string' }
    }
    */
    const { email_usuario } = req.params; //Pega o email do usuario que quer alterar
    const { role } = req.body; //Nova role

    try {
        const usuario = await Usuario.findByPk(email_usuario);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (req.usuario.role != 'admin') { //Se não for adm não pode atualizar a role
            return res.status(401).json({ error: 'Não autorizado' });
        }

        //Reatribui a nova role ou apenas deixa a antiga
        usuario.role = role || usuario.role;
        await usuario.save();

        res.json({ usuario: usuario, message: 'Usuário atualizado com sucesso' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.delete_usuario = async (req, res) => {
    /*
    #swagger.tags = ['Usuários']
    #swagger.summary = 'Deleta um usuário'
    #swagger.description = 'Endpoint para deletar um usuário.'
    #swagger.parameters['email_usuario'] = {
        in: 'path',
        description: 'Email do usuário a ser deletado',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'Usuário deletado com sucesso.',
        schema: { $ref: '#/definitions/Usuario' }
    }
    #swagger.responses[401] = {
        description: 'Não autorizado.',
        schema: { error: 'string' }
    }
    #swagger.responses[404] = {
        description: 'Usuário não encontrado.',
        schema: { error: 'string' }
    }
    #swagger.responses[500] = {
        description: 'Erro ao deletar o usuário.',
        schema: { error: 'string' }
    }
    */
    const { email_usuario } = req.params; //Pega o email do usuario que quer alterar

    try {
        const usuario = await Usuario.findByPk(email_usuario);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (email_usuario != req.usuario.email_usuario) { //Se o usuario estiver tentando se deletar, ele irá conseguir
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

exports.delete_usuario_by_admin = async (req, res) => {/*
    #swagger.tags = ['Usuários']
    #swagger.summary = 'Deleta um usuário como administrador'
    #swagger.description = 'Endpoint para um administrador deletar um usuário.'
    #swagger.parameters['email_usuario'] = {
        in: 'path',
        description: 'Email do usuário a ser deletado',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'Usuário deletado com sucesso.',
        schema: { $ref: '#/definitions/Usuario' }
    }
    #swagger.responses[401] = {
        description: 'Não autorizado.',
        schema: { error: 'string' }
    }
    #swagger.responses[404] = {
        description: 'Usuário não encontrado.',
        schema: { error: 'string' }
    }
    #swagger.responses[500] = {
        description: 'Erro ao deletar o usuário.',
        schema: { error: 'string' }
    }
    */
    const { email_usuario } = req.params; //Pega o email do usuario que quer alterar

    try {
        if (req.usuario.role != 'admin') {
            return res.status(401).json({ error: 'Não autorizado' })
        }

        const usuario = await Usuario.findByPk(email_usuario);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        await usuario.removeMissao()
        await usuario.destroy();

        res.json({ usuario: usuario, message: 'Usuário apagado com sucesso' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.register_admin = async (req, res) => {/*
    #swagger.tags = ['Usuários']
    #swagger.summary = 'Registra um novo administrador'
    #swagger.description = 'Endpoint para registrar um novo administrador.'
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Dados do administrador a ser registrado',
        required: true,
        schema: { $email_usuario: 'string', $senha: 'string' }
    }
    #swagger.responses[201] = {
        description: 'Administrador registrado com sucesso.',
        schema: { $ref: '#/definitions/Usuario' }
    }
    #swagger.responses[401] = {
        description: 'Não autorizado.',
        schema: { error: 'string' }
    }
    #swagger.responses[400] = {
        description: 'Erro ao registrar o administrador.',
        schema: { error: 'string' }
    }
    */
    try {
        if (req.usuario.role !== 'admin') { //Verifica se está logado como admin
            return res.status(401).json({ error: 'Não autorizado' });
        }

        const { email_usuario, senha } = req.body;
        const usuario = await Usuario.findOne({ where: { email_usuario, senha } });
        if (usuario) {
            return res.status(401).json({ error: 'Já existe um administrador com esse email' });
        }

        const usuario_novo = await Usuario.create({ email_usuario, senha, role: 'admin' });
        res.status(201).json(usuario_novo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.get_usuario = async (req, res) => {
    /*
    #swagger.tags = ['Usuários']
    #swagger.summary = 'Obtém as informações de um usuário'
    #swagger.description = 'Endpoint para obter as informações de um usuário específico.'
    #swagger.parameters['email_usuario'] = {
        in: 'path',
        description: 'Email do usuário a ser consultado',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'Informações do usuário obtidas com sucesso.',
        schema: { $ref: '#/definitions/Usuario' }
    }
    #swagger.responses[500] = {
        description: 'Erro ao obter as informações do usuário.',
        schema: { error: 'string' }
    }
    */
    const { email_usuario } = req.params; //Pega o email do usuario que quer puxar as informações

    try {
        const usuario = await Usuario.findByPk(email_usuario);

        res.status(200).json(usuario);
    } catch (error) {
        res.status(201).json({ error: error.message });
    }
}

exports.get_all_usuarios = async (req, res) => {
    /*
    #swagger.tags = ['Usuários']
    #swagger.summary = 'Obtém todos os usuários'
    #swagger.description = 'Endpoint para obter todos os usuários cadastrados.'
    #swagger.parameters['limite'] = {
        in: 'query',
        description: 'Número de usuários a serem retornados por página',
        required: false,
        type: 'integer'
    }
    #swagger.parameters['pagina'] = {
        in: 'query',
        description: 'Número da página a ser retornada',
        required: false,
        type: 'integer'
    }
    #swagger.responses[200] = {
        description: 'Usuários obtidos com sucesso.',
        schema: { $ref: '#/definitions/Usuario' }
    }
    #swagger.responses[400] = {
        description: 'Erro nos parâmetros de consulta.',
        schema: { error: 'string' }
    }
    #swagger.responses[500] = {
        description: 'Erro ao obter os usuários.',
        schema: { error: 'string' }
    }
    */
    const { limite, pagina } = req.query;

    // Validação dos parâmetros
    const valor_limite = parseInt(limite);
    const valor_pagina = parseInt(pagina);

    if (![5, 10, 30].includes(valor_limite) || valor_pagina <= 0) {
        return res.status(400).json({
            error: 'O limite deve ser 5, 10 ou 30 e a página deve ser maior que 0.'
        });
    }

    try {
        const usuario = await Usuario.findAll({ limit: limite, offset: (pagina - 1) * limite });
        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}