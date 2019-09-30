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

userSchema.virtual('id').get(() => this._id); // eslint-disable-line no-underscore-dangle

module.exports = mongoose.model('User', userSchema);
