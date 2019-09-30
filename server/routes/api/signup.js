const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const isEmail = require('validator/lib/isEmail');
const isLength = require('validator/lib/isLength');
const logger = require('../../utils/logger');

const User = require('../../models/User');

const router = express.Router();

/**
 * @route   POST api/signup
 * @desc    Register user
 * @access  Public
 */
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // 1) Validate name, email, and password values
    if (!isLength(name, { min: 3, max: 15 })) {
      return res
        .status(422)
        .json({ error: 'Name must be between 3-15 characters' });
    }
    if (!isLength(password, { min: 6 })) {
      return res
        .status(422)
        .json({ error: 'Password must be at least 6 characters' });
    }
    if (!isEmail(email)) {
      return res.status(422).json({ error: 'Email must be valid' });
    }
    // 2) Check if user already exists in the database
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(422)
        .json({ error: `User already exists with email ${email}` });
    }
    // 3) If not, hash their password
    const hash = await bcrypt.hash(password, 10);
    // 4) Create user
    const newUser = await new User({
      name,
      email,
      password: hash,
    }).save();
    // 5) Create token for the new user
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    // 6) send back token
    return res.status(201).json({ token });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: 'Error signup user. Please try again later' });
  }
});

module.exports = router;
