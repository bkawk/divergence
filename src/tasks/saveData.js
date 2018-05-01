'use strict'
const fs = require('fs');
const util = require('util');
/**
 * Save Data
 * Save the data to disk
 * @param {string} name The proce data
 * @param {object} data The proce data
 */
module.exports = function saveData(name, data) {
    let logFile = fs.createWriteStream(
         `./logs/${name}.js`, {flags: 'a'});
    logFile.write(util.format(data) + '\n');
};
