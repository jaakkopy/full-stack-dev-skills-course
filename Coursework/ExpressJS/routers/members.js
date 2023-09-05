const Router = require('express').Router;
const uuid = require('uuid');
let dummydata = require('./Dummydata.js');

const router = Router();

router.get('/', (req, res) => res.json(dummydata));

router.get('/:id', (req, res) => {
    const content = dummydata.filter(user => user.id === req.params.id);
    if (content.length == 0)
        res.status(404).json({msg: `No user with id ${req.params.id} found`});
    res.json(content[0]);
});

router.post('/', (req, res) => {
    const user = {
        id: uuid.v4(),
        name: req.body.name,
        age: req.body.age,
        status: 'active'
    };
    if (!user.name || !user.age)
        res.status(400).json({msg: 'Please add the name and age'});

    dummydata.push(user);
    res.json(user);
});

module.exports = router;