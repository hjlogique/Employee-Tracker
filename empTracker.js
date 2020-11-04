/* ========= EMPLOYEE-TRACKER =========
   ======= by Henry Jean Logique ======
   ==========  empTracker.js  ========= */

// Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const conTable = require("console.table");
const promMysql = require("promise-mysql");
const logo = require("asciiart-logo");
const config = require('./package.json');

const conProp = { // Connection Properties
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mySql@Grif99",
    database: "employee_tracker_db"
}

// Connect to database
const connection = mysql.createConnection(conProp);

connection.connect((err) => {
    if (err) throw err;

    // Render ASCII-art Logo for the app
    console.log(logo(config).render());
    runSearch();
});

// Main menu function
function runSearch() {

    // Prompt user to choose an option
    inquirer
        .prompt({
            name: "options",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees By Department",
                "View All Employees By Role",
                "View All Employees By Manager",
                "Add Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "Remove Employee",
                "Add Role",
                "Remove Role",
                "Add Department",
                "Remove Department",
                "Departments Total Utilized Budget"
            ]
        })
        .then((answer) => {

            (answer.options === "View All Employees") ? viewEmp()
                : (answer.options === "View All Employees By Department") ? viewEmpByDept()
                    : (answer.options === "View All Employees By Role") ? viewEmpByRole()
                        : (answer.options === "View All Employees By Manager") ? viewEmpByMngr()
                            : (answer.options === "Add Employee") ? addEmp()
                                : (answer.options === "Remove Employee") ? removeEmp()
                                    : (answer.options === "Update Employee Role") ? updateEmpRole()
                                        : (answer.options === "Update Employee Manager") ? updateEmpMngr()
                                            : (answer.options === "Add Role") ? addRole()
                                                : (answer.options === "Remove Role") ? removeRole()
                                                    : (answer.options === "Add Department") ? addDept()
                                                        : (answer.options === "Remove Department") ? removeDept()
                                                            : (answer.options === "Departments Total Utilized Budget") ? viewDeptBudget()
                                                                : null

        });
}

// ===================================================
// ===============  View All Employees ===============
// ===================================================

function viewEmp() { // Query employees

    let query = `SELECT e.id, e.first_name, e.last_name, 
    role.title, department.name AS department, role.salary, 
    concat(m.first_name, ' ' ,  m.last_name) AS manager 
    FROM employee e 
    LEFT JOIN employee m ON e.manager_id = m.id 
    INNER JOIN role ON e.role_id = role.id 
    INNER JOIN department ON role.department_id = department.id 
    ORDER BY ID ASC;`;

    connection.query(query, (err, res) => {
        if (err) return err;
        console.log("\n");
        console.table(res); // View query result
        runSearch();
    });
}

// ===================================================
// =========  View Employees by department ===========
// ===================================================

function viewEmpByDept() {

    let deptList = []; // List of departments

    // Connect by Promise-Sql wrapper to query departments
    promMysql.createConnection(conProp).then((conRes) => {

        return conRes.query('SELECT name FROM department');

    }).then((depRes) => { // Add departments to the list
        depRes.forEach(element => deptList.push(element.name))

    }).then(() => {

        inquirer.prompt({ // Prompt users with department selection
            name: "department",
            type: "list",
            message: "Select a department to view the related employees.",
            choices: deptList
        })
            .then((answer) => { // Query employees of the selected department

                const query = `SELECT e.id AS ID, e.first_name AS 'First Name',
                 e.last_name AS 'Last Name', role.title AS Title, 
                 department.name AS Department, role.salary AS Salary, 
                 concat(m.first_name, ' ' ,  m.last_name) AS Manager 
                 FROM employee e 
                 LEFT JOIN employee m ON e.manager_id = m.id 
                 INNER JOIN role ON e.role_id = role.id 
                 INNER JOIN department ON role.department_id = department.id 
                 WHERE department.name = '${answer.department}' ORDER BY ID ASC;`;

                connection.query(query, (err, res) => {
                    if (err) return err;
                    console.log("\n");
                    console.table(res); // View query result
                    runSearch();
                });
            });
    });
}

// ===================================================
// ============  Query Employees by Role =============
// ===================================================

