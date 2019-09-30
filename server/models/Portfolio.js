const mongoose = require('mongoose');

const { Number, ObjectId, String } = mongoose.Schema.Types;

const options = {
  timestamps: true,
};

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
    },
    ticker: {
      type: String,
      required: true,
    },
    shares: {
      type: Number,
      required: true,
    },
  },
  options,
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
