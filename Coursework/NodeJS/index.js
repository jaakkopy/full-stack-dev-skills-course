const http = require('http');
const path = require('path');
const fs = require('fs');

// check for the port. If the environment variable is not found, use 8080
const PORT = process.env.PORT || 8080;
const PUBLIC = 'public';

const notFound = (res) => {
    fs.readFile(path.join(__dirname, PUBLIC, '404.html'), (err, content) => {
        res.writeHead(400, { 'Content-Type': 'html' });
        res.end(content, 'utf-8');
    });
}

const internalError = (res, err) => {
    res.writeHead(500);
    res.end(`Internal server error: ${err.code}`);
}

const handleErr = (res, err) => {
    if (err.code == 'ENOENT') {
        notFound(res);
    } else {
        internalError(res, err);
    }
}

const returnContent = (res, contentType, content) => {
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
}

const getContentType = (filePath) => {
    const extension = path.extname(filePath);
    // default content type
    let contentType = 'text/html';
    switch (extension) {
        case ".js":
            contentType = "text/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".json":
            contentType = "application/json";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".jpg":
            contentType = "image/jpg";
            break;
    }
    return contentType;
}

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, PUBLIC, req.url == '/' ? 'index.html' : req.url);
    const contentType = getContentType(filePath);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            handleErr(res, err);
        } else {
            returnContent(res, contentType, content);
        }
    });
});

server.listen(PORT, () => console.log(`server running on ${PORT}`));