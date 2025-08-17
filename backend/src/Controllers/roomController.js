const Room = require('../models/room');

const getRoomsByBuilding = async (req, res) => {
  try {
    const rooms = await Room.find({ buildingId: req.params.buildingId });
    // Force une erreur
    //throw new Error('Erreur test');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
const createRoom = async (req, res) => {
  try {
    const { name, type, capacity, equipment, available, floor, description, buildingId } = req.body;
    const room = new Room({
      name,
      type,
      capacity,
      equipment: equipment || [],
      available: available !== undefined ? available : true,
      floor,
      description,
      buildingId,
    });
    const savedRoom = await room.save();
    res.status(201).json(savedRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, capacity, equipment, available, floor, description, buildingId } = req.body;
    const room = await Room.findByIdAndUpdate(
      id,
      { name, type, capacity, equipment, available, floor, description, buildingId },
      { new: true, runValidators: true }
    );
    if (!room) return res.status(404).json({ message: 'Salle non trouvée' });
    res.json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndDelete(id);
    if (!room) return res.status(404).json({ message: 'Salle non trouvée' });
    res.json({ message: 'Salle supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRoomsByBuilding, createRoom, updateRoom, deleteRoom };
