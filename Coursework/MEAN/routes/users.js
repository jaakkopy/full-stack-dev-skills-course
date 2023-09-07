const Router = require('express').Router;

const router = Router();

router.get('/register', (req, res) => {
    res.send('register');
});

module.exports = router;