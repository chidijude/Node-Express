const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const Student = mongoose.model('Student');

router.get("/", (req, res) =>{
    res.render("student/addOrEdit", {
        viewTitle: "Insert Student"
    })
});

//Add/update Student
router.post("/", (req, res) =>{ 
    
    if (req.body._id == ''){
        InserRecord(req, res)
    }
    else{
        UpdateRecord(req,res)
    }   
});

function InserRecord(req, res){
    var student = new Student()
    student.fullname = req.body.fullname;
    student.email = req.body.email;
    student.mobile = req.body.mobile;
    student.city = req.body.city;
    student.save((err, doc) =>{
        if (!err){
            res.redirect('student/list');
        }else{
            console.log('Error during insert:' + err)
        }
    })
}

function UpdateRecord(req,res){
    Student.findByIdAndUpdate(
        {_id: req.body._id}, 
        req.body, 
        {new: true}, 
        (err, doc) =>{
            if (!err){
                res.redirect('student/list');
            }else{
                console.log('Error during Update:' + err)
            }
    } )
}

router.get('/list', (req, res)=>{
    Student.find((err, docs)=>{
        if(!err){
            res.render('student/list', {
                list: docs
            })
        }
        else{
            console.log('Error retrieving students' + err)
        }
    })    
})

router.get('/:id', (req, res)=>{
    Student.findById(req.params.id, (err, doc)=>{
        if(!err){
            res.render('student/addOrEdit', {
                viewTitle: 'Update Student',
                student: doc
            })
            console.log(doc);
        }
        else{
            console.log('Error retrieving student:' + err)
        }
    })
})

router.get('/delete/:id', (req, res)=>{
    Student.findByIdAndRemove(req.params.id, (err, doc)=>{
        if(!err){
            res.render('student/list')
        }
        else{
            console.log('Error in deletion:' + err)
        }
    })
})

module.exports = router;