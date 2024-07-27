const jwt = require('jsonwebtoken');
const User = require('./models/User');
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send({ error: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, 'Asdzxc9900!');
    const user = await User.findById({ _id: decoded.userId });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

module.exports = authMiddleware;
