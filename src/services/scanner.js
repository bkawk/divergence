'use strict';
const calculateRSI = require('../functions/calculateRSI');
const createColumns = require('../functions/createColumns');
const saveData = require('../tasks/saveData');
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
            saveData(
                'divergence',
                `{"pair": ${JSON.stringify(divergence.pair)},
                "timeFrame": ${JSON.stringify(divergence.timeFrame)},
                "period": ${divergence.period},
                "direction": ${JSON.stringify(divergence.direction)},
                "column": ${JSON.stringify(divergence.data)}}`
            );
        })
        .catch((error) => {
            console.log(error);
        });
            });
        });
    }
};
