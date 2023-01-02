const mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: "Fullname is required"
    },
    email:{
        type: String,
        required: "Email is required"
    },
    mobile:{
        type: Number,
        required: "Mobile is required"
    },
    city:{
        type: String,
        required: "City is required"
    }
})

mongoose.model('Student', studentSchema);