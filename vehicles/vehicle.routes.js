const express = require('express');
const router = express.Router();

const vehicleControllers = require('./vehicle.controllers');

// Collections:
router.get('/vehicles', vehicleControllers.getAllVehicles)
router.get('/vehicles/:id_user', vehicleControllers.getUserVehicles);
router.get('/vehicles/:id_user/:id_vehicle', vehicleControllers.getSingleVehicle)

// Non Resource URL:
router.post('/register-vehicles', vehicleControllers.registerVehicle);

router.delete('/vehicles', vehicleControllers.deleteVehicleById)

module.exports = router