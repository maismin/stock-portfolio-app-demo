const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const logger = require('../../utils/logger');

const router = express.Router();

/**
 * @route   POST api/login
 * @desc    Login user
 * @access  Public
 */
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1) check if a user exists with the provided email
    const user = await User.findOne({ email }).select('+password');
    // 2) if not, return an error
    if (!user) {
      return res.status(404).json({ error: 'Invalid email or password' });
    }
    // 3) check if user password matches the one in the DB
    const passwordsMatch = await bcrypt.compare(password, user.password);
    // 4) if so, generate a token
    if (passwordsMatch) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
      // 5) send token to the client
      return res.status(200).json({ token });
    }
    return res.status(404).json({ error: 'Invalid email or password' });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: 'Error logging in user' });
  }
});

module.exports = router;
