const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
const cTable = require('console.table');
require("dotenv").config();


// Connect to database
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


function init() {
    initialPrompt();
}



init();


function initialPrompt(){
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        name: "selection",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee", "Exit EMS Program"]
    }])

    .then(function({selection}){
        if (selection === "View all roles") {
           // db.query('SELECT * FROM students', function (err, results) {
                console.log("roles");
                initialPrompt();
            //});
        } else if (selection === "View all employees") {
            //db.query('SELECT * FROM students', function (err, results) {
                console.log(result);
                initialPrompt();
            //});
        } else if (selection === "Add a department") {
            //db.query('SELECT * FROM students', function (err, results) {
                console.log(results);
                initialPrompt();
            //});
        } else if (selection === "Add a role") {
            //db.query('SELECT * FROM students', function (err, results) {
                console.log(results);
                initialPrompt();
            //});
        } else if (selection === "Add an employee") {
           // db.query('SELECT * FROM students', function (err, results) {
                console.log(results);
                initialPrompt();
            //});
        } else if (selection === "Update an employee") {
            //db.query('SELECT * FROM students', function (err, results) {
                console.log(results);
                initialPrompt();
            //});
        } else if (selection === "Exit EMS Program") {
                console.log("Thank you and have a great day, Good bye!!!")
                process.exit();
        } else { // this is the function for "View all departments"
            db.query('SELECT * FROM departments;', function (err, results) {
                console.table(results);
                initialPrompt();
            });
        };
    });
};