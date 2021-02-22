const mongoose = require('mongoose');

const urlSchema = mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortenCode: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Url', urlSchema);