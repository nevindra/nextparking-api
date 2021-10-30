const controllers = require('./bookings.controllers');
const express = require('express');
const router = express.Router();

router.get('/:id_user', controllers.getAllBooking);
router.get('/:id_user/:id_booking', controllers.getSingleBooking);
router.post('/create', controllers.bookParking)
router.delete('/delete', controllers.deleteBooking)

module.exports = router