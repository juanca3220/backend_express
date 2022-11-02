const db = require('../../DB/mysql');
const bcrypt = require('bcrypt');
const auth = require('../../auth');

const TABLA = 'usuarios';

async function login(username, password){
    const data = await db.searchByUsername(TABLA, {username: username});

    if(data == null){
        return '';
    }
    else{
        return bcrypt.compare(password, data.password)
            .then(resultado => {console.log(resultado);
                if(resultado === true){

                    return auth.asignarToken({ ...data});
                }
                else{
                    return '';
                }
            })
    }

}

async function findIdByUsername(username){
    const data = await db.searchByUsername(TABLA, {username: username})

    if(data == null){
        return '';
    }
    else{
        return  data.id;
    }

}

module.exports = {
    login,
    findIdByUsername
}