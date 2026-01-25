const express = require('express');
const router = express.Router();
const Memory = require('../models/memory');
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

router.get('/phase/:phaseId', async (req, res) => {
    try {
        const memories = await Memory.find({
            phase: req.params.phaseId,
            user: req.user._id
        }).sort({ capturedDate: 1 });
        const curatedMemories = memories.map(memory => {
            if (memory.unlockDate && new Date() < new Date(memory.unlockDate)) {
                return {
                    ...memory._doc,
                    contentUrl: null,
                    story: "Locked in a Time Capsule",
                    isLocked: true
                };
            }
            return memory;
        });
        res.status(200).json(curatedMemories);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});



module.exports = router;