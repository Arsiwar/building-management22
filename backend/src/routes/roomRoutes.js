const express = require('express');
const router = express.Router();
const roomController = require('../Controllers/roomController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/:buildingId', roomController.getRoomsByBuilding);

module.exports = router;