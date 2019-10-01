const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Portfolio = require('../../models/Portfolio');
const Transaction = require('../../models/Transaction');

const router = express.Router();

const { ObjectId } = mongoose.Types;

/**
 * @route   GET api/portfolio
 * @desc    Retrieve user's portfolio
 * @access  Public
 */
// router.get('/', async (req, res) => {});

/**
 * @route   POST api/portfolio
 * @desc    Buy and trade stocks
 * @access  Public
 */
router.post('/', auth, async (req, res) => {
  const { action, ticker, shares } = req.body;

  // Check if transaction action is valid
  if (!Transaction.validActions().includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  const user = await User.findOne({ _id: req.userId }); // eslint-disable-line no-underscore-dangle

  const vantageURI = process.env.ALPHA_VANTAGE_URI;
  const vantageKEY = process.env.ALPHA_VANTAGE_KEY;
  const functionValue = 'GLOBAL_QUOTE';

  const payload = {
    params: {
      function: functionValue,
      symbol: ticker,
      apikey: vantageKEY,
    },
  };

  // Grab quote from vantage API
  let response;
  try {
    response = await axios.get(vantageURI, payload);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Server error. Please try again later' });
  }

  // Check if quote symbol matches what the user wants
  const quote = response.data['Global Quote'];
  if (!quote || quote['01. symbol'] !== ticker) {
    return res.status(400).json({ error: 'Invalid ticker' });
  }

  // Calculate price of shares
  const price = Number(quote['05. price']).toFixed(2);
  const totalCostOfShares = Number(shares) * price;

  let newBalance = user.balance;
  if (action === 'BUY') {
    newBalance = user.balance - totalCostOfShares;
    if (newBalance < 0) {
      return res.status(400).json({ error: 'Not enough funds' });
    }

    // Check if user already has shares in the stock
    const userStock = await Portfolio.findOneAndUpdate(
      { user: ObjectId(req.userId), ticker },
      { $inc: { shares } },
    );

    // Add stock to portfolio
    if (!userStock) {
      await new Portfolio({
        user: ObjectId(req.userId),
        ticker,
        shares,
      }).save();
    }
  }

  if (action === 'TRADE') {
    const userStock = await Portfolio.findOne({
      user: ObjectId(req.userId),
      ticker,
    });

    // Does the user own the shares of the stock?
    if (!userStock) {
      return res.status(400).json({ error: `${ticker} stocks not owned` });
    }

    // Does the user have enough shares to trade?
    if (userStock.shares < shares) {
      return res.status(400).json({ error: 'Insufficient shares' });
    }

    newBalance = user.balance + totalCostOfShares;

    // Update or delete portfolio shares
    if (userStock.shares > shares) {
      userStock.shares -= shares;
      await userStock.save();
    } else {
      await Portfolio.deleteOne({
        user: ObjectId(req.userId),
        ticker,
      });
    }
  }

  // Update user's balance
  await User.findOneAndUpdate({ _id: req.userId }, { balance: newBalance }); // eslint-disable-line no-underscore-dangle

  // Record transaction
  await new Transaction({
    user: ObjectId(req.userId),
    action,
    ticker,
    shares,
    price,
  }).save();

  return res.status(201).end();
});

module.exports = router;
