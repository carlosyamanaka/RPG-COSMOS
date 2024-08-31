const jwt = require('jsonwebtoken')
var express = require('express')
var router = express.Router()

router.get("/", (req, res) => {
    res.json({ status: true, msg: "Hello World!" })
})

router.post("/login", (req, res) => {
    let {usuario, senha} = req.body
    if (usuario && usuario == senha) {
        // Possui acesso
        let user = {
            nome: usuario,
            grupo: 'admin'
        }

        let token = jwt.sign(user, '#a1b2c3', {
            expiresIn: '30 min'
        })
            
        res.json({status: true, token: token})
    } else {
        // Nao possui acesso
        res.status(403).json({status: false, mensagem: "Usuario e senha invalidos"})
    }
})

module.exports = router;
