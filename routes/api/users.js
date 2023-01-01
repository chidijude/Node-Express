const express = require('express');
const router = express.Router();
const uuid = require('uuid');
let users = require('../../Users')

//get all users
router.get("/", (req, res) =>{
    res.json(users)
});

//get users by id
router.get("/:id", (req, res) =>{
    const found = users.some(user => user.id === parseInt(req.params.id))

    if (found){
        res.json(users.filter(user => user.id === parseInt(req.params.id)));
    }
    else{
        res.sendStatus(400);
    }
});

//create new user
router.post("/", (req, res) =>{
    const newUser = {
        id : uuid.v4(),
        name : req.body.name,
        email : req.body.email
    }
    if (!newUser.email || !newUser.name){
        res.sendStatus(400);
    }
    users.push(newUser);
    res.json(newUser);
});

//update user
router.put("/:id", (req, res) => {
    const found = users.some(user => user.id === parseInt(req.params.id))

    if (found){
        updatedUser = req.body;
        var user = users.find(u => u.id === parseInt(req.params.id));
        user.name = updatedUser.name? updatedUser.name : user.name;
        user.email = updatedUser.email? updatedUser.email : user.email;
        res.json({msg: "updated user", user})
    }
})

//delete user
router.delete("/:id", (req, res) => {
    const found = users.some(user => user.id === parseInt(req.params.id))

    if (found){
        user = users.find(u => u.id === parseInt(req.params.id));
        users = users.filter(u => u.id !== parseInt(req.params.id));       
        res.json({msg: "deleted user", user})
    }
    else{
        res.status(400).send("user not found")
    }
})
module.exports = router;