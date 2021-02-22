const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const mongodbConfig = require('./config/mongodb');

const app = express();

// Express Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// API Router
app.use('/', require('./api/api'));

// Internal Error Handler
// Development Error Handler
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {        
        const status = err.statusCode || 500;
        const message = err.message;
        const errors = err.errors;
        res.status(status).json({message: message, debug: err, errors: errors});
    });
};

// Production Error Handler
app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message;
    const errors = err.errors;
    res.status(status).json({message: message, errors: errors});
});

// MongoDB Connection
mongoose.connect(mongodbConfig.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then((result) => {
        app.listen(process.env.PORT || 3000, () => {
            console.log('Running on Port', process.env.PORT || 3000);
        });
    })
    .catch((err) => {
        console.log(err);
    });