const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/authenticate')
const missao_controller = require('../controllers/missao_controller')

router.post("/create", authenticate, missao_controller.criar_missao);
router.get("/get/:id", authenticate, missao_controller.get_missao);
router.get("/getAll", authenticate, missao_controller.get_all_missoes);
router.put("/update/:id", authenticate, missao_controller.update_missao);
router.delete("/delete/:id", authenticate, missao_controller.delete_missao);

module.exports = router