const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const middleware = require('./middleware');
const memberRouter = require('./routers/members.js');

const app = express();

// add handlebars as the template engine
app.engine('handlebars', engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// add middleware for parsing POST request JSON body
app.use(express.json());
/* 
add middleware for parsing data encoded in the url
From the documentation (https://github.com/expressjs/body-parser#bodyparserurlencodedoptions): 
"The "extended" syntax allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded"
*/
app.use(express.urlencoded({extended: false}));
app.use(middleware.logger);
app.use('/api/members', memberRouter);

// set public as a static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render('index');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));