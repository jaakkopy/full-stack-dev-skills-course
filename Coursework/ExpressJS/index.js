const express = require('express');
const path = require('path');
const dummydata = require('./Dummydata.js');

const app = express();
// set public as a static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/members', (req, res) => res.json(dummydata));

app.get("/", (req, res) => {
    res.send("Hello World");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));