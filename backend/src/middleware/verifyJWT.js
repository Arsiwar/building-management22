const jwt = require('jsonwebtoken');

  const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Pas de token' });
    }
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token invalide' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
      if (err) {
        return res.status(403).json({ message: 'Token incorrect' });
      }
      next();
    });
  };

  module.exports = verifyJWT;