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