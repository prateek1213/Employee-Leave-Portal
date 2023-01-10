
/* Employee table */
CREATE TABLE employees(
    emp_id INT PRIMARY KEY,
    Name VARCHAR(100) ,
    email_id VARCHAR(100),
    password VARCHAR(100)
);
ALTER TABLE employees
ADD COLUMN manager_id INT;


ALTER TABLE employees
ADD FOREIGN KEY (manager_id) REFERENCES employees(emp_id) ON DELETE
SET NULL;
DESCRIBE leave_req;

select *
from employees;

/* Leave request table */

CREATE TABLE leave_req(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    emp_id INT,
    name VARCHAR(100),
    noOfDays INT,
    type VARCHAR(20),
    status VARCHAR(20),
    reason VARCHAR(30),
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE
);

DROP TABLE leave_req;

INSERT INTO employees
VALUES(
        101,
        "Prateek Jaiswal",
        "prateekjaiswal288@gmail.com",
        "prateek",
        NULL

    );
INSERT INTO employees
VALUES(
        102,
        "Kritika Pandit",
        "kritikapandit2312@gmail.com",
        "kritika",
        101
    );
INSERT INTO employees
VALUES(
        103,
        "Sunny Sukla",
        "sunnysukla188@gmail.com",
        "sunny",
        NULL
    );
INSERT INTO employees
VALUES(
        104,
        "Pooja Pawar",
        "poojapawar218@gmail.com",
        "pooja",
        103
    );
INSERT INTO employees
VALUES(
        105,
        "Aditi Jain",
        "aditijain2098@gmail.com",
        "aditi",
        101
    );
INSERT INTO employees
VALUES(
        106,
        "Saurav Kumar",
        "sauravkumar101@gmail.com",
        "saurav",
        103
    );
INSERT INTO employees
VALUES(
        107,
        "Jai Saraswat",
        "jaisaraswat123@gmail.com",
        "jai",
        103
    );
INSERT INTO employees
VALUES(
        123,
        "Jai Kumar",
        "jaikumar121@gmail.com",
        "jai",
        101
    );



INSERT INTO employees
VALUES(108, "Nikhil Armani", "nikhil121@gmail.com","nikhil", 101);
INSERT INTO employees
VALUES(109, "Anjela Aston", "anjelaston@gmail.com","anjela", 103);
delete from employees
where emp_id = 101;
UPDATE employees
SET manager_id = NULL
WHERE emp_id = 103;

ALTER TABLE leave_req
ADD COLUMN id INT PRIMARY KEY AUTO_INCREMENT;

ALTER TABLE leave_req
DROP COLUMN toalMonthlyLeave;

ALTER TABLE leave_req
ALTER totalLeaveTaken
SET DEFAULT 0;

UPDATE leave_req
SET start_date=CURRENT_DATE();

ALTER TABLE leave_req
ALTER start_date
SET DEFAULT "2023-01-01";

select *from employees;
drop TABLE employees;

DESCRIBE leave_req;

DELETE FROM leave_req
where emp_id=102;

select *
from leave_req;
-- DROP TABLE leave_req;

UPDATE leave_req
set status='pending';

/*

TRUNCATE TABLE leave_req;

ALTER TABLE leave_req ADD UNIQUE INDEX emp_id_idx (emp_id);

select status from leave_req where emp_id=102;

DROP INDEX emp_id_idx ON leave_req;

ALTER TABLE employees DROP FOREIGN KEY emp_id;

SHOW INDEXES FROM leave_req;

ALTER TABLE leave_req DROP INDEX emp_id_idx ;
ALTER TABLE leave_req DROP FOREIGN KEY emp_id_idx;

SHOW CREATE TABLE leave_req;

ALTER TABLE leave_req DROP FOREIGN KEY leave_req_ibfk_1;

ALTER TABLE leave_req ADD FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE;

*/