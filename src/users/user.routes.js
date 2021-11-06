const express = require('express');
const router = express.Router();

const userControllers = require('./user.controllers');

router.post('/users/registration', userControllers.postRegistration);
router.post('/users/login', userControllers.loginUser);
router.post('/users/send-sms', userControllers.sendSMS)
router.post('/users/verify-sms', userControllers.verifySMS)
// router.patch('/users/:id', userControllers.editUser);
router.delete('/users/:id', userControllers.deleteUser);

router.get('/users', userControllers.getUsers);
router.get('/users/:id', userControllers.getUserByID);

module.exports = router;