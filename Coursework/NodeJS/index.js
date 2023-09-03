const http = require('http');
const path = require('path');
const fs = require('fs');

// check for the port. If the environment variable is not found, use 8080
const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        res.end('<h1>Index</h1>');
    }
});

server.listen(PORT, () => console.log(`server running on ${PORT}`));