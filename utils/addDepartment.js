const inquirer = require("inquirer");


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

//module.exports = addDepartment;