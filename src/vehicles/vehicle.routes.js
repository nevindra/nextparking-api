const express = require('express');
const router = express.Router();

const vehicleControllers = require('./vehicle.controllers');
const isAuth = require('../auth/auth.controllers')
// Collections:
// router.get('/', isAuth, vehicleControllers.getAllVehicles)
router.get('/', isAuth.verifyToken, vehicleControllers.getUserVehicles);
router.get('/:id_user/:id_vehicle', isAuth.verifyToken, vehicleControllers.getSingleVehicle)

// Non Resource URL:
router.post('/register', isAuth.verifyToken, vehicleControllers.registerVehicle);
router.delete('/delete', isAuth.verifyToken, vehicleControllers.deleteVehicleById)
router.patch('/edit', isAuth.verifyToken, vehicleControllers.editVehicle)

module.exports = router