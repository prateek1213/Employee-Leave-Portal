/* Api & connections set-up */
const mysql = require("mysql");

const x = require("express");
const app = x();
var date = new Date();
const mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "xyz",
    database: "giraffe",
    multipleStatements: true
})


let session = require("express-session");
app.use(session({
    secret: "secret",
    resave: "false",
    saveUninitialized: true
}));

app.set("view engine", "ejs");

// let results={};
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const util = require('util');
const queryAsync = util.promisify(mysqlConnection.query).bind(mysqlConnection);

/* http requests (GET) Method */
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/home.html");
})
app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");
})

//http request for leave_req page
app.get("/leave_req", (req, res) => {
    res.sendFile(__dirname + "/leave_req.html")
})
//http req for login-portal page
app.get("/leave_req/portal", function (req, res) {
    res.sendFile(__dirname + "/login-portal.html");
})

app.get("/manager/approve", (req, res) => {

})


app.get("/manager", (req, res) => {

    let sql = "select * from leave_req join employees on leave_req.emp_id=employees.emp_id where employees.manager_id= ? and leave_req.status='pending' ";
    values = [req.session.Id];
    mysqlConnection.query(sql, values, (error, results) => {
        if (error) throw error;
        res.render("manager", { ans: results });
    })

});
app.get("/managerHome",(req,res)=>{
    res.sendFile(__dirname+"/mgrHome.html");
})


/* http requests (POST Method) */


//for login page
app.post("/login", function (req, res) {
    let emp_id = req.body.Id;
    req.session.Id = emp_id;
    req.session.Name = req.body.Name;
    let email = req.body.Email;
    let password = req.body.Password;

    let sql = "select * from employees where emp_id=? and email_id=? and password=?";
    let values = [emp_id, email, password];
    mysqlConnection.query(sql, values, (error, results) => {
        if (error) throw error;
        else {
            if (results.length > 0) {
                if ((results[0].manager_id) !== null) {
                    res.redirect("/leave_req");
                }
                else {
                    res.redirect("/managerHome");
                }
            }
            else {
                console.log("Login Unsuccesful")
                res.send({
                    success: false,
                    message: "Login Unsuccessful"

                });

            }
        }
    })
}
)



// functions to check the employees status or leave balance

function isSameYear(startDate) {  // to check if the year is same or different

    if (startDate.getFullYear() === date.getFullYear()) {

        // alert("Please enter your details again");
        return true;
    }
    return false;

}


function isSameMonth(startDate) {  // to check if the month is same or different

    if (startDate.getMonth() === date.getMonth()) {
        // alert("Please enter your details again");
        return true;
    }
    return false;
}
function checkLeaveEligibility(days, totalMonthlyLeaveTaken, totalYearlyLeaveDays) {
    if (totalYearlyLeaveDays > 30) {
        // alert("You are not eligible to take leaves this year anymore, take "+30-totalYearLyLeaveDays);
        return false;
    }
    else if (totalMonthlyLeaveTaken > 6) {
        // alert("You are not eligible to take leave this month anymore,take " 6-totalmonthlyLeaveTaken);
        console.log("In checkEligibility,totalMonthlyLeaveTaken is "+totalMonthlyLeaveTaken);
        return false;
    }
    else {
        return true;
    }

}


//employee leave request
app.post("/leave_req", async function (req, res) {
    let empId = req.session.Id;
    let name = req.session.Name;

    let type = req.body.type;
    let reason = req.body.reason;

    let startDate = new Date(2023 - 01 - 01);
    let days = req.body.days;
    let results=[], totalMonthlyLeaveTaken=0, totalYearlyLeaveDays=0;

    let pass = false;  // this will ensure whether employee has taken leave in the past or not

    let sql = "select * from leave_req where emp_id=?";
    console.log(sql);
    try {
        results = await queryAsync(sql, [empId]);
        
        if (results.length > 0) {         
            console.log("entered in results");
            pass = true;                                // if true means leave taken in past
            totalMonthlyLeaveTaken = Number(results[0].totalMonthlyLeave) + Number(days);  // if employee has taken leave earlier (and bounded (<6 days))
            // console.log("results[0].totalMonthlyLeave is "+results[0].totalMonthlyLeave);   
            // console.log("totalMonthlyLeaveTaken is "+totalMonthlyLeaveTaken);
            totalYearlyLeaveDays = Number(results[0].totalLeaveTaken) + Number(days);
            // console.log("totalYearlyLeaveDays is "+totalYearlyLeaveDays);
        }
        else {
            // console.log("Not entered")
            totalMonthlyLeaveTaken = days;
            // console.log("totalMonthlyLeaveTaken is "+totalMonthlyLeaveTaken);
            totalYearlyLeaveDays = days;
        }
        
    }
    catch (error) {
        throw error;
    }


    //check if employee is taking leave in same month or not
    if (!(isSameMonth(startDate))) {
        totalMonthlyLeaveTaken = days;
        console.log("totalMonthlyLeaveTaken is "+totalMonthlyLeaveTaken);
    }
    if (!(isSameYear(startDate))) {
        console.log("startDate is"+startDate);
        totalYearlyLeaveDays = days;
        console.log("totalYearlyLeaveDays is "+totalYearlyLeaveDays);
    }
    if (!checkLeaveEligibility(days, totalMonthlyLeaveTaken, totalYearlyLeaveDays)) {
        res.send({
            success: false,
            message: "You are not eligible to take leave at this time"
        });
        return;
    }

    let sql2, values2;
    
    if (pass) {
        sql2 = "update leave_req set noOfDays=?,totalMonthlyLeave=?, totalLeaveTaken=?,status=?,type=?,reason=? where emp_id=?";
        values2 = [days, totalMonthlyLeaveTaken, totalYearlyLeaveDays, "pending", type, reason, empId];
        console.log("Leave has taken in past")

    }
    else {
        sql2 = "insert into leave_req (emp_id, name, noOfDays, totalMonthlyLeave, totalLeaveTaken, status,type,reason) VALUES(?, ?, ?, ?, ?, ?, ?,?)";
        values2 = [empId, name, days, totalMonthlyLeaveTaken, totalYearlyLeaveDays, "pending", type, reason, empId];
        console.log("Leave first time");
    }

    mysqlConnection.query(sql2, values2, (error, results) => {
        if (error) throw error;
        console.log("work done");
    });

    res.send({
        success: true,
        message: "Leave request submitted successfully"
    });
    

});

// this is manager home page
app.post("/managerHome",(req,res)=>{
    res.redirect("/manager");
})


// if manager approves
app.post("/manager/approve",(req,res)=>{
    let empId=req.body.empId;
    let sql="update leave_req set status='Approved' where emp_id=?";
    mysqlConnection.query(sql,[empId],(error,results)=>{
        if(error)throw error;
        else
        res.redirect("/manager");
    })
})
//if manager rejects
app.post("/manager/reject",(req,res)=>{
    let empId=req.body.empId;
    let sql="update leave_req set status='Rejected' where emp_id=?";
    mysqlConnection.query(sql,[empId],(error,results)=>{
        if(error)throw error;
        else
        res.redirect("/manager");
    })
})


app.post("/leave_req/portal", (req, res) => {
    res.send("Thank you for posting");
})




app.listen(3800, function () {
    console.log("Welcome to your own server Prateek..😀");
});

//Thank you!


