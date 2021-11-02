const inquirer = require("inquirer");

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
                    const idCall = `SELECT id FROM roles WHERE role_id = ?;`;
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