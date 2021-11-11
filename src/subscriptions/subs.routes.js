const controllers = require('./subs.controllers');
const express = require('express');
const isAuth = require("../auth/auth.controllers");
const router = express.Router();

router.get('/', controllers.getSubsPlans);
router.get('/:id_subs', controllers.getSinglePlan);
router.get('/history', isAuth.verifyToken, controllers.getSubsPaymentHistory);
router.get('/history/:id_subs', isAuth.verifyToken, controllers.getSubSingleHistory);

router.post('/pay', isAuth.verifyToken);

module.exports = router;