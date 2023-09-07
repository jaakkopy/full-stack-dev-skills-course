const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport-jwt');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', require('./routes/users'));

app.get('/', (req, res) => {
    res.send("Hello");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});