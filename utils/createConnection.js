const mysql = require('mysql2');

const db = mysql.createConnection(
    {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: process.env.DB_Pass,
    database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);
initialPrompt();

module.exports = db;