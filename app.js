//Imports
var express = require('express');
var path = require('path');

var usuario_router = require('./routes/usuario_routes')
var missao_router = require('./routes/missao_routes')
var install_router = require('./routes/install_routes')
var app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routers
app.use('/usuario', usuario_router)
app.use('/missao', missao_router)
app.use('/install', install_router)

module.exports = app;
