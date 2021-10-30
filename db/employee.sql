SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, roles.title AS title, departments.name AS department, roles.salary AS salary, CONCAT(m.first_name ,' ',m.last_name) AS manager

FROM employee e
INNER JOIN roles
ON e.role_id = roles.id
INNER JOIN departments
ON roles.department_id = departments.id
LEFT JOIN employee m
ON m.id = e.manager_id;