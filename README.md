
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![Badge for GitHub repo top language](https://img.shields.io/github/languages/top/hjlogique/Employee-Tracker?style=flat&logo=appveyor) ![Badge for GitHub last commit](https://img.shields.io/github/last-commit/hjlogique/Employee-Tracker?style=flat&logo=appveyor)
  
# Employee-Tracker

  ## Description 
  
  This application allows non-developer users to manage a company's employees by interacting with information stored in databases through a command line interface. Users can view all employees, thier managers, their roles and their departments. They can add, update and remove (delete) employees, their managers, roles and departments. Users can also By doing so users can control the information in database.
 
  ## Table of Contents
  * [Installation](#installation)
  * [Usage](#usage)
  * [Contributing](#contributing)
  * [Questions](#questions)
  * [License](#license)
  
  ## Installation
  
  To run this application a `MySql` databese called `employee_tracker_db` with three specific tables, `employee`, `role` and `department` are required. The `empTrackerSchema.sql` file in the `db` folder generates the database and the tables. In the command line type `mysql -uroot -p > empTrackerSchema.sql` to generate them. The `empTrackerSeed.sql` file insert the information to the tables. In command line type `mysql -uroot -p -D employee_tracker_db > empTrackerSeed.sql` to insert the records. 

  To run the application type the `npm i` command to install the NPM package dependencies specified in the `package.json` file. The required modules for this applcation are [inquirer](https://www.npmjs.com/package/inquirer), [mysql](https://www.npmjs.com/package/mysql), [promise-mysql](https://www.npmjs.com/package/promise-mysql), [console.table](https://www.npmjs.com/package/console.table), [asciiart-logo](https://www.npmjs.com/package/asciiart-logo).
  Next type `node empTracker.js` to run the application. (watch the clip below)

  ![Demo of Software-Engineering-Team-Generator](/assets/employee_tracker.gif)

  ## Usage 
  
  Once the application runs in the command line, users are given the following list of options to select from. 

   * `View All Employees`: Displays all employees and all their related information, like their roles, salaries, departments and managers.

   * `View All Employees By Department`: Allows users to select a department first, then application displays all the employees in that department.

   * `View All Employees By Role`: Allows users to select a specific role first, then application displays all the employees with that role.

   * `View All Employees By Manager`: Allows users to select a manager first, then application displays all the employees assigned to that manager.

   * `Add Employee`: Users can add new employees and asign them roles and managers.

   * `Update Employee Role`: Users can asign new roles to employees.

   * `Update Employee Manager`: Users can asign new managers to employees.

   * `Remove Employee`: Users remove (delete) employees.

   * `Add Role`: Users can add new roles.

   * `Remove Role`: Users can remove (delete) roles.

   * `Add Department`: Users can add new departments.

   * `Remove Department`: Users can remove (delete) departments.

   * `Departments Total Utilized Budget`: A list of departments with thier total budgets are displayed.

  ## Contributing
  
  Please let me know if there are any ways to improve the logic, the code or the features of this application. Please also let me know about any found bugs or issues. I would really appreciate your contributions.
  
  ## Questions
  
  [Link to my GitHub profile](https://github.com/hjlogique)

  If you have any questions, please contact me via email:
  
  Email: hjlogique@yahoo.com
  
  ## License
  
  MIT License
