const mongoose = require('mongoose');
// const dotenv = require("dotenv");
require('dotenv').config()
// dotenv.config({ path: "./config/config.env" });
// let url = ""mongodb://127.0.0.1:27017/AvicennaDappm""
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URL, {   
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})
.then(()=> console.log(`DB connected`))
.catch((err)=> console.log(err));