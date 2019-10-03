const express = require('express');
const mongoose = require('mongoose');
const auth = require('../../middleware/auth');

const Transaction = require('../../models/Transaction');

const router = express.Router();

const { ObjectId } = mongoose.Types;

/**
 * @route   GET api/transactions
 * @desc    Retrieve user's transaction history
 * @access  Public
 */
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: ObjectId(req.userId),
    })
      .select('-user -__v -updatedAt -createdAt')
      .sort({ createdAt: -1 });
    return res.status(200).json(transactions);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Server error. Please try again later' });
  }
});

module.exports = router;
