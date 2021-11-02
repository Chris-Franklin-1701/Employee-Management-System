const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
const cTable = require('console.table');
const figlet = require('figlet');
require("dotenv").config();

console.log(figlet.textSync('Employee Management System', {
    font: 'Doom',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 100,
    whitespaceBreak: true
}));

// Connect to database
const db = mysql.createConnection(
    {
    host: process.env.DB_HOST,
    // MySQL username,
    user: process.env.DB_USER,
    // MySQL password
    password: process.env.DB_Pass,
    database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);


function init() {
    initialPrompt();
}





function initialPrompt(){
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        name: "selection",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee", "Exit EMS Program"]
    }])

    .then(function({selection}){
        if (selection === "View all roles") {
            db.query(`SELECT roles.title AS title, roles.id AS id, departments.name AS department, roles.salary AS salary
                FROM roles
                JOIN departments ON roles.department_id = departments.id;`, function (err, results) {
                console.table(results);
                initialPrompt();
            });
        } else if (selection === "View all employees") {
            db.query(`SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, roles.title AS title, departments.name AS department, roles.salary AS salary, CONCAT(m.first_name ,' ',m.last_name) AS manager
            FROM employee e
            INNER JOIN roles
            ON e.role_id = roles.id
            INNER JOIN departments
            ON roles.department_id = departments.id
            LEFT JOIN employee m
            ON m.id = e.manager_id;`, function (err, results) {
                console.table(results);
                initialPrompt();
            });
        } else if (selection === "Add a department") {
            function addDepartment(){
                inquirer.prompt([{
                    type: "input",
                    message: "What is the name of the department?",
                    name: "name"
                }])
            
                .then((data) =>{
            
                    db.query(`INSERT INTO departments (name) VALUES ('${data.name}')`, (err, results) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log("Added "+`${data.name}`+" to the database.");
                        initialPrompt();
                    });
                    
                })
            
            
            };
            addDepartment();
        } else if (selection === "Add a role") {
            function addRole(){
                const departmentCall = `SELECT name FROM departments;`;
                db.query(departmentCall, function (err,results) {
                    if (err) {
                        console.log(err);
                    }
                    const departmentsArr = results;
            
                    inquirer.prompt([{
                        type:"input",
                        message: "What is the name of the role?",
                        name: "title"
                    },
                    {
                        type: "input",
                        message: "What is the salary of the role?",
                        name: "salary"
                    },
                    {
                        type: "list",
                        message: "What department does the role belong to?",
                        name: "department_id",
                        choices: departmentsArr
                    }])
            
                    .then ((data) => {
                        const resultsArr = [data.title, data.salary];
                        const idCall = `SELECT id FROM departments WHERE name = ?;`;
            
                        db.query(idCall, data.department_id, function (err, results) {
                            resultsArr.push(results[0].id);
            
                            const role = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
            
                            db.query(role, resultsArr, function (err, results) {
                                if (err){
                                    console.log(err);
                                }
                                console.log("Added "+`${resultsArr[0]}`+" role to the database.");
                                initialPrompt();
                            });
                        });
                    });
                });
            
            };
            addRole();
        } else if (selection === "Add an employee") {
            function addEmployee(){
                inquirer.prompt([{
                    type:"input",
                    message: "What is the employee's first name?",
                    name: "first_name"
                },
                {
                    type: "input",
                    message: "What is the employee's last name?",
                    name: "last_name"
                }])
        
                .then((data) => {
                    const dataArr = [data.first_name, data.last_name];
                    const roleCall = `SELECT title AS name FROM roles;`;
                    db.query(roleCall, function (err,results) {
                    if (err) {
                        console.log(err);
                    }
                    const rolesArr = results;
                    inquirer.prompt([{
                        type: "list",
                        message: "What is the employee's role?",
                        name: "role",
                        choices: rolesArr
                    }])
                    .then((data) => {
                        const roleIdCall = `SELECT id FROM roles WHERE title = ?;`;
                        db.query(roleIdCall, data.role, (err, results) => {
                            if (err) {
                                console.log(err);
                            }
                            dataArr.push(results[0].id);
        
                            const managerCall = `SELECT CONCAT(first_name,' ', last_name) AS name FROM employee WHERE manager_id is NULL;`;
                            db.query(managerCall, (err, results) => {
                            if (err) {
                                console.log(err);
                            }
                            const managerArr = results;
                            managerArr.splice(0,0, "None");
                            inquirer.prompt([{
                                type: "list",
                                message: "Who is the employee's manager?",
                                name: "manager",
                                choices: managerArr
                            }])
                            .then((data) => {
                                if (data.manager === "None") {
                                    dataArr.push(null);
                                    const addEmp = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;
                                    db.query(addEmp, dataArr, (err, results) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                        console.log(`Added ${dataArr[0]+" "+dataArr[1]} to the database.`);
                                        initialPrompt();
                                    });
                                } else {
                                    const name = data.manager.split(" ");
                                    const managerIdCall = `SELECT id FROM employee WHERE first_name =? AND last_name = ?;`;
                                    db.query(managerIdCall, name, (err, results) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                        dataArr.push(results[0].id);
                                        const addEmp = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;
                                        db.query(addEmp, dataArr, (err, results) => {
                                            if (err) {
                                                console.log(err);
                                            }
                                            console.log(`Added ${dataArr[0]+" "+dataArr[1]} to the database.`);
                                            initialPrompt();
                                        });
                                    });
                                };
                            })
                        })
                        
                        })
                    })
                })
            });
        };
        addEmployee();
        } else if (selection === "Update an employee") {
            function updateEmployeeRole() {
                const employeeCall = `SELECT CONCAT(first_name," ", last_name) AS name FROM employee;`;
                db.query(employeeCall, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    inquirer.prompt([{
                        type: "list",
                        message: "Which employee would you like to update?",
                        name: "employee",
                        choices: results
                    }])
                    .then((data) => {
                        const dataArr = data.employee.split(" ");
                        const roleCall = `SELECT title AS name FROM roles;`;
                        db.query(roleCall, function (err, results) {
                            if (err) {
                                console.log(err);
                            }
                            inquirer.prompt([{
                                type: "list",
                                message: "Which role would you like to assign the selected employee?",
                                name: "title",
                                choices: results
                            }])
                            .then((data) => {
                                const idCall = `SELECT id FROM roles WHERE title = ?;`;
                                db.query(idCall, data.title, function (err, results) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    dataArr.splice(0, 0, results[0].id);
                                    const updateEmp = `UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name =?;`;
                                    db.query(updateEmp, dataArr, function (err, results) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        console.log(`Updated employee's role.`);
                                        initialPrompt();
                                    });
                                });
                            });
                        });
                    });
                });
            };
            updateEmployeeRole();
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

init();