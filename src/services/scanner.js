'use strict';
const calculateRSI = require('../functions/calculateRSI');
const createColumns = require('../functions/createColumns');
const dbSet = require('../tasks/dbSet');
/**
 * A service that do scanning for divergence
*/
module.exports = class ScannerService {
    /**
     *
     * @param {bitfinexData[]} bitfinexData
     * @return {Void} empty promise
     */
    scan(bitfinexData) {
        return new Promise((resolve, reject) => {
            console.log(`Scanning Data now`);
            let dataArray = bitfinexData;
            dataArray.forEach((results) => {
                calculateRSI(results.data)
                    .then((rsiAndPrice) => {
                        return createColumns(
                            rsiAndPrice[0],
                            rsiAndPrice[1],
                            results.timeFrame,
                            results.pair
                        );
                    })
                .then((divergence) => {
                    // TODO: Add time to the key, get this from bitfinex
                    const key = `divergence~${divergence.pair}~${divergence.timeFrame}`;
                    const value = {pair: divergence.pair, timeFrame: divergence.timeFrame, period: divergence.period, direction: divergence.direction, column: divergence.data};
                    dbSet(key, value);
                })
                .catch((error) => {
                    console.log(error);
                });
            });
        });
    }
};
