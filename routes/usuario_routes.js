const express = require('express')
const router = express.Router()
const usuario_controller = require('../controllers/usuario_controller')
const authenticate = require('../middleware/authenticate')

router.post("/register", usuario_controller.register_usuario);
router.get("/login", usuario_controller.login_usuario);
router.put("/update/:email_usuario", authenticate, usuario_controller.update_usuario);
router.put("/updateRole/:email_usuario", authenticate, usuario_controller.update_role);
router.delete("/delete/:email_usuario", authenticate, usuario_controller.delete_usuario);

router.delete("/deleteByAdmin/:email_usuario", authenticate, usuario_controller.delete_usuario_by_admin);
router.post("/registerAdmin", authenticate, usuario_controller.register_admin);

router.get("/get/:email_usuario", authenticate, usuario_controller.get_usuario);
router.get("/getAll", authenticate, usuario_controller.get_all_usuarios);

module.exports = router;
