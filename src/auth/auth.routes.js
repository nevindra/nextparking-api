const express = require('express');
const router = express.Router();

const auth = require('./auth.controllers')

router.post('/login', auth.loginUser)
router.post('/refresh-token', auth.refreshToken)
router.post('/logout', auth.logout)

module.exports = router