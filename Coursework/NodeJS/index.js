const http = require('http');
const path = require('path');
const fs = require('fs');

// check for the port. If the environment variable is not found, use 8080
const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    /*
    if (req.url == '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) {
                res.writeHead(500); 
                res.end();
            }
            res.writeHead(200, {'Content-Type': 'text/html'}); // write to the HTTP headers 
            res.end(content);
        });
    }
    else if (req.url == '/api/users') {
        res.writeHead(200, {'Content-Type': 'application/json'}); // write to the HTTP headers 
        res.end(JSON.stringify([{'Name': 'Bob'}, {'Name': 'Jane'}]));
    }
    */
});

server.listen(PORT, () => console.log(`server running on ${PORT}`));