const express = require('express');
const install_controller = require('../controllers/install_controller');
const router = express.Router();

router.get('/', install_controller.install);

module.exports = router;