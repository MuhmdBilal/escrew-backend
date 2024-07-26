const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
require("./db/db")
require('dotenv').config()
const app = express();
const PORT = 8000;

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// Routes
app.use('/api/auth', authRoutes);
// const options = {
//   key: fs.readFileSync('./server.key'),
//   cert: fs.readFileSync('./server.crt')
// };

// https.createServer(options, app).listen(PORT, () => {
//   console.log('HTTPS server running on port PORT');
// });
app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT}`);
  });