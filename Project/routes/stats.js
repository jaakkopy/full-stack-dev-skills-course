const Router = require('express').Router;
const helpers = require('./helpers.js');
const passport = require('passport');
const ShoppingList = require('../models/listOperations.js');

const router = Router();

router.get('/:groupid', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const stats = await ShoppingList.getStatsForGroup(req.user, req.params.groupid);
        res.status(200).json(helpers.successResponse(stats));
    } catch (err) {
        helpers.handleError(err);
    }
});

module.exports = router;