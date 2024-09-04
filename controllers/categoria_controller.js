const Categoria = require('../models/Categoria')

exports.create_categoria = async (req, res) => {
    const { nome } = req.body;

    if (req.usuario.role != 'admin') {
        return res.status(401).json({ error: 'Apenas administradores podem criar categorias. ' })
    }

    try {
        const categoria = await Categoria.create({ nome });

        res.status(201).json({ message: 'Categoria criada!', categoria });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.get_categoria = async (req, res) => {
    //Usuários podem puxar as categorias
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
}

exports.update_categoria = async (req, res) => {
    const { id } = req.params;

    if (req.usuario.role != 'admin') {
        return res.status(401).json({ error: 'Apenas administradores podem editar categorias.' })
    }

    const { nome } = req.body;

    try {
        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({ error: 'Categoria não encontrada.' });
        }

        await categoria.update({ nome });
        res.status(200).json({ message: 'Produto atualizado com sucesso!', categoria });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.delete_categoria = async (req, res) => {
    const { id } = req.params;

    if (req.usuario.role != 'admin') {
        return res.status(401).json({ error: 'Apenas administradores podem apagar categorias.' })
    }

    try {
        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({ error: 'Categoria não encontrada.' });
        }

        await categoria.destroy();
        res.status(200).json({ message: 'Produto apagado com sucesso!', categoria });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
