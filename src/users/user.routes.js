const express = require('express');
const router = express.Router();

const userControllers = require('./user.controllers');
const isAuth = require('../auth/auth.controllers');

router.get('/', userControllers.getUsers);
router.post('/registration', userControllers.postRegistration);
router.post('/send-sms', userControllers.sendSMS);
router.post('/verify-sms', userControllers.verifySMS);
router.patch('/:id', isAuth.verifyToken, userControllers.editUser);
router.get('/:id', isAuth.verifyToken, userControllers.getUserByID);

module.exports = router;