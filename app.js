//Imports
var express = require('express');
var path = require('path');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

var usuario_router = require('./routes/usuario_routes')
var missao_router = require('./routes/missao_routes')
var install_router = require('./routes/install_routes')
var categoria_router = require('./routes/categoria_routes')
var app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routers
app.use('/usuario', usuario_router)
app.use('/missao', missao_router)
app.use('/categoria', categoria_router)
app.use('/install', install_router)

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

module.exports = app;
