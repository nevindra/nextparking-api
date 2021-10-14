const controllers = require('./uni.controllers');
const express = require('express');
const router = express.Router();

router.get('/uni-transactions/:id_user', controllers.getAllParkingTransactions);
router.get('/uni-transactions/:id_user/:id_transaction', controllers.getSingleParkingTransactions);
router.get('/uni-parkings/:id_university', controllers.getSingleUniversity);
router.get('/uni-parkings', controllers.getAllUniversity);
router.post('/uni-booking', controllers.bookParking);
router.post('/uni-pay', controllers.payParking)

module.exports = router;