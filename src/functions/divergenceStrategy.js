'use strict';
const slope = require('./slope');
/**
 * Divergence Strategy
 * For each of the items in the column array we look for divergence
 * @param {object} column The array of column data
 * @param {object} pair The pair of column data
 * @param {object} timeFrame The timeframe of column data
 * @param {object} period The period between spikes
 * @return {object} divergence report
 */
module.exports = function divergenceStrategy(column, pair, timeFrame) {

    return new Promise(function (resolve, reject) {
        let i;
        for (i = 0; i <= 18; i++){
            if (
                column.length <= 19 &&
                column[1].priceSpike === 'up' &&
                column[i].priceSpike === 'up' &&
                column[1].rsiSpike === 'up' &&
                column[i].rsiSpike === 'up' &&
                column[i].priceValue < column[1].priceValue &&
                column[i].rsiValue > column[1].rsiValue
            ) {
                const firstPriceSpikeValue = column[1].priceValue;
                const secondPriceSpikeValue = column[i].priceValue;
                const firstRsiSpikeValue = column[1].rsiValue;
                const secondRsiSpikeValue = column[i].rsiValue;
                let x;
                for (x = 2; x <= i; x++) {
                    const priceSlope = slope(i, firstPriceSpikeValue, secondPriceSpikeValue, 'bearish');
                    const rsiSlope = slope(i, firstRsiSpikeValue, secondRsiSpikeValue, 'bearish');
                    if (priceSlope && rsiSlope && x === i) {
                        const divergence = true;
                        const period = i;
                        const direction = 'bearish';
                        const data = column;
                        const slope = true;
                        console.log("bearish slope true")
                        resolve({ divergence, period, direction, pair, timeFrame, data, slope });
                        break;
                    } else {
                        console.log("bearish slop false")
                        resolve({ divergence: true, slope: false, direction: 'bearish' })
                        break;
                    }
                }
            } 
            if (
                column.length <= 19 &&
                column[1].priceSpike === 'down' &&
                column[i].priceSpike === 'down' &&
                column[1].rsiSpike === 'down' &&
                column[i].rsiSpike === 'down' &&
                column[i].priceValue > column[1].priceValue &&
                column[i].rsiValue < column[1].rsiValue
            ) {
                const firstPriceSpikeValue = column[1].priceValue;
                const secondPriceSpikeValue = column[i].priceValue;
                const firstRsiSpikeValue = column[1].rsiValue;
                const secondRsiSpikeValue = column[i].rsiValue;
                let x;
                for (x = 2; x <= i; x++) {
                    const priceSlope = slope(i, firstPriceSpikeValue, secondPriceSpikeValue, 'bullish');
                    const rsiSlope = slope(i, firstRsiSpikeValue, secondRsiSpikeValue, 'bullish');
                    if (priceSlope && rsiSlope && x === i) {
                        const divergence = true;
                        const period = i;
                        const direction = 'bullish';
                        const data = column;
                        const slope = true;
                        console.log("bullish slope true")
                        resolve({ divergence, period, direction, pair, timeFrame, data, slope });
                        break;
                    } else {
                        console.log("bullish slope false")
                        resolve({ divergence: true, slope: false, direction: 'bullish' })
                        break;
                    }
                }
            }
        };
            console.log("no divergence 1st");
            resolve({ divergence: false })
    });
};
