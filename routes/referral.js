const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get Referral Code
router.get('/code', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({
      referralCode: user.referral.referralCode,
      totalEarnings: user.referral.totalReferralEarnings,
      referralCount: user.referral.referrals.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join with Referral Code
router.post('/join', auth, async (req, res) => {
  try {
    const { referralCode } = req.body;
    const user = await User.findById(req.userId);

    if (user.referral.referredBy) {
      return res.status(400).json({ message: 'Already have a referrer' });
    }

    const referrer = await User.findOne({ 'referral.referralCode': referralCode });
    if (!referrer) {
      return res.status(404).json({ message: 'Referral code not found' });
    }

    user.referral.referredBy = referralCode;
    referrer.referral.referrals.push({ userId: user._id, earnings: 0 });

    await user.save();
    await referrer.save();

    res.json({ message: 'Joined with referral code successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Referral Stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({
      referralCode: user.referral.referralCode,
      referrals: user.referral.referrals.length,
      totalEarnings: user.referral.totalReferralEarnings,
      referralList: user.referral.referrals
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;