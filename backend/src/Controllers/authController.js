const User = require('../models/user');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');

  const register = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    const foundUser = await User.findOne({ email }).exec();
    if (foundUser) {
      return res.status(401).json({ message: 'Email déjà utilisé' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
    const accessToken = jwt.sign(
      { UserInfo: { id: user._id } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10s' }
    );
    res.status(201).json({ accessToken, email: user.email });
  };

  module.exports = { register };