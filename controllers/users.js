const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { cloudinary, upload } = require('../config/cloudinary');

router.put('/profile', upload.single('avatar') ,async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ err: 'User not found' });

    user.bio = req.body.bio || user.bio;
    user.location = req.body.location || user.location;

    if (req.file) {
        if (user.avatarPublicId){
        await cloudinary.uploader.destroy(user.avatarPublicId);    
        }
        
    user.avatarUrl = req.body.avatarUrl || req.file.path;
    user.avatarPublicId = req.body.avatarPublicId || req.file.filename; 

    }

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