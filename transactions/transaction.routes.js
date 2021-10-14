const transactionController = require('./transactions.controllers');
const express = require('express');
const router = express.Router();

router.get('/history-subs/:id_user', transactionController.getSubsPaymentHistory)
router.post('/payment', transactionController.payTransaction)
router.post('/confirm-pin', transactionController.confirmPin)

module.exports = router;