const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport-jwt');
const mongoose = require('mongoose');
const config = require('./config/database');

mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
    console.log(`Connected to database ${config.database}`);
});

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', require('./routes/users'));

// static folder for the Angular build
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send("Hello");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});