'use strict';
const RSI = require('@solazu/technicalindicators').RSI;
/**
 * Calculate RSI
 * From the historic and live data, calculate the
 * RSI and return the last 9 as 2 arrays
 * @param {object} priceArray The proce data
 * @return {object} the RSI Array
 */
module.exports = function calculateRSI(priceArray) {
    return new Promise(function (resolve, reject) {
        let closeArray = [];
        priceArray.forEach((entry) => {
            if (entry.close) {
                closeArray.push(entry.close);
            }
        });
        let inputRSI = {
            values: closeArray,
            period: 14,
            reversedInput: true,
        };
        let rsiArray = (RSI.calculate(inputRSI));
        if (closeArray.length > 0 && rsiArray.length > 0) {
            resolve([closeArray.slice(0, 20), rsiArray.slice(0, 20)]);
        }
    });
};