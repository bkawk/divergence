'use strict';
const rsi = require('./functions/rsi');
const createColumns = require('./functions/createColumns.js');
const dbSet = require('./functions/dbSet.js');
/**
 * Scan all pairs from bitfinex
 * @param {array} bitfinexData
 */
module.exports = function scan(bitfinexData) {
    new Promise((resolve, reject) => {
        console.log(`Scanning Data`);
        const dataArray = bitfinexData;
        dataArray.forEach((results) => {
            rsi(results.data)
                .then((rsiAndPrice) => {
                    const price = rsiAndPrice[0];
                    const rsi = rsiAndPrice[1];
                    const timeFrame = results.timeFrame;
                    const pair = results.pair;
                    return createColumns(price, rsi, timeFrame, pair);
                })
                .then((divergence) => {
                    if (divergence.direction != 'none') {
                        console.log('Divergence Found');
                        const key = `divergence~${divergence.pair}~${divergence.timeFrame}~${divergence.time}`;
                        const value = divergence;
                        dbSet(key, value);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    });
};
