const express = require('express');

const signupRouter = require('./api/signup');
const loginRouter = require('./api/login');
const portfolioRouter = require('./api/portfolios');
const transactionRouter = require('./api/transactions');

const server = express();

server.use(express.json()); // parse body

server.use('/api/signup', signupRouter);
server.use('/api/login', loginRouter);
server.use('/api/portfolio', portfolioRouter);
server.use('/api/transactions', transactionRouter);

module.exports = server;
