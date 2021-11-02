const departmentCall = `SELECT name FROM DEPARTMENT;`;
    db.query(departmentCall, function (err,results) {
        if (err) throw err;
        const departmentsArr = results;
    })
    const roleCall = `SELECT title AS name FROM role;`;
    db.query(roleCall, function (err,results) {
        if (err) throw err;
        const rolesArr = results;
    })
    const managerCall = `SELECT CONCAT(first_name,' ', last_name) AS name FROM employee WHERE manager_id is NULL;`;
    db.query(managerCall, (err, results) => {
        if (err) throw err;
        const managerArr = results;
        managerArr.splice(0,0, "None");
    })