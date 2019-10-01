const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
  // check if there is an authorization header
  if (!('authorization' in req.headers)) {
    return res.status(401).json({ error: 'No authorization token' });
  }

  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET,
    );
    const user = await User.findOne({ _id: userId });
    if (user) {
      return res.status(200).json(user);
    }
    return res.status(404).json({ error: 'User not found' });
  } catch (error) {
    // 403 - forbidden action to get the credentials
    return res.status(403).json({ error: 'Invalid token' });
  }
});

module.exports = router;
