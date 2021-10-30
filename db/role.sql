SELECT roles.title AS title, roles.id AS id, departments.name AS department, roles.salary AS salary
FROM roles
JOIN departments ON roles.department_id = departments.id;