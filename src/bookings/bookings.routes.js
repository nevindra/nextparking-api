const controllers = require('./bookings.controllers');
const express = require('express');
const router = express.Router();

const isAuth = require('../auth/auth.controllers')


router.get('/:id_user', isAuth.verifyToken, controllers.getAllBooking);
router.get('/:id_user/:id_booking', isAuth.verifyToken, controllers.getSingleBooking);
router.post('/create', isAuth.verifyToken, controllers.bookParking)
router.delete('/delete', isAuth.verifyToken, controllers.deleteBooking)

module.exports = router