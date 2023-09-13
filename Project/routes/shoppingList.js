const Router = require('express').Router;
const helpers = require('./helpers.js');
const ShoppingList = require('../models/shoppingList.js');
const passport = require('passport');
const ValidationError = require('../errors/validationError');

const router = Router();

const handleError = (err, res) => {
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
    res.status(status).json(helpers.failureResponse(msg));
}

router.post('/create', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await ShoppingList.createList(req.body, req.user);
        res.status(200).json(helpers.successResponse("New list created"));
    } catch (err) {
        handleError(err, res);
    }
});

router.get('/listsofgroup/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const lists = await ShoppingList.getGroupsLists(req.user, req.params.id);
        res.status(200).json(helpers.successResponse(lists));
    } catch (err) {
        handleError(err, res);
    }
});

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const list = await ShoppingList.getListById(req.user, req.params.id);
        res.status(200).json(helpers.successResponse(list));
    } catch (err) {
        handleError(err, res);
    }
});

router.post('/add', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await ShoppingList.addToList(req.user, req.body);
        res.status(200).json(helpers.successResponse("New item added"));
    } catch (err) {
        handleError(err, res);
    }
});

router.delete('/:listid/:itemid', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await ShoppingList.deleteItemFromList(req.user, req.params.listid, req.params.itemid);
        res.status(200).json(helpers.successResponse("Item deleted"));
    } catch (err) {
        handleError(err, res);
    }
});

module.exports = router;