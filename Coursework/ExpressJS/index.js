const express = require('express');
const path = require('path');
const middleware = require('./middleware');
const memberRouter = require('./routers/members.js');

const app = express();
// register the middleware
app.use(middleware.logger);
app.use('/api/members', memberRouter);

// set public as a static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.send("Hello World");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));