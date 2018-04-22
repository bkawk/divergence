'use strict';
const winston = require('winston');
const fs = require('fs');
const moment = require('moment');

const log = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ 
            colorize: true,
            timestamp() {return moment().format('dddd, MMMM Do YYYY, h:mm:ss a');},
            level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
        }),
        new (winston.transports.File)({
            filename: `logs.log`,
            timestamp() {return moment().format('dddd, MMMM Do YYYY, h:mm:ss a');},
            level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
        })
    ]
});

module.exports = log;