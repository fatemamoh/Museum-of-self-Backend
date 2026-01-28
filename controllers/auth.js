const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');

router.post('/sign-up', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        err: 'Password must be at least 8 characters long and include both a letter and a number.'
      });
    }
    const userInDatabase = await User.findOne({ $or: [{ username }, { email }] });
    if (userInDatabase) {
      return res.status(409).json({ err: 'Username or Email already in use.' });
    }
    const user = await User.create(req.body);
    sendWelcomeEmail(user.email, user.username)
    const payload = {
      username: user.username,
      _id: user._id,
      bio: user.bio,
      location: user.location,
      avatarUrl: user.avatarUrl
    };
    const token = jwt.sign({ payload }, process.env.JWT_SECRET);
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
});

router.post('/sign-in', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ err: 'Invalid Credentials' });
    }
    const payload = {
      username: user.username,
      _id: user._id,
      bio: user.bio,
      location: user.location,
      avatarUrl: user.avatarUrl
    };
    const token = jwt.sign({ payload }, process.env.JWT_SECRET);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ err: "Curator not found." });

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save({ validateBeforeSave: false });

    await sendPasswordResetEmail(user.email, token);

    res.status(200).json({ message: "Recovery invitation sent." });
  } catch (error) {
    console.error("DETAILED ERROR:", error); 
    res.status(500).json({ err: error.message });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ err: "Recovery link is invalid or has expired." });
    }
    user.password = req.body.password;
      
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ message: "Vault access restored." });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

module.exports = router;