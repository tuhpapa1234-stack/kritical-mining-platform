const mongoose = require('mongoose');

const miningStatsSchema = new mongoose.Schema({
  totalUsers: { type: Number, default: 0 },
  totalMined: { type: Number, default: 0 },
  totalStaked: { type: Number, default: 0 },
  activeminers: { type: Number, default: 0 },
  currentHalving: { type: Number, default: 1 },
  miningRewardPerSession: { type: Number, default: 100 },
  halveCount: { type: Number, default: 0 },
  nextHalvingAt: { type: Number, default: 1000000 },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MiningStats', miningStatsSchema);