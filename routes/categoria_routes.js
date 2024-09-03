const express = require('express')
const router = express.Router()
const categoria_controller = require('../controllers/categoria_controller')
const authenticate = require('../middleware/authenticate')

router.post("/create", authenticate, categoria_controller.create_categoria);
router.get("/get/:id", authenticate, categoria_controller.get_categoria);
// router.put("/update", authenticate, categoria_controller.update_categoria);
// router.delete("/delete", authenticate, categoria_controller.delete_categoria);


module.exports = router;