'use strict';
const calculateRSI = require('../functions/calculateRSI');
const createColumns = require('../functions/createColumns');
const dbSet = require('../tasks/database');
const isJson = require('../functions/isJson');
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
            const dataToSave = {pair: divergence.pair, timeFrame: divergence.timeFrame, period: divergence.period, direction: divergence.direction, column: divergence.data};
            if (isJson(divergence.data)) {
                dbSet(dataToSave);
            } else {
                console.log('Bad Data')
            }
        })
        .catch((error) => {
            console.log(error);
        });
            });
        });
    }
};
