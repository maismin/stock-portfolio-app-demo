const express = require('express');
const mongoose = require('mongoose');
const currency = require('currency.js');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Portfolio = require('../../models/Portfolio');
const Transaction = require('../../models/Transaction');
const transactionOptions = require('../../utils/transactionOptions');

const iexApi = require('../../services/iex');

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

    // Total value of portfolio
    let value = currency(0, { formatWithSymbol: true });

    if (stocks.length) {
      // Grab all the latest info on the stocks that the user owns
      const tickers = stocks.map(stock => stock.ticker);
      const response = await iexApi.getStockQuotes(tickers);
      const stockQuotes = response.data;

      for (let i = 0; i < stocks.length; i += 1) {
        const stock = stocks[i];

        // check if response contains stock quote
        if (stock.ticker in stockQuotes) {
          const stockQuote = stockQuotes[stock.ticker];
          const openPrice = currency(stockQuote.previous.open).value;
          const currentPrice = currency(stockQuote.price, {
            formatWithSymbol: true,
          }).value;

          if (currentPrice < openPrice) {
            stock.performance = -1;
          } else if (currentPrice === openPrice) {
            stock.performance = 0;
          } else {
            stock.performance = 1;
          }

          value = value.add(currency(stock.shares).multiply(currentPrice));
          stock.value = currency(currentPrice, {
            formatWithSymbol: true,
          }).format();
        } else {
          // no stock quote found, add N/A to stock value
          stock.performance = 0;
          stock.value = 'N/A';
        }
      }
    }

    user.balance = currency(user.balance, { formatWithSymbol: true }).format();
    value = value.format();
    return res.status(200).json({ user, portfolio: { value, stocks } });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error retrieving user info. Please try again later' });
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
    const response = await iexApi.getStockPrice(ticker);

    // Calculate price of shares
    const price = currency(response.data);
    const totalCostOfShares = price.multiply(shares);

    let newBalance = currency(user.balance);

    // If user is buying
    if (action === transactionOptions[0]) {
      newBalance = newBalance.subtract(totalCostOfShares);
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

      newBalance = newBalance.add(totalCostOfShares);

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
      { balance: newBalance.value },
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
    console.log(error.response);
    if (
      error &&
      error.response &&
      error.response.status &&
      error.response.status === 404
    ) {
      return res.status(400).json({ error: 'Invalid ticker' });
    }

    return res
      .status(500)
      .json({ error: 'Server error. Please try again later' });
  }
});

module.exports = router;
