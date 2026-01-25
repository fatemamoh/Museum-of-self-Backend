const express = require('express');
const router = express.Router();
const Reflection = require('../models/reflection');
const Memory = require('../models/memory');
const User = require('../models/user');
const verifyVault = require('../middleware/verify-vault');

// create reflection
router.post('/:memoryId', async (req, res) => {
    try {
        const memory = await Memory.findById(req.params.memoryId);
        if (!memory || !memory.user.equals(req.user._id)) {
            return res.status(403).json({ err: "Cannot reflect on an inaccessible artifact." });
        }

        if (memory.isVaulted) {
            const user  = await User.findById(req.user._id);
            const isMatch = await user.comparePin(req.headers['x-master-pin']);
            if (!isMatch) return res.status(401).json({ err: "Vault access denied." });
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
        const memory = await Memory.findById(req.params.memoryId);
        if (memory.isVaulted) {
            const user = await User.findById(req.user._id);
            const isMatch = await user.comparePin(req.headers['x-master-pin']);
            if (!isMatch) return res.status(401).json({ err: "Vault locked." });
        }

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

// update one reflection
router.put('/:id', async (req, res) => {
    try {
        const reflection = await Reflection.findById(req.params.id);
        if (!reflection || !reflection.user.equals(req.user._id)) {
            return res.status(403).json({ err: "Unauthorized renovation of this thought." });
        }

        const updatedReflection = await Reflection.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json(updatedReflection);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

// delete reflection
router.delete('/:id', async (req, res) => {
    try {
        const reflection = await Reflection.findById(req.params.id);
        if (!reflection || !reflection.user.equals(req.user._id)) {
            return res.status(403).json({ err: "Unauthorized removal." });
        }

        await Reflection.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Perspective removed from the archive." });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

module.exports = router;
