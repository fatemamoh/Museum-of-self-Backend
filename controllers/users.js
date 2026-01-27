const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { cloudinary, upload } = require('../config/cloudinary');

router.put('/profile', upload.single('avatar'), async (req, res) => {
  try {
    const updateData = {};
    if (req.body.bio !== undefined) updateData.bio = req.body.bio;
    if (req.body.location !== undefined) updateData.location = req.body.location;

    if (req.file) {
      const user = await User.findById(req.user._id);

      if (user && user.avatarPublicId) {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      }

      updateData.avatarUrl = req.file.path || req.file.secure_url;
      updateData.avatarPublicId = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: false }
    ).select('-password -masterPin');

    if (!updatedUser) return res.status(404).json({ err: 'User not found' });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -masterPin');
    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ err: 'User not found' });

    if (user.avatarPublicId) {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    }

    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;