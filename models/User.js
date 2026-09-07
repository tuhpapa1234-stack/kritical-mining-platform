const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  googleId: String,
  password: String,
  wallet: {
    address: String,
    balance: { type: Number, default: 0 },
    bnbAddress: String
  },
  mining: {
    totalMined: { type: Number, default: 0 },
    currentSession: { type: Number, default: 0 },
    lastMiningTime: Date,
    nextMiningTime: Date,
    miningActive: { type: Boolean, default: false }
  },
  staking: {
    stakedAmount: { type: Number, default: 0 },
    stakingRewards: { type: Number, default: 0 },
    stakedDate: Date
  },
  referral: {
    referralCode: String,
    referredBy: String,
    referrals: [{ userId: String, earnings: Number }],
    totalReferralEarnings: { type: Number, default: 0 }
  },
  miningHistory: [{
    amount: Number,
    timestamp: { type: Date, default: Date.now },
    referralBonus: Number
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);