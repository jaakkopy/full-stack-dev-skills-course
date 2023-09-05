const Router = require('express').Router;
const uuid = require('uuid');
let dummydata = require('./Dummydata.js');

const router = Router();

const findUser = (id, res) => {
    const content = dummydata.filter(user => user.id === id);
    if (content.length == 0)
        res.status(404).json({msg: `No user with id ${id} found`});
    else
        return content[0]
    return null;
}

router.get('/', (req, res) => res.json(dummydata));

router.get('/:id', (req, res) => {
    const existingUser = findUser(req.params.id, res);
    if (existingUser != null)
        res.json(existingUser);
});

router.post('/', (req, res) => {
    console.log(req.body);
    const user = {
        id: uuid.v4(),
        name: req.body.name,
        age: req.body.age,
        status: 'active'
    };
    if (!user.name || !user.age)
        res.status(400).json({msg: 'Please add the name and age'});
    else {
        dummydata.push(user);
        res.json(user);
    }
});

router.put('/:id', (req, res) => {
    let existingUser = findUser(req.params.id, res);
    if (existingUser != null) {
        const updateInfo = req.body;
        if (updateInfo.name)
            existingUser.name = updateInfo.name;
        if (updateInfo.age)
            existingUser.age = updateInfo.age;
        res.json(existingUser);   
    }
});

router.delete('/:id', (req, res) => {
    dummydata = dummydata.filter(user => user.id !== req.params.id);
    res.json(dummydata);
});

module.exports = router;