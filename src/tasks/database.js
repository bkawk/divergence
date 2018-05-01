'use strict';
var levelup = require('levelup')
var leveldown = require('leveldown')
var db = levelup(leveldown('./database'))
/**
 * Set Data
 * Set the data to level db
 * @param {object} data The proce data
 */
module.exports = function dbSet(data) {
    // TODO: Add time to the key, get this from bitfinex
    const key = `divergence~${data.pair}~${data.timeFrame}`;
    const value = JSON.stringify(data);

    db.put(key, value, function (err) {
        db.get(key, { asBuffer: false }, function (err, value) {
            if (err) return console.log('Ooops!', err) 
        })
    })
};


