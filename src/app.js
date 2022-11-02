const express = require('express');
const morgan = require('morgan');
const config = require('./config');

const usuarios = require('./modulos/usuarios/rutas');
const auth = require('./modulos/auth/rutas');
const partidos = require('./modulos/partidos/rutas');
const equipos = require('./modulos/equipos/rutas');

const app = express();

const cors = require('cors');
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

//middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//configuracion
app.set('port', config.app.port)

//rutas
app.use('/api/usuarios', usuarios);
app.use('/api/auth', auth);
app.use('/api/partidos', partidos);
app.use('/api/equipos', equipos);

module.exports = app;