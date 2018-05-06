'use strict';
const bitfinexData = require('./bitfinexData');
const dataScanner = require('./dataScanner');
const subscriptions = require('./subscriptions');
const util = require('util');

setImmediate(() => {
    run();
});
/**
 * Run/main method
 * run all promises in async way
*/
async function run() {
    try {
        console.log(`Divergence Detector Started`);
        const subscriptionsResp = await subscriptions();
        const bitfinexDataResp = await bitfinexData(subscriptionsResp);
        setScanner(bitfinexDataResp);
    } catch (error) {
        console.log(util.format('Error at run: %s', error));
    }
}
/**
 * Set the scanner scan time
 * @param {bitfinexData} data
 */
function setScanner(data) {
    let waitingForHour = 0;
    setInterval(() => {
        if (waitingForHour === 0) {
            console.log(`Waiting for the top of the hour before scanning`);
            waitingForHour = 1;
        }
        const minutes = new Date().getMinutes();
        const seconds = new Date().getSeconds();
        if (minutes === 0 && seconds === 0) {
            console.log(`Top of the hour is now`);
            dataScanner(data);
        }
        dataScanner(data);
    }, 10000);
}
