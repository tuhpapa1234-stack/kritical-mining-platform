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

// Stake Tokens
router.post('/stake', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.userId);

    if (user.wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.wallet.balance -= amount;
    user.staking.stakedAmount += amount;
    user.staking.stakedDate = new Date();

    await user.save();

    res.json({
      message: 'Staking successful',
      stakedAmount: user.staking.stakedAmount,
      walletBalance: user.wallet.balance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Claim Staking Rewards
router.post('/claim-rewards', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.staking.stakedAmount === 0) {
      return res.status(400).json({ message: 'No staked tokens' });
    }

    // Calculate APY (Annual Percentage Yield) - Example: 12% per year
    const stakingDays = (Date.now() - new Date(user.staking.stakedDate)) / (1000 * 60 * 60 * 24);
    const dailyReward = (user.staking.stakedAmount * 0.12) / 365;
    const rewards = dailyReward * stakingDays;

    user.staking.stakingRewards += rewards;
    user.wallet.balance += rewards;

    await user.save();

    res.json({
      message: 'Staking rewards claimed',
      rewards: rewards.toFixed(2),
      newBalance: user.wallet.balance,
      stakedAmount: user.staking.stakedAmount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unstake
router.post('/unstake', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    user.wallet.balance += user.staking.stakedAmount;
    user.staking.stakedAmount = 0;

    await user.save();

    res.json({
      message: 'Unstaking successful',
      walletBalance: user.wallet.balance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Staking Info
router.get('/info', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({
      stakedAmount: user.staking.stakedAmount,
      stakingRewards: user.staking.stakingRewards,
      stakedDate: user.staking.stakedDate,
      apy: 12
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.module.exports = router;