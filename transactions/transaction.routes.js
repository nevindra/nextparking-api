const transactionController = require('./transactions.controllers');
const express = require('express');
const router = express.Router();

router.get('/transactions/:id', transactionController.historyTransaction);
//router.get('/balances', transactionController.);
//router.post('/topup', transactionController.topUp);
router.post('/payment', transactionController.payTransaction)
router.post('/confirm-pin', transactionController.confirmPin)

module.exports = router;