require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dbConfig = require('./config/database');

mongoose.connect(dbConfig.database);

mongoose.connection.on('connected', () => {
    console.log(`Connected to database ${dbConfig.database}`);
});

mongoose.connection.on('error', (err) => {
    console.log(`Database error: ${err}`);
});

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});