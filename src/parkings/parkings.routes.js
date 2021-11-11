const controllers = require('./parkings.controllers');
const express = require('express');
const isAuth = require("../auth/auth.controllers");
const router = express.Router();

router.get('/:id_user', isAuth.verifyToken, controllers.getAllParkingTransactions);
router.get('/:id_user/:id_parking', isAuth.verifyToken, controllers.getSingleParkingTransactions)
router.post('/pay', isAuth.verifyToken, controllers.payParking)

module.exports = router