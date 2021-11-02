const inquirer = require('inquirer');

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
            if (err) throw err;
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
                    if (err) throw err;
                    dataArr.push(results[0].id);

                    const managerCall = `SELECT CONCAT(first_name,' ', last_name) AS name FROM employee WHERE manager_id is NULL;`;
                    db.query(managerCall, (err, results) => {
                    if (err) throw err;
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
                                console.log(`Added ${dataArr[0]+" "+dataArr[1]}...\n`);
                                initialPrompt();
                            });
                        } else {
                            const name = data.manager.split(" ");
                            const managerIdCall = `SELECT id FROM employee WHERE first_name =? AND last_name = ?;`;
                            db.query(managerIdCall, name, (err, results) => {
                                if (err) throw err;
                                dataArr.push(results[0].id);
                                const addEmp = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;
                                db.query(addEmp, dataArr, (err, results) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log(`Added ${dataArr[0]+" "+dataArr[1]}...\n`);
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