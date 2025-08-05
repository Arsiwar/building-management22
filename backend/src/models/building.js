//Ça dit à MongoDB comment stocker les bâtiments (ex. : nom, icône, coordonnées).
const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  coordinates: { type: [Number], required: true }, // [latitude, longitude]
  description: { type: String, required: true },
  color: { type: String, default: 'bg-gray-200' },
});

module.exports = mongoose.models.Building || mongoose.model('Building', buildingSchema);