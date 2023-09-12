const Router = require('express').Router;
const helpers = require('./helpers.js');
const ShoppingList = require('../models/shoppingList.js');
const passport = require('passport');
const ValidationError = require('../errors/validationError');

const router = Router();

router.post('/create', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        await ShoppingList.createList(req.body, req.user);
        res.status(200).json(helpers.successMsg("New list created"));
    } catch (err) {
        let status;
        let msg;
        if (err instanceof ValidationError) {
            status = 403;
            msg = err.message;
        } else {
            console.error(err.message);
            status = 500;
            msg = "Internal server error";
        }
        res.status(status).json(helpers.failureMsg(msg));
    }
});

module.exports = router;