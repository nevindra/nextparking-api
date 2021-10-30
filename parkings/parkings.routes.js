const controllers = require('./parkings.controllers');
const express = require('express');
const router = express.Router();

router.get('/:id_user', controllers.getAllParkingTransactions);
router.get('/:id_user/:id_parking')
router.post('/', controllers.payParking)

module.exports = router