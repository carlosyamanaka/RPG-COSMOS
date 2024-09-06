const Categoria = require('../models/Categoria');

exports.create_categoria = async (req, res) => {
    /*
    #swagger.tags = ['Categorias']
    #swagger.summary = 'Cria uma categoria específica'
    #swagger.description = 'Endpoint para criar uma categoria.'
    #swagger.parameters['body'] = { 
        in: 'body',
        description: 'Dados da categoria a ser criada',
        required: true,
        schema: { nome: 'string' }
    }
    #swagger.responses[201] = {
        description: 'Categoria criada com sucesso.',
        schema: { message: 'Categoria criada!', categoria: { id: 1, nome: 'Exemplo' } }
    }
    #swagger.responses[401] = {
        description: 'Sem permissão de administrador.',
        schema: { error: 'Apenas administradores podem criar categorias.' }
    }
    #swagger.responses[400] = {
        description: 'Erro ao criar categoria.',
        schema: { error: 'Mensagem de erro' }
    }
    */
    const { nome } = req.body;

    if (req.usuario.role != 'admin') {
        return res.status(401).json({ error: 'Apenas administradores podem criar categorias.' });
    }

    try {
        const categoria = await Categoria.create({ nome });
        res.status(201).json({ message: 'Categoria criada!', categoria });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.get_categoria = async (req, res) => {
    /*
    #swagger.tags = ['Categorias']
    #swagger.summary = 'Obtém uma categoria específica'
    #swagger.description = 'Endpoint para obter uma categoria pelo ID.'
    #swagger.parameters['id'] = { 
        in: 'path',
        description: 'ID da categoria a ser obtida',
        required: true,
        type: 'integer'
    }
    #swagger.responses[200] = {
        description: 'Categoria obtida com sucesso.',
        schema: { id: 1, nome: 'Exemplo' }
    }
    #swagger.responses[404] = {
        description: 'Categoria não encontrada.',
        schema: { error: 'Categoria não encontrada.' }
    }
    #swagger.responses[400] = {
        description: 'Erro ao obter categoria.',
        schema: { error: 'Mensagem de erro' }
    }
    */
    const { id } = req.params;

    try {
        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({ error: 'Categoria não encontrada.' });
        }

        res.status(200).json({ categoria });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.update_categoria = async (req, res) => {
    /*
    #swagger.tags = ['Categorias']
    #swagger.summary = 'Atualiza uma categoria específica'
    #swagger.description = 'Endpoint para atualizar uma categoria pelo ID.'
    #swagger.parameters['id'] = { 
        in: 'path',
        description: 'ID da categoria a ser atualizada',
        required: true,
        type: 'integer'
    }
    #swagger.parameters['body'] = { 
        in: 'body',
        description: 'Dados da categoria a ser atualizada',
        required: true,
        schema: { nome: 'string' }
    }
    #swagger.responses[200] = {
        description: 'Categoria atualizada com sucesso.',
        schema: { message: 'Categoria atualizada!', categoria: { id: 1, nome: 'Exemplo Atualizado' } }
    }
    #swagger.responses[401] = {
        description: 'Sem permissão de administrador.',
        schema: { error: 'Apenas administradores podem editar categorias.' }
    }
    #swagger.responses[404] = {
        description: 'Categoria não encontrada.',
        schema: { error: 'Categoria não encontrada.' }
    }
    #swagger.responses[400] = {
        description: 'Erro ao atualizar categoria.',
        schema: { error: 'Mensagem de erro' }
    }
    */
    const { id } = req.params;

    if (req.usuario.role != 'admin') {
        return res.status(401).json({ error: 'Apenas administradores podem editar categorias.' });
    }

    const { nome } = req.body;

    try {
        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({ error: 'Categoria não encontrada.' });
        }

        await categoria.update({ nome });
        res.status(200).json({ message: 'Categoria atualizada com sucesso!', categoria });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.delete_categoria = async (req, res) => {
    /*
    #swagger.tags = ['Categorias']
    #swagger.summary = 'Apaga uma categoria específica'
    #swagger.description = 'Endpoint para apagar uma categoria pelo ID.'
    #swagger.parameters['id'] = { 
        in: 'path',
        description: 'ID da categoria a ser apagada',
        required: true,
        type: 'integer'
    }
    #swagger.responses[200] = {
        description: 'Categoria apagada com sucesso.',
        schema: { message: 'Categoria apagada!', categoria: { id: 1, nome: 'Exemplo' } }
    }
    #swagger.responses[401] = {
        description: 'Sem permissão de administrador.',
        schema: { error: 'Apenas administradores podem apagar categorias.' }
    }
    #swagger.responses[404] = {
        description: 'Categoria não encontrada.',
        schema: { error: 'Categoria não encontrada.' }
    }
    #swagger.responses[400] = {
        description: 'Erro ao apagar categoria.',
        schema: { error: 'Mensagem de erro' }
    }
    */
    const { id } = req.params;

    if (req.usuario.role != 'admin') {
        return res.status(401).json({ error: 'Apenas administradores podem apagar categorias.' });
    }

    try {
        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({ error: 'Categoria não encontrada.' });
        }

        await categoria.destroy();
        res.status(200).json({ message: 'Categoria apagada com sucesso!', categoria });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
