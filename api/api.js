const express = require('express');

const urlRoutes = require('./url/routes');

const router = express.Router();

router.use('/api', urlRoutes);

module.exports = router;