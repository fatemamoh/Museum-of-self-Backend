const express = require('express');
const router = express.Router();
const Memory = require('../models/memory');
const Reflection = require('../models/reflection');
const User = require('../models/user');
const { cloudinary, upload } = require('../config/cloudinary');

router.post('/', upload.single('file'), async (req, res) => {
    try {
        console.log("--- DEBUG: POST MEMORY ---");
        console.log("1. req.body (Text fields):", req.body);
        console.log("2. req.file (Cloudinary result):", req.file);

        const memoryData = { ...req.body };
        memoryData.user = req.user._id;

        if (req.file) {
            memoryData.contentUrl = req.file.path;
            memoryData.cloudinaryPublicId = req.file.filename;
            console.log("3. Mapping successful. contentUrl is:", memoryData.contentUrl);
        } else {
            console.warn("3. WARNING: No file received by the controller!");
        }

        if (memoryData.type !== 'Text' && memoryData.type !== 'Link' && !memoryData.contentUrl) {
            console.error("4. ERROR: Validation will fail because contentUrl is missing for media type.");
            return res.status(400).json({ err: "Memory validation failed: contentUrl is required." });
        }

        const memory = await Memory.create(memoryData);
        console.log("5. SUCCESS: Memory created in DB");
        res.status(201).json(memory);
    } catch (error) {
        console.error("X. CATCH ERROR:", error.message);
        res.status(500).json({ err: error.message });
    }
});

router.get('/phase/:phaseId', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const memories = await Memory.find({
            phase: req.params.phaseId,
            user: req.user._id
        }).sort({ capturedDate: 1 });

        res.status(200).json(memories);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

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
            updateData.contentUrl = req.file.path;
            updateData.cloudinaryPublicId = req.file.filename;
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

router.delete('/:id', async (req, res) => {
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