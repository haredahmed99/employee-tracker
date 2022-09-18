const inquirer = require('inquirer');
const db = require('./config/connection');
const cTable = require('console.table');


const viewDepartments = () => {
  const sql = `SELECT * FROM departments`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
    } console.table(rows)
      manageCompany();
  })
};

const viewRoles = () => {
  const sql = `SELECT * FROM roles`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
    } console.table(rows)
      manageCompany();
  })
};

const viewEmployees = () => {
  const sql = `SELECT * FROM employees`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
    } console.table(rows)
      manageCompany();
  })
};

const addDepartment = () => {

  inquirer.prompt([
    {
      type: 'input',
      name: 'newDepartment',
      message: 'Provide name of the new department'
    }
  ])
    .then(response => {
      const departmentName = response.newDepartment;
      
      const sql = `INSERT INTO departments (name) VALUES (?)`;
      db.query(sql, departmentName, (err, rows) => {
        if (err) {
          console.log(err)
        } console.table(rows)
          viewDepartments();
      })
    })

};

const addRole = () => {

  db.query(`SELECT * FROM departments`, (err, rows) => {
    if(err) {
      console.log(err)
    } const departments = rows.map( ({ name, id }) => ({ name: name, value: id }))
     
      inquirer.prompt([
        {
          type: 'input',
          name: 'newTitle',
          message: 'Provide title for the new role'
        },
        {
          type: 'input',
          name: 'newSalary',
          message: 'Provide salary for the new role (i.e 70000)'
        },
        {
          type: 'list',
          name: 'newDepartment',
          message: 'Assign new role to a department',
          choices: departments
        }
      ])
        .then(response => {
          const newRole = [response.newTitle, response.newSalary, response.newDepartment];

          const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
          db.query(sql, newRole, (err, rows) => {
            if (err) {
              console.log(err)
            } console.table(rows)
              viewRoles();
          })
        })
    
  })
};

const addEmployee = () => {
  db.query(`SELECT * FROM roles`, (err, rows) => {
    if(err) {
      console.log(err)
    } const roles = rows.map( ({ title, id }) => ({ name: title, value: id }))

      inquirer.prompt([
        {
          type: 'input',
          name: 'newLast',
          message: 'Provide last name for new employee'
        },
        {
          type: 'input',
          name: 'newFirst',
          message: 'Provide first name for new employee'
        },
        {
          type: 'list',
          name: 'newRole',
          message: 'Assign role to new employee',
          choices: roles
        }
      ])
        .then(response => {
          const newEmployee = [response.newLast, response.newFirst, response.newRole]
          db.query(`SELECT last_name, first_name, id FROM employees WHERE manager_id IS NULL`, (err, rows) => {
            if(err) {
              console.log(err)
            } const managers = rows.map( ({ last_name, first_name, id }) => ({ name: `${last_name}, ${first_name}`, value: id}))
              managers.push({ name: 'Manager not needed', value: null });
              
              inquirer.prompt([
                {
                type: 'list',
                name: 'assignManager',
                message: 'Assign a manager to new employee',
                choices: managers
                }
              ])
              .then(response => {
                newEmployee.push(response.assignManager);

                const sql = `INSERT INTO employees (last_name, first_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                db.query(sql, newEmployee, (err, rows) => {
                  if (err) {
                    console.log(err)
                  } console.table(rows)
                    viewEmployees();
                })
                
              })
          })
        })
  })
  
};

const updateRole = () => {
  db.query(`SELECT * FROM employees`, (err, rows) => {
    if(err) {
      console.log(err)
    } const employees = rows.map( ({ last_name, first_name, id }) => ({ name: `${last_name}, ${first_name}`, value: id }))

      inquirer.prompt([
        {
          type: 'list',
          name: 'thisEmployee',
          message: 'Select employee to update role',
          choices: employees
        }
      ])
      .then(response => {
        const updatedRoleInfo = [response.thisEmployee];
        db.query(`SELECT * FROM roles`, (err, rows) => {
          if(err) {
            console.log(err)
          } const roles = rows.map( ({ title, id }) => ({ name: title, value: id }))
            
            inquirer.prompt([
              {
              type: 'list',
              name: 'updateRole',
              message: 'Select new role',
              choices: roles
              }
            ])
            .then(response => {
              console.log(response.updateRole);
              updatedRoleInfo.unshift(response.updateRole);
              console.log(updatedRoleInfo);

              const sql = `UPDATE employees SET role_id = ? WHERE id = ?`
              db.query(sql, updatedRoleInfo, (err, rows) => {
                if (err) {
                  console.log(err)
                }console.table(rows)
                viewEmployees();
              })
            })
        })
      })
})
}


const manageCompany = () => {
  return inquirer.prompt({

    type: 'list',
    name: 'manage',
    message: "Select to manage company employees",
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role'],

  })

  .then(response => {
    switch(response.manage) {

      case 'View all departments':
        viewDepartments();
        break;
      case 'View all roles':
        viewRoles();
        break;
      case 'View all employees':
        viewEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update employee role':
        updateRole();
        break;
  }
  
    })
}

manageCompany();



