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

async function all(req, res){
    try{
        const items = await controller.all('nombre', 'ASC');
        respuesta.success(req, res, items, 200);
    }
    catch (err){
        respuesta.error(req, res, err, 500);
    }
};

module.exports = router;