const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/authenticate')
const missao_controller = require('../controllers/missao_controller')
const MissoesModel = require('../models/Missao')

// router.get("/", (req, res) => {
//     res.json({ status: true, tasks: MissoesModel.list() })
// })

// router.get("/:id", getMissao, (req, res) => {
//     res.json({ status: true, task: req.task })
// })

router.post("/create", authenticate, missao_controller.criar_missao);

// router.put("/:id", authenticate, validaNome, getMissao, (req, res) => {
//     res.json({ status: true, task: MissoesModel.update(req.task.id, req.nome) })
// })

// router.delete("/:id", authenticate, getMissao, (req, res) => {
//     res.json({ status: true, oldtask: MissoesModel.delete(req.task.id) })
// })

module.exports = router