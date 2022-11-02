const bcrypt = require('bcrypt');
const express = require('express');

const respuesta = require('../../red/respuestas');
const controller = require('./controller');
const jwt = require('jsonwebtoken');
config = require('../../config');
const secret = config.jwt.secret;

function ensureLoggedIn(req, res, next) {
    try {
        const authHeaderValue = req.headers.authorization;
        let obtenerToken = authHeaderValue.replace('Bearer ', '');
        const token = jwt.verify(obtenerToken, secret);
        return next();
    } catch (e) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

const router = express.Router();

router.get('/', ensureLoggedIn, all);
router.get('/:id', ensureLoggedIn, find);
router.post('/', ensureLoggedIn, store);
router.put('/', ensureLoggedIn, update);

async function all(req, res){
    try{
        const items = await controller.all();
        respuesta.success(req, res, items, 200);
    }
    catch (err){
        respuesta.error(req, res, err, 500);
    }
};

async function find (req, res){
    try{
        const item = await controller.find(req.params.id);
        respuesta.success(req, res, item, 200);
    }
    catch (err){
        respuesta.error(req, res, err, 500);
    }
};

async function store (req, res){
    try{

        const dataPartido = {
            "usuario": req.body.usuario,
            "local": req.body.local,
            "visitante": req.body.visitante,
            "fecha": req.body.fecha,
        };

        const item = await controller.store(dataPartido);
        let affectedRows = item.affectedRows;
        if (affectedRows > 0){
            respuesta.success(req, res, 'Se registro correctamente!', 201);
        }
        else {
            respuesta.error(req, res, 'No se registro', 500);
        }
    }
    catch (err){
        respuesta.error(req, res, err, 500);
    }
};

async function update (req, res){
    try{
        const dataPartido = {
            "id": req.body.id,
            "goles_local": req.body.goles_local,
            "goles_visitante": req.body.goles_visitante,
        };

        const item = await controller.update(dataPartido);
        let affectedRows = item.affectedRows;
        if (affectedRows > 0){
            respuesta.success(req, res, 'Se actualizo correctamente!', 200);
        }
        else {
            respuesta.error(req, res, 'No se actualizo', 500);
        }
    }
    catch (err){
        respuesta.error(req, res, err, 500);
    }
};

module.exports = router;