const { query } = require('express');
const express = require('express');
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : false}));

//create connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: 'nodesql'
})

//connect to mysql
db.connect((err) =>{
    if(err){
        throw err
    }
    console.log("mySQL connected...")
})

//create datebase
app.get("/createdb", (req, res)=>{
    let sql = "CREATE DATABASE nodesql"
    db.query(sql, err =>{
        if (err){
            throw err
        }
        res.send("Database Created.")
    })
})

//create employee table
app.get("/createemployee", (req, res)=>{
    let sql = 'CREATE TABLE Employee(id int auto_increment, name varchar(225), designation varchar(225), PRIMARY KEY(id))';
    db.query(sql, err =>{
        if (err){
            throw err
        }
        res.send("Employee table Created.")
    })
});

//insert employee in table
app.post("/employee", (req, res)=>{
    let employee = {name: req.body.name, designation: req.body.designation}
    let sql = 'INSERT INTO Employee SET?';
    db.query(sql, employee, err =>{
        if (err){
            throw err
        }
        res.send("Employee record added.")
    })
});

//get employees
app.get("/employee", (req, res)=>{
    let sql = 'SELECT * FROM Employee';
    db.query(sql, (err, result) =>{
        if (err){
            throw err
        }
        console.log("gotten employees")
        
        res.json(result)
    })
});

//get employees
app.get("/employee/:id", (req, res)=>{
    let sql = `SELECT * FROM Employee where id = ${req.params.id}`;
    db.query(sql, (err, result) =>{
        if (err){
            throw err
        }
        console.log("gotten employees")
        res.json(result)
    })
});

//update employees
app.put("/employee/:id", (req, res)=>{
    let sql = `update Employee set name = '${req.body.name}', designation = '${req.body.designation}' where id = ${req.params.id}`;
    db.query(sql, (err, result) =>{
        if (err){
            throw err
        }
        console.log("Update successful.")
        res.send("Update Successful")
    })
});

//update employees
app.delete("/employee/:id", (req, res)=>{
    let sql = `delete from Employee  where id = ${req.params.id}`;
    db.query(sql, (err, result) =>{
        if (err){
            throw err
        }
        console.log("Deleted Successfully")
        res.send("Delete Successful")
    })
});

//get all users
app.use('/api/users', require('./routes/api/users'));

app.get("/", (req, res) => {
    res.send("hello there")
})

app.post("/api/posts", verifyToken, (req, res) => {
    jwt.verify(req.token, "secretkey", (err, authData)=> {
        if(err){
            res.sendStatus(403);
        }
        else{
            res.json({
                message: "post created...",
                authData,
            })
        }
    })
})

app.post("/api/login", (req, res) => {
    const user = {
        id : 1,
        username : "John",
        email : "john@hotmail.com"
    }

    jwt.sign({user: user}, "secretkey", (err, token)=>{
        res.json({
            token,
        })
    })
});

function verifyToken(req, res, next){
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    }
    else{
        res.sendStatus(403) //forbiden
    }
}


app.listen(3000, () =>{
    console.log("Server started on port 3000")
});