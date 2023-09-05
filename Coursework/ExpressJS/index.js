const express = require('express');
const path = require('path');
const middleware = require('./middleware');
const dummydata = require('./Dummydata.js');

const app = express();
// register the middleware
app.use(middleware.logger);

// set public as a static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/members', (req, res) => res.json(dummydata));
app.get('/api/members/:id', (req, res) => {
    const content = dummydata.filter(user => user.id === Number(req.params.id));
    if (content.length == 0)
        res.status(404).json({msg: `No user with id ${req.params.id} found`});
    res.json(content[0]);
});

app.get("/", (req, res) => {
    res.send("Hello World");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));