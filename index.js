const { query } = require('express');
require("./models/db")
var studentController = require('./models/controllers/studentController')
const express = require('express');
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const app = express();
const path = require('path');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser');

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//MongoDB
app.get("/", (req, res) => {
    res.send(` 
    <h2> Welcome to Student Database </h2> 
    <h3>Click here to get access to the <b><a href="/student/list">Database</a></b></h3>`);
})

app.set("views", path.join(__dirname, "/views/"));

app.engine(
    'hbs', 
    exphbs.engine({
        handlebars: allowInsecurePrototypeAccess(handlebars),
        extname: "hbs",
        defaultLayout: "MainLayout",
        layoutsDir: __dirname + "/views/layouts/",
    })
);
app.use('/student', studentController);

// Require static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');

//create connection
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: '',
//     database: 'nodesql'
// })

// //connect to mysql
// db.connect((err) =>{
//     if(err){
//         throw err
//     }
//     console.log("mySQL connected...")
// })

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