function viewEmpByRole() {

    let roleList = []; // List of all roles

    // Connect by Promise-Sql wrapper to query roles
    promMysql.createConnection(conProp).then((conRes) => {

        return conRes.query('SELECT title FROM role');

    }).then((roleRes) => { // Add roles to the list
        roleRes.forEach(element => roleList.push(element.title))

    }).then(() => {

        inquirer.prompt({ // Prompt users with role selections
            name: "role",
            type: "list",
            message: "Select a role to view the related employees.",
            choices: roleList
        })
            .then((answer) => {

                // Query employees of the selected role
                const query = `SELECT e.id AS ID, e.first_name AS 'First Name', 
                e.last_name AS 'Last Name', role.title AS Title, 
                department.name AS Department, role.salary AS Salary, 
                concat(m.first_name, ' ' ,  m.last_name) AS Manager 
                FROM employee e 
                LEFT JOIN employee m ON e.manager_id = m.id 
                INNER JOIN role ON e.role_id = role.id 
                INNER JOIN department ON role.department_id = department.id 
                WHERE role.title = '${answer.role}' ORDER BY ID ASC;`;

                connection.query(query, (err, res) => {
                    if (err) return err;
                    console.log("\n");
                    console.table(res); // View query result
                    runSearch();
                });
            });
    });
}

// ===================================================
// ===============  Add New Employee  ================
// ===================================================

