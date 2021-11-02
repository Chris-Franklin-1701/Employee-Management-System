const inquirer = require('inquirer');

function addRole(){
    const departmentCall = `SELECT name FROM DEPARTMENT;`;
    db.query(departmentCall, function (err,results) {
        if (err) throw err;
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
            const idCall = `SELECT id FROM department WHERE name = ?;`;

            db.query(idCall, data.department_id, function (err, results) {
                resultsArr.push(results[0].id);

                const role = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

                db.query(role, resultsArr, function (err, results) {
                    if (err){
                        console.log(err);
                    }
                    console.log("Added "+`${data.tile}`+" role to the database.");
                    initialPrompt();
                })
            })
        })
    })

};
addRole();

//module.exports = addRole;