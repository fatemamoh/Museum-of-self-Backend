const express = require('express');
const router = express.Router();
const LifePhase = require('../models/lifePhase');

router.post('/', async (req,res) =>{
try {
    req.body.user = req.user._id;
    const lifePhase = await LifePhase.create(req.body);
    res.status(201).json(lifePhase);
} catch (error) {
    res.status(500).json({err: error.message});
}
});

router.get('/', async (req,res) =>{
try {
    const lifePhases = (await LifePhase.find({user: req.user._id}))
    .sort({startDate: -1});
    res.status(201).json(lifePhases);
} catch (error) {
    res.status(500).json({err: error.message});
}
});

