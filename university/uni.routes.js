const controllers = require('./uni.controllers');
const express = require('express');
const router = express.Router();

router.get('/:id_university', controllers.getSingleUniversity);
router.get('/', controllers.getAllUniversity);
router.post('/search', controllers.searchUniversity)

module.exports = router;