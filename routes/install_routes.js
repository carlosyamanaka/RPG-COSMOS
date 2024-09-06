const express = require('express');
const install_controller = require('../controllers/install_controller');
const router = express.Router();

// Rota para popular o banco, rota para teste e voltada para os desenvolvedores
// Não é necessário logar nem quaisquer permissões para acessar a rota
router.get('/', install_controller.install);

module.exports = router;