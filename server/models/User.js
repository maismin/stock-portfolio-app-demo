const mongoose = require('mongoose');

const { Number, String } = mongoose.Schema.Types;

const options = {
  timestamps: true,
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    balance: {
      type: Number,
      default: 5000,
    },
  },
  options,
);

module.exports = mongoose.model('User', userSchema);
