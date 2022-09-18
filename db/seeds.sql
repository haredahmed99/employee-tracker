INSERT INTO departments (name)
VALUES ("Administration"),
       ("Engineering"),
       ("Finance");

INSERT INTO roles (title, salary, department_id)
VALUES ("Admin Manager", 90000, 1),
       ("IT Manager", 90000, 2),
       ("Sales Manager", 90000, 3),
       ("Software Engineer", 80000, 2),
       ("Business Analyst", 80000, 3),
       ("Admin Specialist", 50000, 1);

INSERT INTO employees (last_name, first_name, role_id, manager_id)
VALUES ("Jordan", "Michael", 1, null),
       ("James", "Lebron", 2, null),
       ("Abdul-Jabbar", "Kareem", 3, null),
       ("Johnson", "Magic", 4, 2),
       ("Chamberlain", "Wilt", 5, 3),
       ("Russell", "Bill", 6, 1);