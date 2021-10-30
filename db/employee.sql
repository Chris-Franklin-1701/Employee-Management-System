SELECT employee.id AS id,
employee.first_name AS first_name, employee.last_name AS last_name, roles.title AS title, departments.name AS department, roles.salary AS salary

FROM employee
INNER JOIN roles
ON roles.id = employee.role_id
INNER JOIN departments
ON departments.id = roles.department_id;