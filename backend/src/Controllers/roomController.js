const Room = require('../models/room');

const getRoomsByBuilding = async (req, res) => {
  try {
    const rooms = await Room.find({ buildingId: req.params.buildingId });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getRoomsByBuilding };