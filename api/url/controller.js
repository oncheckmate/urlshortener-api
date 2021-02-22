const { validationResult } = require('express-validator');
require('dotenv').config();
const tokenGenerator = require('../../helpers/token-generator');

// Models
const Url = require('../../models/url');

exports.getUrl = async(req, res, next) => {
    const shortenCode = req.params.shortenCode;

    try {
        const url = await Url.findOne({shortenCode: shortenCode}).select('-_id -__v -updatedAt');
        if(!url) {
            const error = new Error('Shorten Code Not Found');
            error.statusCode = 404;
            throw error;
        }
        
        res.status(301).redirect(url.originalUrl);

    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    }
};

exports.getUrlInfo = async(req, res, next) => {
    const shortenCode = req.params.shortenCode;

    try {
        const url = await Url.findOne({shortenCode: shortenCode}).select('-_id -__v -updatedAt');
        if(!url) {
            const error = new Error('Shorten Code Not Found');
            error.statusCode = 404;
            throw error;
        }
        
        res.status(200).json({url: url});

    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    }
};

exports.postUrl = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        error.errors = errors.array();
        return next(error);
    }

    const originalUrl = req.body.url;
    const unique = req.body.unique;

    try {
        let token = await tokenGenerator(3);
        if(!unique) {
            const existingUrl = await Url.findOne({originalUrl: originalUrl}).select('-_id -__v -updatedAt');
            if(existingUrl) {
                return res.status(200).json({url: existingUrl});
            }
        }

        const url = new Url({originalUrl: originalUrl, shortenCode: token})
        await url.save();
        res.status(201).json({url: {originalUrl: url.originalUrl, shortenCode: url.shortenCode, createdAt: url.createdAt}});

    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    }
};