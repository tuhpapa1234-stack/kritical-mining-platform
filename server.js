const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kritical')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/mining', require('./routes/mining'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/staking', require('./routes/staking'));
app.use('/api/referral', require('./routes/referral'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Kritical Mining Platform Active ⛏️' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Kritical Mining Server running on port ${PORT}`);
});