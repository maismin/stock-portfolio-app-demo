const express = require('express');

const User = require('../../models/User');
const Transaction = require('../../models/Transaction');
const Portfolio = require('../../models/Portfolio');

const router = express();

router.post('/reset', async (req, res) => {
  await User.deleteMany();
  await Transaction.deleteMany();
  await Portfolio.deleteMany();

  res.status(204).end();
});

module.exports = router;
