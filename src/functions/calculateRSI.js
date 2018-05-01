'use strict';
const RSI = require('@solazu/technicalindicators').RSI;
/**
 * Calculate RSI
 * From the historic and live data, calculate the
 * RSI and return the last 9 as 2 arrays
 * @param {object} priceArray The proce data
 * @return {object} the RSI Array and close Arrays
 */
module.exports = function calculateRSI(priceArray) {
    return new Promise(function(resolve, reject) {
        let values = [];
        priceArray.forEach((entry) => {
            if (entry.close) {
                values.push(entry.close);
            }
        });
        let inputRSI = {values, period: 14, reversedInput: true};
        let rsiArray = (RSI.calculate(inputRSI));
        if (values.length > 0 && rsiArray.length > 0) {
            let closeArrayTrimmed = values.slice(0, 20);
            let rsiArrayTrimmed = rsiArray.slice(0, 20);
            resolve([closeArrayTrimmed, rsiArrayTrimmed]);
        }
    });
};
