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

// Get Wallet
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ wallet: user.wallet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect BNB Wallet
router.post('/connect-bnb', auth, async (req, res) => {
  try {
    const { bnbAddress } = req.body;
    const user = await User.findById(req.userId);

    user.wallet.bnbAddress = bnbAddress;
    await user.save();

    res.json({ message: 'BNB wallet connected successfully', bnbAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Withdraw to BNB
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.userId);

    if (user.wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    if (!user.wallet.bnbAddress) {
      return res.status(400).json({ message: 'BNB wallet not connected' });
    }

    user.wallet.balance -= amount;
    await user.save();

    // TODO: Implement actual BNB transfer via Web3
    res.json({
      message: 'Withdrawal initiated',
      amount,
      txHash: '0x' + Math.random().toString(16).slice(2),
      newBalance: user.wallet.balance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;