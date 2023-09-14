const Router = require('express').Router;
const helpers = require('./helpers.js');
const ShoppingList = require('../models/shoppingList.js');
const passport = require('passport');

const router = Router();


router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const newListId = await ShoppingList.createList(req.body, req.user);
        res.status(200).json(helpers.successResponse(newListId));
    } catch (err) {
        helpers.handleError(err, res);
    }
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await ShoppingList.deleteList(req.user, req.params.id);
        res.status(200).json(helpers.successResponse("List deleted"));
    } catch (err) {
        helpers.handleError(err, res);
    }
});

router.get('/groups/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const lists = await ShoppingList.getGroupsLists(req.user, req.params.id);
        res.status(200).json(helpers.successResponse(lists));
    } catch (err) {
        helpers.handleError(err, res);
    }
});

router.get('/:listid', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const list = await ShoppingList.getListById(req.user, req.params.listid);
        res.status(200).json(helpers.successResponse(list));
    } catch (err) {
        helpers.handleError(err, res);
    }
});

router.post('/:listid', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const newItemId = await ShoppingList.addToList(req.user, req.params.listid, req.body);
        res.status(200).json(helpers.successResponse(newItemId));
    } catch (err) {
        handleError(err, res);
    }
});

router.delete('/:listid/:itemid', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await ShoppingList.deleteItemFromList(req.user, req.params.listid, req.params.itemid);
        res.status(200).json(helpers.successResponse("Item deleted"));
    } catch (err) {
        helpers.handleError(err, res);
    }
});

router.put('/:listid/:itemid', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await ShoppingList.updateListItem(req.user, req.params.listid, req.params.itemid, req.body);
        res.status(200).json(helpers.successResponse("Item updated"));
    } catch (err) {
        helpers.handleError(err, res);
    }
});

module.exports = router;