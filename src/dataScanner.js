'use strict';
const rsi = require('./functions/rsi');
const createColumns = require('./functions/createColumns.js');
const dbSet = require('./functions/dbSet.js');
/**
 * Scan all pairs from bitfinex
 * @param {array} bitfinexData
 */
module.exports = async (bitfinexData) => {
    console.log(`Scanning Data`);
    const dataArray = bitfinexData;
    await dataArray.forEach(async (results) => {
        try {
            // has data then process
            if (results.data.length > 0) {
                let rsiAndPrice = await rsi(results.data);
                const price = rsiAndPrice[0];
                const rsiResult = rsiAndPrice[1];
                const timeFrame = results.timeFrame;
                const pair = results.pair;
                let divergence = await createColumns(price, rsiResult, timeFrame, pair);
                if (divergence.direction != 'none') {
                    console.log('Divergence Found');
                    const key = `divergence~${divergence.pair}~${divergence.timeFrame}~${divergence.time}`;
                    const value = divergence;
                    dbSet(key, value);
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
};
