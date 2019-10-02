const express = require('express');
const mongoose = require('mongoose');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Portfolio = require('../../models/Portfolio');
const Transaction = require('../../models/Transaction');
const transactionOptions = require('../../utils/transactionOptions');

const alphavantageApi = require('../../services/alphavantage');

const router = express.Router();

const { ObjectId } = mongoose.Types;

/**
 * @route   GET api/portfolio
 * @desc    Retrieve user's portfolio
 * @access  Public
 */
router.get('/', auth, async (req, res) => {
  try {
    // Get user info
    const user = await User.findOne({ _id: req.userId })
      .select('-_id -email -createdAt -updatedAt -__v')
      .lean();

    // Get user's portfolio from database
    const stocks = await Portfolio.find({
      user: ObjectId(req.userId),
    })
      .select('-user -createdAt -updatedAt -__v')
      .lean();

    // Grab all the latest info on the stocks that the user owns
    const stockQuotes = await Promise.all(
      stocks.map(stock => alphavantageApi.getStockQuote(stock.ticker)),
    );

    let value = 0;
    for (let i = 0; i < stocks.length; i += 1) {
      const stock = stocks[i];
      const stockQuote = stockQuotes[i]['Global Quote'];
      const openPrice = Number(stockQuote['02. open']).toFixed(2);
      const currentPrice = Number(stockQuote['05. price']).toFixed(2);

      if (currentPrice < openPrice) {
        stock.performance = -1;
      } else if (currentPrice === openPrice) {
        stock.performance = 0;
      } else {
        stock.performance = 1;
      }

      value += stock.shares * currentPrice;
      stock.value = Number(currentPrice);
    }

    return res.status(200).json({ user, portfolio: { value, stocks } });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Server error. Please try again later' });
  }
});

/**
 * @route   POST api/portfolio
 * @desc    Buy and sell stocks
 * @access  Public
 */
router.post('/', auth, async (req, res) => {
  try {
    const action = req.body.action.toUpperCase();
    const ticker = req.body.ticker.trim().toUpperCase();
    const shares = Number(req.body.shares);

    // Check if transaction action is valid
    if (!transactionOptions.includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // Check if shares is a whole number
    if (!Number.isInteger(shares)) {
      return res
        .status(400)
        .json({ error: 'Shares value must be a whole number' });
    }

    const user = await User.findOne({ _id: req.userId });

    // Check if quote symbol matches what the user wants
    const quote = (await alphavantageApi.getStockQuote(ticker))['Global Quote'];

    if (!quote || quote['01. symbol'] !== ticker) {
      console.log(`Ticker: ${ticker}, Quote: ${quote}`);
      return res.status(400).json({ error: 'Invalid ticker' });
    }

    // Calculate price of shares
    const price = Number(quote['05. price']).toFixed(2);
    const totalCostOfShares = shares * price;

    let newBalance = user.balance;

    // If user is buying
    if (action === transactionOptions[0]) {
      newBalance -= totalCostOfShares;
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

    // If user is selling
    if (action === transactionOptions[1]) {
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

      newBalance += totalCostOfShares;

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
    await User.findOneAndUpdate(
      { _id: req.userId },
      { balance: newBalance.toFixed(2) },
    ); // eslint-disable-line no-underscore-dangle

    // Record transaction
    await new Transaction({
      user: ObjectId(req.userId),
      action,
      ticker,
      shares,
      price,
    }).save();

    return res.status(201).end();
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Server error. Please try again later' });
  }
});

module.exports = router;
