const express=require("express");
const router=express.Router();
const app=express();
module.exports=router;

// app.post("/",function(req,res){
//     let id=req.body.id;
//     let name=req.body.Name;
//     let email=req.body.Email;
//     let sql="INSERT INTO employees VALUES(?,?,?,?)"
//     let values=[id,name,email,103];
//     mysqlConnection.query(sql,values, function(error,result){
//         if(error)throw error;
//         else{
//             res.send(result);
//         }
//     })
// })

// app.get("/mgrLogin",function(req,res){
//     res.sendFile(__dirname+"/manager.html");
// })
//get router

//request for home page
app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
})
//http request for leave_req page
app.get("/leave_req",(req,res)=>{
    res.sendFile(__dirname+"/leave_req.html")
})
//http req for login-portal page
app.get("/leave_req/portal",function(req,res){
   res.sendFile(__dirname+"/login-portal.html");
})
// app.get("/manager",(req,res)=>{
//     mysqlConnection,connect((error)=>{
//         if(error)throw error;
//         else{
//             let emp_id=req.session.Id;
//             let name=req.session.Name;
//             let sql="select * from employees join leave_req where employees.emp_id=leave_req.emp_id and leave_req.emp_id";
//         }
//     })
//     res.sendFile(__dirname+"/manager.html");
// })
//post method
app.get("/manager",(req,res)=>{
        
            let sql="select * from leave_req "
            mysqlConnection.query(sql,function(error,results){
                if(error)throw error;
                else{
                    console.log(results);
                    res.render("manager",{ans : results});
                }
            })
            
        
    
    
})

app.post("/",function(req,res){
    mysqlConnection.connect(function(error){
    if(error)throw error;
    else{
    let emp_id=req.body.Id;
    req.session.Id=emp_id;
    req.session.Name=req.body.Name;
    let email=req.body.Email;
    let password=req.body.Password;
    let sql="select * from employees where emp_id=? and email_id=? and password=?";
    let values=[emp_id,email,password];
    mysqlConnection.query(sql,values,function(error,results){
        if(error)throw error;
        else{
            if(results.length>0)
            {
                if((results[0].manager_id)!==null)
                {
                    res.redirect("/leave_req");
                }
                else{
                    res.redirect("/manager");
                }
                console.log("Login Successful");
            }
            else{
                console.log("Login Unsuccesful")
                res.send({
                    success:false,
                    message:"Login Unsuccessful"
                    
                });

            }
        }
    });
}
})
                
});

app.post("/leave_req",function(req,res){
    let emp_id=req.session.Id;
    let email=req.session.Email;
    let name=req.session.Name;
    let days=req.body.days;
    let type=req.body.type;
    let reason=req.body.reason;
    let sql="INSERT INTO leave_req(emp_id,name,noOfDays,type,status,reason) VALUES(?,?,?,?,?,?)";
    let values=[emp_id,name,days,type,"pending",reason];
    mysqlConnection.query(sql,values,function(error,results){
        if(error)throw error;
        else
        {
            // let ans="select manager_id from employees where employees.emp_id=results[0].emp_id"
            // res.render("manager",{requests : results});
            res.redirect("/leave_req/portal");
        }
    })
})
// app.post("/manager",(req,res)=>{
    
// })

app.post("/leave_req/portal",(req,res)=>{
    res.send("Thank you for posting");
})

