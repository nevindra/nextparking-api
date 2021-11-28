const controllers = require('./uni.controllers');
const express = require('express');
const router = express.Router();

router.get('/search', controllers.searchUniversity)
router.get('/:id_university', controllers.getSingleUniversity);
router.get('/', controllers.getAllUniversity);
router.post('/distance', controllers.getUniversityDistance);

module.exports = router;