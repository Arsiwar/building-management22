const express = require('express');
const router = express.Router();
const roomController = require('../Controllers/roomController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/:buildingId', roomController.getRoomsByBuilding);
router.post("/",  roomController.createRoom); // Utilise roomController.createRoom
router.put("/:id", roomController.updateRoom); // Ajoute la route PUT
router.delete("/:id", roomController.deleteRoom); // Ajoute la route DELETE

module.exports = router;