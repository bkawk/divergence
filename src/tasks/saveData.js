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
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    if (fs.existsSync(`./logs/${name}.json`)) {
        let filedata = JSON.parse(fs.readFileSync(`./logs/${name}.json`, 'utf8'));
        console.log(filedata);
        filedata.push(data);
        write(filedata);
    } else {
        write(data);
    }

    function write(data) {
        let logfile = fs.createWriteStream(`./logs/${name}.json`, { flags: 'w' });
        logfile.write(JSON.stringify(data));
    }

};

