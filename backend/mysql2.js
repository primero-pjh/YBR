let cfg = require('./config.js');
const mysql = require('mysql2/promise');

console.log("mysql2");
let db = null;
const loading = async () => {
    db = await mysql.createPool({
        host: 'pritras.vps.phps.kr',
        user : cfg.user,
        password : cfg.password,
        database : cfg.database,
        port: 3306,
        multipleStatements: true // allows to use multiple statements
    });
    // console.log(db);
    module.exports = db;
}
loading();