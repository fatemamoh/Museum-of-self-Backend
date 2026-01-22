const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/sign-up', async (req, res) => {
  try {
    const { username, email, password, masterPin } = req.body;
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        err: 'Password must be 8+ characters, include an uppercase letter and a number.' 
      });
    }

    const userInDatabase = await User.findOne({ $or: [{ username }, { email }] });
    if (userInDatabase) {
      return res.status(409).json({ err: 'Username or Email already in use.' });
    }

    const user = await User.create(req.body);

    const payload = {username: user.username,_id: user._id,};
    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
});

router.post('/sign-in', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userInDatabase = await User.findOne({ username });

    // if the user does not exist, redirect to sign up with msg
    if (!userInDatabase) {
      return res.status(401).json({ err: 'Invalid Credentials' });
    }

    const isValidPassword = bcrypt.compareSync(password, userInDatabase.password);

    // if the pw doesnt match, throw an error
    if (!isValidPassword) {
      return res.status(401).json({ err: 'Invalid Credentials' });
    }

    const payload = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
    };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (err) {
    console.log(err);

    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
