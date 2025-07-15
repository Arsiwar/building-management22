const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/connectDB');
const corsOptions = require('./config/constOptions');

dotenv.config(); // Charger .env

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à la base de données
connectDB();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  res.send('Bonjour ! Le serveur fonctionne.');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en cours sur le port ${PORT}`);
});
