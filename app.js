const express = require('express');
const bcrypt = require('bcrypt-nodejs');

const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(function (req,res,next){
    res.set('Cache-Control','no-cache,private,must-revalidate,no-store');
    next();
})
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized:true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
require('dotenv').config();
var con=require("./connection");
app.set('view engine','ejs');
app.use(express.static("public"));



app.get("/",function (req,res){
    res.render("login.ejs");
 });
 
 app.get("/login",function (req,res){
     res.render("login.ejs");
 });
 
 app.post("/login",function (req,res){
     var email= req.body.email;
     var password= req.body.password;
 
     if(email && password){
         var sql="SELECT * FROM user WHERE email=? AND password=?;";
         con.query(sql,[email,password],function (error,results,fields){
             if(results.length>0){
                 req.session.loggedin=true;
                 req.session.email=email;
                 req.session.role=results[0].role;
                 //res.redirect("/book_list");
 
             }
             else{
                 res.send("<h1>Incorrect email or password</h1>");
 
             }
         });
     }
     else{
         res.send("<h1>Please enter email or password</h1>");
     }
 });
 
 const requireRole=(role)=>{
     return (req, res, next) => {
         if (req.session.loggedin && req.session.role === role) {
             next();
         } else {
             res.send('Forbidden');
         }
     };
 };


app.get("/registration",function (req,res){
    res.render("registration.ejs");
});
 
app.post("/registration",function(req,res){
    var role=req.body.role;
    if(req.body.role == "Student"){
        app.get("/studentReg",function (req,res){
            res.redirect("/studentReg");
        });
    }
});

app.get("/studentReg",function (req,res){
    res.render("studentReg.ejs");
});

app.post("/studentReg", function(req,res){
    var name=req.body.name;
    var email=req.body.email;
    var phone=req.body.phone;
    var password=req.body.password;
    var cpassword =req.body.cpassword;
    var roll =req.body.roll;
    var registration = req.body.registration;
    var session = req.body.session;

    if(password==cpassword){

        var sql="INSERT INTO user (name,email,phone,password,role) values('"+name+"','"+email+"','"+phone+"','"+password+"','"+role+"');";
        var sql2="INSERT INTO student(roll,registration, session) values('"+roll+"','"+registration+"','"+session+"');";
        con.query(sql,sql2,function (error,result) {
            if (error) throw error;
    
            res.redirect("/login");
        });
    }
    else{
        res.send("<h1>Please confirm your password </h1>")
    }

});

 

//  var email=req.body.email;
//  var phone=req.body.phone;
//  var password=req.body.password;
//  var cpassword =req.body.cpassword;
//  var role=req.body.role;
 
//  if(password==cpassword){
 
//      var sql="INSERT INTO user (name,email,phone,password,role) values('"+name+"','"+email+"','"+phone+"','"+password+"','"+role+"');";
//      con.query(sql,function (error,result) {
//          if (error) throw error;
 
//          res.redirect("/login");
//      });
//  }
 
//  else{
//      res.send("<h1>Please confirm your password </h1>")
//  }
 
 


 app.get("/logout",function (req,res){
    req.session.destroy((error)=>{
        res.redirect("/login");
    });
});

 var server=app.listen(5000,function (){

    console.log("Server Running");
});