const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/connectDB');
const corsOptions = require('./config/constOptions');
const User = require('./models/user'); 
const authRoutes = require('./routes/authRoutes');
const buildingRoutes = require('./routes/buildingRoutes');

const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());



app.post('/test-user', async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).send('Tous les champs (first_name, last_name, email, password) sont requis.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Utilisateur déjà existant avec cet email.');
    }

    const newUser = new User({ first_name, last_name, email, password });
    await newUser.save();

    res.send('Utilisateur test créé avec succès !');
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// Utiliser les routes d'authentification
  app.use('/auth', authRoutes);
  app.use('/api/buildings', buildingRoutes);



  
  app.get('/', (req, res) => {
  res.send('Bonjour ! Le serveur fonctionne.');
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur en cours sur le port ${PORT}`);
});
