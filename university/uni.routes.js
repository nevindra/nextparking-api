const controllers = require('./uni.controllers');
const express = require('express');
const router = express.Router();

router.get('/uni/transactions/:id_user', controllers.getAllParkingTransactions);
router.get('/uni/transactions/:id_user/:id_parking', controllers.getSingleParkingTransactions);
router.post('/uni/pay', controllers.payParking)

router.get('/uni/bookings/:id_user', controllers.getAllBooking)
router.get('/uni/bookings/:id_user/:id_booking', controllers.getSingleBooking)
router.delete('/uni/bookings/:id_user/:id_booking', controllers.deleteBooking)
router.post('/uni/bookings', controllers.bookParking);

router.get('/uni/parkings/:id_university', controllers.getSingleUniversity);
router.get('/uni/parkings', controllers.getAllUniversity);

module.exports = router;