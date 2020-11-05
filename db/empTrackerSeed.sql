/* === Employee Tracker Seed === */

USE  employee_tracker_db;

--- Insert Department Records ---
INSERT INTO department
    (name)
VALUES
    ('HR'),
    ('Finance'),
    ('Development'),
    ('Research'),
    ('Business');

------ Insert Role Records ------
INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Staffing Coordinator', 72000, 1),
    ('Graphic Designer', 81000, 5),
    ('Multimedia Developer', 119000, 3),
    ('Writer', 92000, 5),
    ('Computer Engineer', 143000, 4),
    ('Web Developer', 108000, 3),
    ('3D Graphics Programmer', 152000, 3),
    ('Accounter', 75000, 2),
    ('Sales Representative', 137000, 5);

---- Insert Employee Records ----
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Claudia', 'McMurphy', 1, NULL),
    ('Mary', 'Lavigne', 2, 1),
    ('Mark', 'Monet', 3, NULL),
    ('Alex', 'Carter', 4, 3),
    ('Hans', 'Muller', 5, NULL),
    ('Kristin', 'Garnier', 6, 5),
    ('Henry', 'Flux', 7, NULL),
    ('Erika', 'Klein', 8, 7),
    ('Anna', 'Dupont', 9, 8);


