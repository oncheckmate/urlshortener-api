const express = require('express');
const inputValidator = require('../../middlewares/input-validator');

const urlController = require('./controller');

const router = express.Router();

router.get('/url/:shortenCode', urlController.getUrl);

router.get('/url/info/:shortenCode', urlController.getUrlInfo);

router.post('/url', inputValidator.validate('url'), urlController.postUrl);

module.exports = router;