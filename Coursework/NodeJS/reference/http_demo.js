const http = require('http');

const PORT = 8080;

// Create a server object. Takes in a callback with the request and response objects.
http.createServer((req, res) => {
    res.write('A response message');
    res.end();
}).listen(PORT, () => console.log(`Server running on ${PORT}`));