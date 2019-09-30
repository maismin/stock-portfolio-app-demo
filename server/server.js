const express = require('express');
const next = require('next');
const connectDB = require('./utils/db');
const logger = require('./utils/logger');

const dev = process.env.NODE !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

connectDB();

app
  .prepare()
  .then(() => {
    // Custom rules of express
    const server = express();
    server.use(express.json()); // parse body

    // handle all the routes
    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(process.env.PORT, err => {
      if (err) throw err;
      logger.info(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch(error => {
    console.error(error.stack);
    process.exit(1);
  });
