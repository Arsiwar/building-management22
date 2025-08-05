const express = require('express');
const router = express.Router();
const buildingController = require('../Controllers/buildingController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/', buildingController.getBuildings);

module.exports = router;