function addEmp() {

    // Role and manager lists 
    let roleList = [];
    let managerList = [];

    // Connect by Promise-Sql wrapper to query roles and managers
    promMysql.createConnection(conProp).then((conRes) => {

        return Promise.all([ // Return as a Promise
            conRes.query(`SELECT id, title 
            FROM role 
            ORDER BY title ASC;`),

            conRes.query(`SELECT employee.id, 
            concat(employee.first_name, ' ' ,
            employee.last_name) AS Employee 
            FROM employee 
            ORDER BY Employee ASC;`)
        ]);

    }).then(([roleRes, manRes]) => {

        // Add roles and managers to the lists
        roleRes.forEach(element => roleList.push(element.title));
        manRes.forEach(element => managerList.push(element.Employee));

        return Promise.all([roleRes, manRes]);

    }).then(([roleRes, manRes]) => {
        managerList.unshift('--'); // In case there is no manager

        inquirer.prompt([
            { // Prompt users for employee's first name
                name: "firstName",
                type: "input",
                message: "What is the employee's first name?",

                validate: function (input) { // Check if nothing is entered
                    if (input === "") {
                        console.log("Employee's first name is required.");
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
            { // Prompt users for employee's last name
                name: "lastName",
                type: "input",
                message: "What is the employee's Last Name?",
                // Validate field is not blank
                validate: function (input) {
                    if (input === "") {
                        console.log("Employee's last name is required.");
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
            { // Prompt users list of roles for the employee
                name: "role",
                type: "list",
                message: "Select the employee's role.",
                choices: roleList
            }, {
                // Prompt users list of manager for the employee
                name: "manager",
                type: "list",
                message: "Select the employee's manager.",
                choices: managerList
            }]).then((answer) => {


                let roleID; // ID variables
                let managerID = null;

                roleRes.forEach(element => { // Selected role's ID
                    if (answer.role == element.title) {
                        roleID = element.id;
                    }
                });

                manRes.forEach(element => { // Selected manager's ID
                    if (answer.manager == element.Employee) {
                        managerID = element.id;
                    }
                });

                // Add and confirm that the new employee is added to the employee table 
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${managerID});`, (err, res) => {
                    if (err) return err;
                    console.log(`\n The employee ${answer.firstName} ${answer.lastName} is added! \n `);
                    runSearch();
                });
            });
    });
}

// ===================================================
// =================  Add New Role  ==================
// ===================================================

function addRole() {

    let deptList = []; // List of departments

    // Connect by Promise-Sql wrapper to query departments
    promMysql.createConnection(conProp).then((conRes) => {

        return conRes.query(`SELECT id, name 
        FROM department 
        ORDER BY name ASC;`);

    }).then((depRes) => {
        depRes.forEach(element => deptList.push(element.name));
        return depRes;

    }).then((depRes) => {

        inquirer.prompt([
            {
                // Prompt users with an entry for the new role
                name: "roleTitle",
                type: "input",
                message: "What is the new role called?"
            },

            { // Prompt users an entry for the role's salary amount
                name: "roleSalary",
                type: "number",
                message: "How much is the role's salary?"
            },

            { // Prompt users with the list of departments for the new role 
                name: "roleDept",
                type: "list",
                message: "Which department does this role belong to?",
                choices: deptList

            }]).then((answer) => {

                // Get the id of the selected department
                let deptID;
                depRes.forEach(element => {
                    if (answer.roleDept == element.name) {
                        deptID = element.id;
                    }
                });

                // Add the new role to the role table
                connection.query(`INSERT INTO role (title, salary, department_id)
                VALUES ("${answer.roleTitle}", ${answer.roleSalary}, ${deptID});`, (err, res) => {
                    if (err) return err;
                    console.log(`\n The new role ${answer.roleTitle} is added. \n`);
                    runSearch();
                });
            });
    });
}

// ===================================================
// ==============  Add New Department  ===============
// ===================================================

function addDept() {

    inquirer.prompt({ // Prompt users for the name of the new department

        name: "deptName",
        type: "input",
        message: "What is the name of the new department?"

    }).then((answer) => { // Add the new department to the department table

        connection.query(`INSERT INTO department (name)
        VALUES ("${answer.deptName}");`, (err, res) => {
            if (err) return err;
            console.log(`\n The new department ${answer.deptName} is added. \n`);
            runSearch();
        });
    });
}

// ===================================================
// =============  Update Employee Role  ==============
// ===================================================

function updateEmpRole() {

    // Employee and role lists
    let empList = [];
    let roleList = [];

    // Connect by Promise-Sql wrapper to query employees and roles
    promMysql.createConnection(conProp).then((conRes) => {
        return Promise.all([

            conRes.query(`SELECT id, title 
            FROM role 
            ORDER BY title ASC;`),

            conRes.query(`SELECT employee.id, 
            concat(employee.first_name, ' ' ,
            employee.last_name) AS Employee 
            FROM employee 
            ORDER BY Employee ASC;`)
        ]);

    }).then(([roleRes, empRes]) => {

        // Add roles and employess to the lists
        roleRes.forEach(element => roleList.push(element.title));
        empRes.forEach(element => empList.push(element.Employee));

        return Promise.all([roleRes, empRes]);

    }).then(([roleRes, empRes]) => {

        inquirer.prompt([
            {
                // Prompt users with list of employees
                name: "employee",
                type: "list",
                message: "Which employee would you like to edit?",
                choices: empList

            }, { // Prompt users with list of roles
                name: "role",
                type: "list",
                message: "Which role should the employee have?",
                choices: roleList

            },]).then((answer) => {

                // Get ids of the selected employee and role 
                let roleID;
                let empID;

                roleRes.forEach(element => {
                    if (answer.role == element.title) {
                        roleID = element.id;
                    }
                });

                empRes.forEach(element => {
                    if (answer.employee == element.Employee) {
                        empID = element.id;
                    }
                });

                // Update and confirm employee's new role
                connection.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${empID}`, (err, res) => {
                    if (err) return err;
                    console.log(`\n ${answer.employee}'s role is changed to ${answer.role}. \n `);
                    runSearch();
                });
            });
    });
}

// ===================================================
// ==========  Update Employee's Manager  ============
// ===================================================

function updateEmpMngr() {

    let empList = []; // Employees List

    // Connect by Promise-Sql wrapper to query employees 
    promMysql.createConnection(conProp).then((conRes) => {

        return conRes.query(`SELECT employee.id, 
        concat(employee.first_name, ' ' ,  
        employee.last_name) AS Employee 
        FROM employee 
        ORDER BY Employee ASC;`);

    }).then((empRes) => { // Add to employee list

        empRes.forEach(element => empList.push(element.Employee));
        return empRes;

    }).then((empRes) => {

        inquirer.prompt([
            {
                // Prompt users to select an employee from the employee list
                name: "employee",
                type: "list",
                message: "Which employee would you like to edit?",
                choices: empList
            }, {
                // Prompt users to select a new manager from the employee list
                name: "manager",
                type: "list",
                message: "Select a new manager for the employee.",
                choices: empList

            },]).then((answer) => {

                // Get the ids of the selected employee and manager
                let empID;
                let manID;

                empRes.forEach(element => {
                    if (answer.manager == element.Employee) {
                        manID = element.id;
                    }
                });

                empRes.forEach(element => {
                    if (answer.employee == element.Employee) {
                        empID = element.id;
                    }
                });

                // Update employee's manager and confirm the change
                connection.query(`UPDATE employee SET manager_id = ${manID} 
                WHERE id = ${empID};`, (err, res) => {

                    if (err) return err;
                    console.log(`\n ${answer.employee}'s manager is changed to ${answer.manager}. \n`);

                    runSearch();
                });
            });
    });
}

// ===================================================
// ==========  View Employees by Manager ============
// ===================================================

function viewEmpByMngr() {

    let manList = []; // List of all managers

    // Connect by Promise-Sql wrapper to query managers
    promMysql.createConnection(conProp).then((conRes) => {

        return conRes.query(`SELECT DISTINCT m.id, 
            CONCAT(m.first_name, ' ', m.last_name) AS manager 
            FROM employee e 
            Inner JOIN employee m ON e.manager_id = m.id;`);

    }).then((manRes) => { // Add managers to the list
        manRes.forEach(element => manList.push(element.manager))
        return manRes;

    }).then((manRes) => {

        inquirer.prompt({ // Prompt users with list of managers 

            name: "manager",
            type: "list",
            message: "Select a manager to view the related employees.",
            choices: manList
        })
            .then((answer) => { // Query employees of the selected manager

                let manID;
                manRes.forEach(element => { // get ID of selected manager
                    if (answer.manager == element.manager) {
                        manID = element.id;
                    }
                });

                // Query employees of the selected manager
                const query = `SELECT e.id, e.first_name, e.last_name, 
                    role.title, department.name AS department, role.salary, 
                    concat(m.first_name, ' ' ,  m.last_name) AS manager
                    FROM employee e
                    LEFT JOIN employee m ON e.manager_id = m.id
                    INNER JOIN role ON e.role_id = role.id
                    INNER JOIN department ON role.department_id = department.id
                    WHERE e.manager_id = ${manID};`;

                connection.query(query, (err, res) => {
                    if (err) return err;

                    console.log("\n");
                    console.table(res); // View query result

                    runSearch();
                });
            });
    });
}

// ===================================================
// ===============  Remove Employee  =================
// ===================================================

function removeEmp() {

    let empList = []; // Employee list

    // Connect by Promise-Sql wrapper to query employees 
    promMysql.createConnection(conProp).then((conRes) => {

        return conRes.query(`SELECT employee.id, 
        concat(employee.first_name, ' ' ,  
        employee.last_name) AS employee 
        FROM employee 
        ORDER BY Employee ASC;`);

    }).then((empRes) => {  // Add employees to the list

        empRes.forEach(element => {
            empList.push(element.employee);
        });

        inquirer.prompt([
            { // Prompt users list of employees

                name: "employee",
                type: "list",
                message: "Which employee should be removed?",
                choices: empList
            }, {
                // Confirm that the selected employee should be removed
                name: "confDel",
                type: "list",
                message: "Are you sure you want to remove the employee?",
                choices: ["NO", "YES"]

            }]).then((answer) => {

                if (answer.confDel == "YES") { // If deletion confirmed

                    // Get the id of the selected employee 
                    let empID;
                    empRes.forEach(element => {
                        if (answer.employee == element.employee) {
                            empID = element.id;
                        }
                    });

                    // Remove the selected employee from the employee table 
                    connection.query(`DELETE FROM employee WHERE id=${empID};`, (err, res) => {

                        if (err) return err;
                        console.log(`\n Employee '${answer.employee}' is removed from the employee list. \n `);

                        runSearch();
                    });
                }
                else { // If deletion is not confirmed, back to the main search menu

                    console.log(`\n Employee '${answer.employee}' is not removed from the employee list.\n `);
                    runSearch();
                }

            });
    });
}

// ===================================================
// =================  Remove Role  ===================
// ===================================================

function removeRole() {

    let roleList = []; // List of roles

    // Connect by Promise-Sql wrapper to query roles 
    promMysql.createConnection(conProp).then((conRes) => {

        return conRes.query("SELECT id, title FROM role");

    }).then((roleRes) => {

        roleRes.forEach(element => { // Add roles to the list
            roleList.push(element.title);
        });

        inquirer.prompt([{

            // Confirm if a role should be deleted
            name: "confDel",
            type: "list",
            message: `== Are you sure you want to remove a role?
  == All associated employees will also be removed.`,
            choices: ["NO", "YES"]

        }]).then((answer) => {

            if (answer.confDel === "NO") { // If deletion is not confirmed
                console.log(`\n No role is deleted! \n `);
                runSearch();
            } else {

                inquirer.prompt({

                    name: "role",
                    type: "list",
                    message: "Which role should be removed?",
                    choices: roleList

                }).then((answer) => {

                    // Get the id of the selected role 
                    let roleID;
                    roleRes.forEach(element => {
                        if (answer.role == element.title) {
                            roleID = element.id;
                        }
                    });

                    // Delete the selected role from the role table 
                    connection.query(`DELETE FROM role WHERE id=${roleID};`, (err, res) => {

                        if (err) return err;
                        console.log(`\n The role '${answer.role}' is removed. \n `);

                        runSearch();
                    });
                });
            }
        });
    });
}

// ===================================================
// ==============  Remove Department  ================
// ===================================================

function removeDept() {

    let deptList = [];  // List of departments

    // Connect by Promise-Sql wrapper to query departments 
    promMysql.createConnection(conProp).then((conRes) => {

        return conRes.query("SELECT id, name FROM department");

    }).then((depRes) => { // Add departments to the list

        depRes.forEach(element => deptList.push(element.name));

        inquirer.prompt({ // Confirm the deletion of a department

            name: "conDel",
            type: "list",
            message: `== Are you sure you want to remove a department? 
  == All associated employees will also be removed.`,
            choices: ["NO", "YES"]

        }).then((answer) => { // If deletion is not confirmed

            if (answer.conDel === "NO") {

                console.log(`\n No department is deleted! \n `);
                runSearch();

            } else {

                inquirer.prompt({  // Prompt users with the list of departments

                    name: "department",
                    type: "list",
                    message: "Which department should be removed?",
                    choices: deptList

                }).then((answer) => { // If deletion is confirmed

                    // Get the id of the selected department
                    let deptID;
                    depRes.forEach(element => {
                        if (answer.department == element.name) {
                            deptID = element.id;
                        }
                    });

                    // Delete the selected department from the department table
                    connection.query(`DELETE FROM department WHERE id=${deptID};`, (err, res) => {

                        if (err) return err;
                        console.log(`\n The department '${answer.department}' is removed. \n `);

                        runSearch();
                    });
                });
            }
        });
    });
}

// ===================================================
// =====  Total Utilized Budgets of Departments ======
// ===================================================

function viewDeptBudget() {

    // Connect by Promise-Sql wrapper to query department and salary
    promMysql.createConnection(conProp).then((conRes) => {

        return Promise.all([

            conRes.query(`SELECT department.name AS department, role.salary 
                        FROM employee e 
                        LEFT JOIN employee m ON e.manager_id = m.id 
                        INNER JOIN role ON e.role_id = role.id 
                        INNER JOIN department ON role.department_id = department.id 
                        ORDER BY department ASC;`),

            conRes.query('SELECT name FROM department ORDER BY name ASC')
        ]);

    }).then(([salRes, depRes]) => {

        let budgList = [];
        let dep;

        for (i = 0; i < depRes.length; i++) {
            let depBudget = 0;

            // Sum the salaries 
            for (j = 0; j < salRes.length; j++) {
                if (depRes[i].name == salRes[j].department) {
                    depBudget += salRes[j].salary;
                }
            }

            dep = { // Departments and budgets
                Department: depRes[i].name,
                Budget: depBudget
            }

            budgList.push(dep);  // Add departments and budgets to the list
        }

        console.log("\n");
        console.table(budgList); // Departments budgets 
        
        runSearch();
    });
}