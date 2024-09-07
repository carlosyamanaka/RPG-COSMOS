const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/authenticate')
const missao_controller = require('../controllers/missao_controller')

// Para realizar quaisquer operações com missões é necessário estar logado
// Jogadores podem recuperar as informações das missões e nada além disso
// Mestres podem criar missões e manipular informações apenas das proprias missões
// Administradores podem manipular tudo
router.post("/create", authenticate, missao_controller.criar_missao);
router.get("/get/:id", authenticate, missao_controller.get_missao);
router.get("/getAll", authenticate, missao_controller.get_all_missoes);
router.put("/update/:id", authenticate, missao_controller.update_missao);
router.delete("/delete/:id", authenticate, missao_controller.delete_missao);

router.get("/getQuantidade", authenticate, missao_controller.get_quantidade_missoes);
router.get("/getQuantidadeByCategoria/:id", authenticate, missao_controller.get_quantidade_missoes_by_categoria);

router.get("/getAllByUsuarioLogado", authenticate, missao_controller.get_all_missoes_by_usuario_logado);

module.exports = router