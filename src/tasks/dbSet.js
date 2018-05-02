'use strict';
const levelup = require('levelup');
const leveldown = require('leveldown');
const db = levelup(leveldown('./database'));
const isJson = require('../functions/isJson');
/**
 * Set Data
 * Set the data to level db
 * @param {string} key The proce value
 * @param {object} value The proce value
 */
export function dbSet(key, value) {
    if (isJson(value)) {
        const data = JSON.stringify(value);
        db.put(key, data, function(err) {
            db.get(key, {asBuffer: false}, function(err, value) {
                if (err) return console.log('Ooops!', err);
            });
        });
    }
};


