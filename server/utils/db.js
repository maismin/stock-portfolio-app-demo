const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  let mongoUri;
  if (process.env.NODE_ENV === 'test') {
    mongoUri = process.env.MONGODB_URI_TEST;
  } else if (process.env.NODE_ENV === 'production') {
    mongoUri = process.env.MONGODB_URI;
  } else {
    mongoUri = process.env.MONGODB_URI_DEV;
  }

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error('Error connection to MongoDB:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
