const mongoose = require('mongoose');

mongoose.connect('mongodb://0.0.0.0:27017/StudentDB', {
    useNewUrlParser: true,
}, err => {
    if (!err){
        console.log("Connection Succeeded")
    }
    else{
        console.log(`error in connection` + err )
    }
});

require("./student.model");