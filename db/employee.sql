SELECT role employee.id AS id,
employee.first_name AS first_name, employee.last_name AS last_name, roles.title AS title, departments.name AS department, roles.salary AS salary
FROM employee
JOIN roles
ON employee.role_id = roles.id,
JOIN departments
ON roles.department_id = departments.id,
JOIN employee
ON employee.manager_id = employee.id;