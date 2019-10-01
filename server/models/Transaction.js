const mongoose = require('mongoose');

const { Number, ObjectId, String } = mongoose.Schema.Types;

const options = {
  timestamps: true,
};

const actionOptions = ['BUY', 'TRADE'];

class transactionClass {
  static validActions() {
    return actionOptions;
  }
}

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
      enum: actionOptions,
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

transactionSchema.loadClass(transactionClass);

module.exports = mongoose.model('Transaction', transactionSchema);
