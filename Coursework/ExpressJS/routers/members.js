const Router = require('express').Router;
const dummydata = require('./Dummydata.js');

const router = Router();

router.get('/', (req, res) => res.json(dummydata));

router.get('/:id', (req, res) => {
    const content = dummydata.filter(user => user.id === Number(req.params.id));
    if (content.length == 0)
        res.status(404).json({msg: `No user with id ${req.params.id} found`});
    res.json(content[0]);
});

module.exports = router;