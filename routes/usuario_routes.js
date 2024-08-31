const express = require('express')
const router = express.Router()
const usuario_controller = require('../controllers/usuario_controller')
const jwt = require('jsonwebtoken')

router.post("/register", usuario_controller.register_usuario);

router.get("/login", usuario_controller.login_usuario);

module.exports = router;
