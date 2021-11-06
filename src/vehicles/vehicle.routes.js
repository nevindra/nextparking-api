const express = require('express');
const router = express.Router();

const vehicleControllers = require('./vehicle.controllers');

// Collections:
router.get('/', vehicleControllers.getAllVehicles)
router.get('/:id_user', vehicleControllers.getUserVehicles);
router.get('/:id_user/:id_vehicle', vehicleControllers.getSingleVehicle)

// Non Resource URL:
router.post('/register', vehicleControllers.registerVehicle);
router.delete('/vehicles', vehicleControllers.deleteVehicleById)

module.exports = router