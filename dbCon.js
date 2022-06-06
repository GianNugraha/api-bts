const { Pool } = require('pg');
// const { Pool } = require('mysql');

    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'api_test',
        password: '122020',
        port: 5432
    });

// const mysql = require('mysql');

// const pool = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "api_test"
// });

// pool.connect(function(error){
//     if(error){
//         console.error(error);
//     } else {
//         console.info("Connected to Database");
//     }
// });

    module.exports = {
        query: (text, params,results) => pool.query(text, params,results)
      }