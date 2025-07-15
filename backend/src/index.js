const express = require('express');

// Initialiser l'application Express
const app = express();

// Route de base pour tester le serveur
app.get('/', (req, res) => {
  res.send('Bonjour ! Le serveur fonctionne.');
});

// Définir le port
const PORT = 5000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours sur le port ${PORT}`);
});