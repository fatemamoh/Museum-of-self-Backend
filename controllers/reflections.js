const express = require('express');
const router = express.Router();
const Reflection = require('../models/reflection');
const Memory = require('../models/memory');

// create reflection
router.post('/:memoryId', async (req, res) => {
    try {
        const memory = await Memory.findById(req.params.memoryId);
        if (!memory || !memory.user.equals(req.user._id)) {
            return res.status(403).json({ err: "Cannot reflect on an inaccessible artifact." });
        }

        req.body.user = req.user._id;
        req.body.memory = req.params.memoryId;

        const reflection = await Reflection.create(req.body);
        res.status(201).json(reflection);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

// get all reflections for Specific Memory
router.get('/memory/:memoryId', async (req, res) => {
    try {
        const reflections = await Reflection.find({
            memory: req.params.memoryId,
            user: req.user._id
        }).sort({ createdAt: -1 });
        res.status(200).json(reflections);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

// get one reflection
router.get('/:id', async (req, res) => {
    try {
        const reflection = await Reflection.findById(req.params.id);
        if (!reflection || !reflection.user.equals(req.user._id)) {
            return res.status(404).json({ err: "Perspective not found." });
        }
        res.status(200).json(reflection);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});