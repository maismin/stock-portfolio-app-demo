const mongoose = require('mongoose');

const { Number, ObjectId, String } = mongoose.Schema.Types;

const options = {
  timestamps: true,
};

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
      enum: ['BUY', 'SELL'],
    },
    ticker: {
      type: String,
      required: true,
    },
    shares: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  options,
);

module.exports = mongoose.model('Transaction', transactionSchema);
