const express = require('express');
const router = express.Router();
const Memory = require('../models/memory');
const Reflection = require('../models/reflection');
const { cloudinary, upload } = require('../config/cloudinary');

// Create a new Artifact
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const memoryData = { 
            ...req.body,
            user: req.user._id 
        };

        if (req.file) {
            memoryData.contentUrl = req.file.path || req.file.secure_url || req.file.url;
            memoryData.cloudinaryPublicId = req.file.filename || req.file.public_id;
        }

        if (memoryData.type !== 'Text' && !memoryData.contentUrl) {
            return res.status(400).json({ err: "Media artifacts require a file upload." });
        }

        const memory = await Memory.create(memoryData);
        res.status(201).json(memory);
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
});

// Get all Artifacts for a specific life phase
router.get('/phase/:phaseId', async (req, res) => {
    try {
        const memories = await Memory.find({
            phase: req.params.phaseId,
            user: req.user._id
        }).sort({ capturedDate: 1 });

        res.status(200).json(memories);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

// Get a single Artifact
router.get('/:id', async (req, res) => {
    try {
        const memory = await Memory.findById(req.params.id);
        if (!memory || !memory.user.equals(req.user._id)) {
            return res.status(404).json({ err: 'Artifact not found.' });
        }
        res.status(200).json(memory);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

// Update an Artifact (and replace image if new one provided)
router.put('/:id', upload.single('file'), async (req, res) => {
    try {
        const memory = await Memory.findById(req.params.id);
        if (!memory || !memory.user.equals(req.user._id)) {
            return res.status(403).json({ err: "Unauthorized renovation." });
        }

        const updateData = { ...req.body };

        if (req.file) {
            if (memory.cloudinaryPublicId) {
                await cloudinary.uploader.destroy(memory.cloudinaryPublicId);
            }
            updateData.contentUrl = req.file.path || req.file.secure_url || req.file.url;
            updateData.cloudinaryPublicId = req.file.filename || req.file.public_id;
        }

        const updatedMemory = await Memory.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        res.status(200).json(updatedMemory);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

// Remove an Artifact and its associated reflections
router.delete('/:id', async (req, res) => {
    try {
        const memory = await Memory.findById(req.params.id);
        if (!memory || !memory.user.equals(req.user._id)) {
            return res.status(403).json({ err: "Unauthorized removal." });
        }

        // Clean up linked reflections and Cloudinary assets
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