const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, country, role } = req.body;
    const existingUser = await User.findOne({email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with that email' });
    }
    const newUser = new User({
      name,
      email,
      password,
      country,
      role
    });
   const response = await newUser.save();
    const token = jwt.sign(
      { userId: newUser._id, name: newUser.name, role: newUser.role },
      "Asdzxc9900!",
      { expiresIn: '1h' }
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
      { userId: user._id, name: user.name},
      "Asdzxc9900!",
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get("/all-user", async(req,res)=>{
  try {
    const users = await User.find({ role: 'user' });
    res.status(200).json({ message: 'All User Get Successfully', users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})
module.exports = router;
