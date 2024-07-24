const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, country } = req.body;
    const existingUser = await User.findOne({email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with that email' });
    }
    const newUser = new User({
      name,
      email,
      password,
      role: role ,
      country
    });
   const response = await newUser.save();
    const token = jwt.sign(
      { userId: response._id, name: response.name, role: response.role },
      "Asdzxc9900!",
      { expiresIn: '1d' }
    );

    res.status(201).json({ message: 'User registered successfully', token, response });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'email Address not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role },
      "Asdzxc9900!",
      { expiresIn: '1d' }
    );
    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
