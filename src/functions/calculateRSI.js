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
        const inputRSI = {values, period: 14, reversedInput: true};
        const rsiArray = (RSI.calculate(inputRSI));
        if (values.length > 0 && rsiArray.length > 0) {
            const priceArrayTrimmed = priceArray.slice(0, 21);
            const rsiArrayTrimmed = rsiArray.slice(0, 21);
            resolve([priceArrayTrimmed, rsiArrayTrimmed]);
        }
    });
};
