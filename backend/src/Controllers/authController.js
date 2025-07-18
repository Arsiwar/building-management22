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
    const refreshToken = jwt.sign(
      { UserInfo: { id: user._id } },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    //res.status(201).json({ accessToken, email: user.email });
     res.status(201).json({
      accessToken,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      });
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
     const refreshToken = jwt.sign(
      { UserInfo: { id: foundUser._id } },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken, email: foundUser.email });
  };
  const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });

      const foundUser = await User.findById(decoded.UserInfo.id).exec();
      if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

      const accessToken = jwt.sign(
        { UserInfo: { id: foundUser._id } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10m' } // mets un string ici (important pour certains JWT libs)
      );

      return res.json({ accessToken }); // bonne pratique : return ici aussi
    }
  );
};


  const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.json({ message: 'Already logged out or not logged in' });
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });
    res.json({ message: 'Cookie cleared' });
  };

  module.exports = { register, login, refresh, logout };