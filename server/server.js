const next = require('next');
const connectDB = require('./utils/db');
const logger = require('./utils/logger');
const server = require('./routes');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    connectDB();

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(process.env.PORT, err => {
      if (err) throw err;
      logger.info(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch(error => {
    logger.error(error.stack);
    process.exit(1);
  });
