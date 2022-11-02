const express = require('express');
const bcrypt = require('bcrypt');

const respuesta = require('../../red/respuestas');
const controller = require('./controller');

const router = express.Router();

router.post('/login', login);

async function login(req, res){
    try{
        const token = await controller.login(req.body.username, req.body.password);
        const id = await controller.findIdByUsername(req.body.username);
        const info = {
          "token": token,
          "id": token ? id : '',
          "msg": ''
        };

        if(token == ''){
            info.msg = 'Credenciales invalidas';
        }

        respuesta.success(req, res, info, 200);
    }
    catch (err){
        respuesta.error(req, res, err, 500);
    }
};

module.exports = router;