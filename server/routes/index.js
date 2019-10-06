const express = require('express');

const signupRouter = require('./api/signup');
const loginRouter = require('./api/login');
const portfolioRouter = require('./api/portfolios');
const transactionRouter = require('./api/transactions');
const testingRouter = require('./api/testing');

const server = express();

server.use(express.json()); // parse body

server.use('/api/signup', signupRouter);
server.use('/api/login', loginRouter);
server.use('/api/portfolio', portfolioRouter);
server.use('/api/transactions', transactionRouter);

if (process.env.NODE_ENV !== 'production') {
  server.use('/api/testing', testingRouter);
}

module.exports = server;
