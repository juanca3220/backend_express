const mysql = require('mysql');
const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
}

let conexion;

function conMysql()
{
    conexion = mysql.createConnection(dbconfig);

    conexion.connect((err) =>{
       if(err){
           console.log('[db err]', err);
           setTimeout(conMysql, 200);
       }
       else{
           console.log('DB Conectada!');
       }
    });

    conexion.on('error', err => {
        console.log('[db error]', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            conMysql();
        }
        else{
            throw err;
        }
    });
}

conMysql();

function all(tabla, inputOrder = 'id', orderby = 'ASC'){
    return new Promise( (resolve, reject) => {
       conexion.query(`SELECT * FROM ${tabla} ORDER BY ${inputOrder} ${orderby}`, (error, result) => {
           return error ? reject(error) : resolve(result);
       })
    });
}

function allPartidos(){
    return new Promise( (resolve, reject) => {
        conexion.query(`SELECT partidos.id, usuarios.nombre as usuario, eq1.nombre AS local, eq2.nombre AS visitante, partidos.fecha, partidos.goles_local, partidos.goles_visitante
FROM partidos
INNER JOIN usuarios ON usuarios.id = partidos.usuario
INNER JOIN equipos AS eq1 ON eq1.id = partidos.local
INNER JOIN equipos AS eq2 ON eq2.id = partidos.visitante
ORDER BY partidos.fecha DESC`, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    });
}

function find(tabla, id){
    return new Promise( (resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla} WHERE id=${id}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    });
}

function searchByEmail(tabla, email){
    return new Promise( (resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla} WHERE correo= ?`, email, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    });
}

function store(tabla, data){
    return new Promise( (resolve, reject) => {
        conexion.query(`INSERT INTO ${tabla} SET ?`, data, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    });
}

function update(tabla, data){
    return new Promise( (resolve, reject) => {
        conexion.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [data, data.id], (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    });
}

function deleted(tabla, data){
    return new Promise( (resolve, reject) => {
        conexion.query(`DELETE FROM ${tabla} WHERE id = ?`, data.id, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    });
}

function searchByUsername(tabla, consulta){

    return new Promise( (resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla} WHERE ?`, consulta, (error, result) => {

            if(error){
                return reject(error);
            }
            else{
                if(!result.length){
                    return resolve(null);
                }
                else{
                    return resolve(result[0]);
                }
            }
        })
    });
}



module.exports = {
    all,
    find,
    store,
    update,
    deleted,
    searchByEmail,
    searchByUsername,
    allPartidos
}