// logger middleware
const logger = (req, res, next) => {
    console.log(`Got a ${req.method} request to ${req.url}`);
    next();
}

const middleware = {
    logger
}

module.exports = middleware;