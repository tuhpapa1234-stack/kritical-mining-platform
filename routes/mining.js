const express = require('express');
const router = express.Router();
const User = require('../models/User');
const MiningStats = require('../models/MiningStats');
const jwt = require('jsonwebtoken');

// Middleware para verificar token
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

// Start Mining
router.post('/start', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.mining.miningActive) {
      return res.status(400).json({ message: 'Mining already active' });
    }

    user.mining.miningActive = true;
    user.mining.lastMiningTime = new Date();
    user.mining.nextMiningTime = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 horas

    await user.save();

    res.json({
      message: 'Mining started',
      nextMiningTime: user.mining.nextMiningTime,
      miningDuration: '12 hours'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Claim Mining Rewards
router.post('/claim', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const now = new Date();
    if (!user.mining.nextMiningTime || now < user.mining.nextMiningTime) {
      return res.status(400).json({
        message: 'Mining not ready to claim',
        nextClaimTime: user.mining.nextMiningTime
      });
    }

    // Calculate halving based on users
    const stats = await MiningStats.findOne();
    let reward = stats?.miningRewardPerSession || 100;

    // Apply halving logic
    if (stats && stats.totalUsers % stats.nextHalvingAt === 0) {
      reward = reward / 2;
      stats.halveCount += 1;
      stats.miningRewardPerSession = reward;
      await stats.save();
    }

    // Calculate referral bonus (10%)
    let referralBonus = 0;
    if (user.referral.referredBy) {
      referralBonus = reward * 0.1;
      const referrer = await User.findOne({ 'referral.referralCode': user.referral.referredBy });
      if (referrer) {
        referrer.referral.totalReferralEarnings += referralBonus;
        referrer.wallet.balance += referralBonus;
        await referrer.save();
      }
    }

    user.mining.currentSession += reward;
    user.wallet.balance += reward;
    user.mining.miningActive = false;
    user.mining.nextMiningTime = new Date(Date.now() + 12 * 60 * 60 * 1000);

    user.miningHistory.push({
      amount: reward,
      referralBonus: referralBonus,
      timestamp: new Date()
    });

    user.mining.totalMined += reward;
    await user.save();

    res.json({
      message: 'Rewards claimed successfully',
      reward,
      referralBonus,
      newBalance: user.wallet.balance,
      totalMined: user.mining.totalMined
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Mining Stats
router.get('/stats/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      mining: user.mining,
      miningHistory: user.miningHistory,
      wallet: user.wallet,
      referralCode: user.referral.referralCode
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;