const db = require('../../DB/mysql');

const TABLA = 'usuarios';

function all(inputOrder = 'id', orderby = 'ASC'){
    return db.all(TABLA, inputOrder, orderby);
}

function find(id){
    return db.find(TABLA, id);
}

function searchByEmail(email){
    return db.searchByEmail(TABLA, email);
}

function store(body){
    return db.store(TABLA, body);
}

function update(body){
    return db.update(TABLA, body);
}

function deleted(body){
    return db.deleted(TABLA, body);
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
    all,
    find,
    store,
    update,
    deleted,
    searchByEmail,
    findIdByUsername
}