const mysql = require('mysql');

let mysql_conn = null;
function est_db_conn(){
    mysql_conn = mysql.createPool({
        connectionLimit: 1000,
        connectTimeout: 60 * 60 * 1000,
        acquireTimeout: 60 * 60 * 1000,
        timeout   : 60 * 60 * 1000,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });
    return mysql_conn;
}

module.exports = est_db_conn();