const controllers = require('./subs.controllers');
const express = require('express');
const router = express.Router();

router.get('/', controllers.getSubsPlans);
router.get('/:id_subs', controllers.getSinglePlan);
router.get('/history', controllers.getSubsPaymentHistory);
router.get('/history/:id_subs', controllers.getSubSingleHistory);

module.exports = router;