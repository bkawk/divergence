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
    var dir = './logs';
        if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    let logFile = fs.createWriteStream(
        dir + `/${name}.js`, {flags: 'a'});
    logFile.write(util.format(data) + '\n');
};
