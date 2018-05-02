'use strict';
const calculateRSI = require('../functions/calculateRSI');
const createColumns = require('../functions/createColumns');
const dbSet = require('../tasks/dbSet');
/**
 * A service that scans for divergences
*/
export class ScannerService {
    /**
     * @param {bitfinexData[]} bitfinexData
     * @return {Void} empty promise
     */
    scan(bitfinexData) {
        return new Promise((resolve, reject) => {
            console.log(`Scanning Data`);
            const dataArray = bitfinexData;
            dataArray.forEach((results) => {
                calculateRSI(results.data)
                .then((rsiAndPrice) => {
                    const price = rsiAndPrice[0];
                    const rsi = rsiAndPrice[1];
                    const timeFrame = results.timeFrame;
                    const pair = results.pair;
                    return createColumns(price, rsi, timeFrame, pair);
                })
                .then((divergence) => {
                    console.log('Divergence Found');
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
