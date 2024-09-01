const express = require('express')
const router = express.Router()
const usuario_controller = require('../controllers/usuario_controller')
const authenticate = require('../middleware/authenticate')

router.post("/register", usuario_controller.register_usuario);
router.get("/login", usuario_controller.login_usuario);

router.put("/update/:email_usuario", authenticate, usuario_controller.update_usuario);

module.exports = router;
