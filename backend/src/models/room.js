const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  equipment: [{ type: String }],
  available: { type: Boolean, default: true },
  floor: { type: String, required: true },
  description: { type: String, required: true },
  buildingId: { type: String, required: true, ref: 'Building' },
});

module.exports = mongoose.models.Room || mongoose.model('Room', roomSchema);