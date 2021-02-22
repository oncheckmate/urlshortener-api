/*eslint indent: [2, 4, {"SwitchCase": 1}]*/

const { body } = require('express-validator');

exports.validate = (method) => {
    switch(method) {
        case 'url': {
            return [
                body('url', 'Invalid URL').isURL(),
                body('unique', 'Invalid Unique Option, MUST BE A BOOLEAN!').optional({checkFalsy: true}).isBoolean()
            ];
        }
    }
};