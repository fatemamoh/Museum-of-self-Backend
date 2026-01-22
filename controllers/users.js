const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { cloudinary } = require('../config/cloudinary');

router.put('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ err: 'User not found' });

    user.bio = req.body.bio || user.bio;
    user.location = req.body.location || user.location;
    user.avatarUrl = req.body.avatarUrl || user.avatarUrl;
    user.avatarPublicId = req.body.avatarPublicId || user.avatarPublicId; 

    await user.save();
    res.status(200).json(user);
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
    res.status(200).json({ message: 'Account and associated media deleted successfully' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;