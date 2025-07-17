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
   const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }
    const accessToken = jwt.sign(
      { UserInfo: { id: foundUser._id } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10s' }
    );
    res.json({ accessToken, email: foundUser.email });
  };

  module.exports = { register,login };