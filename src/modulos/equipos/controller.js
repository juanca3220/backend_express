const db = require('../../DB/mysql');

const TABLA = 'equipos';

function all(inputOrder = 'id', orderby = 'ASC'){
    return db.all(TABLA, inputOrder, orderby);
}

function find(id){
    return db.find(TABLA, id);
}

function store(body){
    return db.store(TABLA, body);
}

function update(body){
    return db.update(TABLA, body);
}

module.exports = {
    all,
    find,
    store,
    update,
}