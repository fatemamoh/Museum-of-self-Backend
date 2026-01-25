const express = require('express');
const router = express.Router();
const Memory = require('../models/memory');
const Reflection = require('../models/reflection');
const User = require('../models/user');
const verifyVault = require('../middleware/verify-vault');
const { cloudinary, upload } = require('../config/cloudinary');

// create new memory 
router.post('/', upload.single('file'), async (req, res) => {
    try {
        req.body.user = req.user._id;
        if (req.file) {
            req.body.contentUrl = req.file.path;
            req.body.cloudinaryPublicId = req.file.filename;
        }
        const memory = await Memory.create(req.body);
        res.status(201).json(memory);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

// memories in a specific phase
router.get('/phase/:phaseId', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const providedPin = req.headers['x-master-pin'];

        // FIX: Check if providedPin exists before trying to compare it.
        // If no pin is provided, isPinCorrect is simply false.
        const isPinCorrect = providedPin ? await user.comparePin(providedPin) : false;

        const memories = await Memory.find({
            phase: req.params.phaseId,
            user: req.user._id
        }).sort({ capturedDate: 1 });

        const curatedMemories = memories.map(memory => {
            const isLocked = memory.unlockDate && new Date() < new Date(memory.unlockDate);
            const isVaulted = memory.isVaulted && !isPinCorrect;

            if (isLocked || isVaulted) {
                return {
                    ...memory._doc,
                    contentUrl: null, // Hide sensitive data
                    story: isVaulted ? "Vaulted" : "Locked in a Time Capsule",
                    isLocked: true,
                    needsPin: isVaulted
                };
            }
            return memory;
        });
        res.status(200).json(curatedMemories);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

// get one memory
router.get('/:id', async (req, res) => {
    try {
        const memory = await Memory.findById(req.params.id);
        if (!memory || !memory.user.equals(req.user._id)) {
            return res.status(404).json({ err: 'Artifact not found.' });
        }
        if (memory.isVaulted) {
            const user = await User.findById(req.user._id);
            const isMatch = await user.comparePin(req.headers['x-master-pin']);
            if (!isMatch) return res.status(401).json({ err: "Vault locked." });
        }

        if (memory.unlockDate && new Date() < new Date(memory.unlockDate)) {
            return res.status(200).json({
                ...memory._doc,
                contentUrl: null,
                story: "Locked in a Time Capsule",
                isLocked: true
            });
        }
        res.status(200).json(memory);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

// update memory
router.put('/:id', upload.single('file'), async (req, res) => {
    try {
        const memory = await Memory.findById(req.params.id);
        if (!memory || !memory.user.equals(req.user._id)) {
            return res.status(403).json({ err: "Unauthorized renovation." });
        }
        if (req.file) {
            if (memory.cloudinaryPublicId) {
                await cloudinary.uploader.destroy(memory.cloudinaryPublicId);
            }
            req.body.contentUrl = req.file.path;
            req.body.cloudinaryPublicId = req.file.filename;
        }

        const updatedMemory = await Memory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json(updatedMemory);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

// delete memory
router.delete('/:id', verifyVault, async (req, res) => {
    try {
        const memory = await Memory.findById(req.params.id);
        if (!memory || !memory.user.equals(req.user._id)) {
            return res.status(403).json({ err: "Unauthorized removal." });
        }
        await Reflection.deleteMany({ memory: req.params.id });
        if (memory.cloudinaryPublicId) {
            await cloudinary.uploader.destroy(memory.cloudinaryPublicId);
        }

        await Memory.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Artifact removed from the collection." });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

module.exports = router;