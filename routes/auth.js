const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register with Email/Password
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = `REF_${Date.now()}`;

    user = new User({
      email,
      username: username || email.split('@')[0],
      password: hashedPassword,
      referral: { referralCode }
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, email: user.email, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Google OAuth Login
router.post('/google', async (req, res) => {
  try {
    const { googleId, email, name, profilePicture } = req.body;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      const referralCode = `REF_${Date.now()}`;
      user = new User({
        email,
        username: name || email.split('@')[0],
        googleId,
        referral: { referralCode }
      });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({
      message: 'Google login successful',
      token,
      user: { id: user._id, email: user.email, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ message: 'Login successful', token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;