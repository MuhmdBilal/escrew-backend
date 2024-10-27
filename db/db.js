const mongoose = require('mongoose');
require('dotenv').config()
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URL, {   
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})
.then(()=> console.log(`DB connected`))
.catch((err)=> console.log(err));