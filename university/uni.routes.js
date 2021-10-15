const controllers = require('./uni.controllers');
const express = require('express');
const router = express.Router();

router.get('/uni-transactions/:id_user', controllers.getAllParkingTransactions);
router.get('/uni-transactions/:id_user/:id_transaction', controllers.getSingleParkingTransactions);
router.post('/uni-pay', controllers.payParking)

router.get('/uni-booking/:id_user', controllers.getAllBooking)
router.get('/uni-booking/:id_user/:id_booking', controllers.getSingleBooking)
router.delete('/uni-booking/:id_user/:id_booking', controllers.deleteBooking)
router.post('/uni-booking', controllers.bookParking);

router.get('/uni-parkings/:id_university', controllers.getSingleUniversity);
router.get('/uni-parkings', controllers.getAllUniversity);

module.exports = router;