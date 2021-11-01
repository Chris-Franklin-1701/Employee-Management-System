const inquirer = require('inquirer');

function addRole(){
    let departmentArr = [];
    for (i = 0; i < department.length; i++) {
        departmentArr.push(object(department[i]));
    };

    inquirer.prompt([{
        type: "input",
        message: "What is the name of the role?",
        name: "title"
    },{
        type: "input",
        message: "What is the salary of the role?",
        name: "salary"
    },{
        type: "input",
        message: "What department does the role belong to?",
        name: "department_id"
    }])

    .then((data) =>{
        for(i=0; i<departmentArr.length; i++){
            if(departmentArr[i].name === data.department_id) {
                department_id = departmentArr[i].id
            }
        }

        db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${data.title}', '${data.salary}', '${data.department_id}')`, (err, results) => {
            if (err) {
                console.log(err);
            }
            console.log("Added "+`${data.name}`+" to the database.");
            initialPrompt();
        });
        
    })


};
addRole();

//module.exports = addRole;