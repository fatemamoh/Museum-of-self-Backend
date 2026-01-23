const express = require('express');
const router = express.Router();
const LifePhase = require('../models/lifePhase');

router.post('/', async (req, res) => {
    try {
        req.body.user = req.user._id;
        const lifePhase = await LifePhase.create(req.body);
        res.status(201).json(lifePhase);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const lifePhases = await LifePhase.find({ user: req.user._id })
            .sort({ startDate: -1 });
        res.status(200).json(lifePhases);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const lifePhase = await LifePhase.findById(req.params.id);

        if (!lifePhase) return res.status(404).json({ err: 'Room not found.' });
        if (!lifePhase.user.equals(req.user._id)) {
            return res.status(403).json({ err: "Unauthorized renovation request." });
        }
        const updatedLifePhase = await LifePhase.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json(updatedLifePhase);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const lifePhase = await LifePhase.findById(req.params.id);

        if (!lifePhase) return res.status(404).json({ err: 'Room not found.' });
        if (!lifePhase.user.equals(req.user._id)) {
            return res.status(403).json({ err: "Unauthorized renovation request." });
        }

        await LifePhase.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Exhibit removed from the museum." });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

module.exports = router;