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
module.exports = function divergenceStrategy(column, pair, timeFrame, period) {
    return new Promise(function(resolve, reject) {
        column.forEach((i) => {
            if (
                i <= 16 &&
                column[2].priceSpike == 'up' &&
                column[i].priceSpike == 'up' &&
                column[2].rsiSpike == 'up' &&
                column[i].rsiSpike == 'up' &&
                column[i].priceValue < column[2].priceValue &&
                column[i].rsiValue > column[2].rsiValue
            ) {
                const firstPriceSpikeValue = column[2].priceValue;
                const secondPriceSpikeValue = column[i].priceValue;
                const firstRsiSpikeValue = column[2].rsiValue;
                const secondRsiSpikeValue = column[i].rsiValue;
                let x;
                for (x = 2; x <= i; x++) {
                    const priceSlope = slope(i, firstPriceSpikeValue, secondPriceSpikeValue, 'bearish');
                    const rsiSlope = slope(i, firstRsiSpikeValue, secondRsiSpikeValue, 'bearish');
                    if (priceSlope && rsiSlope && x == i) {
                        const divergence = true;
                        const period = i;
                        const direction = 'bearish';
                        const data = column;
                        resolve({divergence, period, direction, pair, timeFrame, data});
                    } else {
                        break;
                    }
                }
            }
            if (
                i <= 15 &&
                column[2].priceSpike == 'down' &&
                column[i].priceSpike == 'down' &&
                column[2].rsiSpike == 'down' &&
                column[i].rsiSpike == 'down' &&
                column[i].priceValue > column[2].priceValue &&
                column[i].rsiValue < column[2].rsiValue
            ) {
                const firstPriceSpikeValue = column[2].priceValue;
                const secondPriceSpikeValue = column[i].priceValue;
                const firstRsiSpikeValue = column[2].rsiValue;
                const secondRsiSpikeValue = column[i].rsiValue;
                let x;
                for (x = 2; x <= i; x++) {
                    const priceSlope = slope(i, firstPriceSpikeValue, secondPriceSpikeValue, 'bullish');
                    const rsiSlope = slope(i, firstRsiSpikeValue, secondRsiSpikeValue, 'bullish');
                    if (priceSlope && rsiSlope && x == i) {
                        const divergence = true;
                        const period = i;
                        const direction = 'bullish';
                        const data = column;
                        resolve({divergence, period, direction, pair, timeFrame, data});
                    } else {
                        break;
                    }
                }
            }
        });
    });
};
