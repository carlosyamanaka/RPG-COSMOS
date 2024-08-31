const jwt = require('jsonwebtoken')
var express = require('express')
var router = express.Router()

var MissoesModel = require('../models/Missao')

let validaNome = (req, res, next) => {
    let { nome } = req.body
    if (nome == undefined || nome == "") {
        return res.status(400).json({ status: false, error: "Nome nao informado" })
    }
    if (nome.length < 5) {
        return res.status(400).json({ status: false, error: "O nome da tarefa precisa ter mais do que 5 caracteres" })
    }
    req.nome = nome.toUpperCase()
    next()
}
let autorization = (req, res, next) => {
    let bearer = req.headers['authorization'] || ""
    bearer = bearer.split(": ")
    if (bearer.length != 2 || bearer[0] != 'Bearer') {
        return res.status(403).json({ status: false, mensagem: "Token invalido" })
    }
    let token = bearer[1]
    jwt.verify(token, '#a1b2c3', (err, obj) => {
        if (err) {
            return res.status(403).json({ status: false, mensagem: "Nao autorizado" })
        }

        req.user = obj
        next()
    })
}

let getMissao = (req, res, next) => {
    let { id } = req.params
    let missao = MissoesModel.getElementById(id)
    if (missao == null) {
        return res.status(404).json({ status: false, error: "Id invalido" })
    }
    req.missao = missao
    next()
}

router.get("/", (req, res) => {
    res.json({ status: true, tasks: MissoesModel.list() })
})

router.get("/:id", getMissao, (req, res) => {
    res.json({ status: true, task: req.task })
})

router.post("/", autorization, validaNome, (req, res) => {
    res.json({ status: true, task: MissoesModel.new(req.nome), owner: req.user.nome })
})

router.put("/:id", autorization, validaNome, getMissao, (req, res) => {
    res.json({ status: true, task: MissoesModel.update(req.task.id, req.nome) })
})

router.delete("/:id", autorization, getMissao, (req, res) => {
    res.json({ status: true, oldtask: MissoesModel.delete(req.task.id) })
})



module.exports = router