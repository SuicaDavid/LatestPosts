const express = require('express');
const router = express.Router();
const photos = require('./photo')

/* GET home page. */
router.get('/', photos.list);

module.exports = router;
