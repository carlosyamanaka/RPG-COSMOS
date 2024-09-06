const express = require('express')
const router = express.Router()
const categoria_controller = require('../controllers/categoria_controller')
const authenticate = require('../middleware/authenticate')

// Para realizar quaisquer operações com missões é necessário estar logado
// Jogadores podem recuperar informações de categorias
// Apenas ADMs podem criar, atualizar e deletar categorias
router.post("/create", authenticate, categoria_controller.create_categoria);
router.get("/get/:id", authenticate, categoria_controller.get_categoria);
router.put("/update/:id", authenticate, categoria_controller.update_categoria);
router.delete("/delete/:id", authenticate, categoria_controller.delete_categoria);


module.exports = router;