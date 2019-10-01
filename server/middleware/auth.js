const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');

  // Check if there is no token
  if (!token) {
    res.status(401).json({ error: 'No authorization token' });
  } else {
    // Verify token
    try {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = userId;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token is not valid' });
    }
  }
};

module.exports = auth;
