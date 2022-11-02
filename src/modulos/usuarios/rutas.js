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

router.get('/', all);
router.get('/:id', find);
router.post('/', store);
router.put('/', ensureLoggedIn, update);
router.delete('/', ensureLoggedIn, deleted);

async function all(req, res){
    try{
        const items = await controller.all('id', 'ASC');
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

async function searchByEmail (req, res){
    try{
        const item = await controller.searchByEmail(req.body.correo);
        respuesta.success(req, res, item, 200);
    }
    catch (err){
        respuesta.error(req, res, err, 500);
    }
};

async function store (req, res){
    try{

        const id = await controller.findIdByUsername(req.body.username);

        if(id != ''){
            respuesta.success(req, res, 'Ya existe alguien con el mismo username', 200);
        }
        else{
            const dataUsuario = {
                "nombre": req.body.nombre,
                "correo": req.body.correo,
                "username": req.body.username,
            };

            dataUsuario.password = await bcrypt.hash(req.body.password.toString(), 5);

            const item = await controller.store(dataUsuario);
            let affectedRows = item.affectedRows;
            if (affectedRows > 0){
                respuesta.success(req, res, 'Se registro correctamente!', 201);
            }
            else {
                respuesta.success(req, res, 'No se registro', 200);
            }
        }

    }
    catch (err){
        respuesta.error(req, res, err, 500);
    }
};

async function update (req, res){
    try{
        const dataUsuario = {
            "id": req.body.id,
            "nombre": req.body.nombre,
            "correo": req.body.correo,
            "username": req.body.username,
        };

        dataUsuario.password = await bcrypt.hash(req.body.password.toString(), 5);

        const item = await controller.update(dataUsuario);
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

async function deleted (req, res){
    try{
        const item = await controller.deleted(req.body);
        let affectedRows = item.affectedRows;
        if (affectedRows > 0){
            respuesta.success(req, res, 'Eliminado correctamente!', 200);
        }
        else {
            respuesta.error(req, res, 'No se elimino, no existe ID', 500);
        }
    }
    catch (err){
        respuesta.error(req, res, err, 500);
    }
};

module.exports = router;