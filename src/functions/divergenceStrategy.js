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
    return new Promise(function (resolve, reject) {
        period.forEach((period) => {
            let i = period;
            if (
                i <= 16 &&
                column[2].priceSpike == 'up' &&
                column[i].priceSpike == 'up' &&
                column[2].rsiSpike == 'up' &&
                column[i].rsiSpike == 'up' &&
                column[i].priceValue < column[2].priceValue &&
                column[i].rsiValue > column[2].rsiValue
            ) {
                let firstPriceSpikeValue = column[2].priceValue;
                let secondPriceSpikeValue = column[i].priceValue;
                let firstRsiSpikeValue = column[2].rsiValue;
                let secondRsiSpikeValue = column[i].rsiValue;
                let x;
                for (x = 2; x <= i; x++) {
                    let priceSlope = slope(i,
                        firstPriceSpikeValue,
                        secondPriceSpikeValue);
                    let rsiSlope = slope(i,
                        firstRsiSpikeValue,
                        secondRsiSpikeValue);
                    if (priceSlope && rsiSlope) {
                        if (x == i) {
                            resolve({
                                divergence: true,
                                period: i,
                                direction: 'bearish',
                                pair: pair,
                                timeFrame: timeFrame,
                                data: column,
                            });
                        }
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
                let firstPriceSpikeValue = column[2].priceValue;
                let secondPriceSpikeValue = column[i].priceValue;
                let firstRsiSpikeValue = column[2].rsiValue;
                let secondRsiSpikeValue = column[i].rsiValue;
                let x;
                for (x = 2; x <= i; x++) {
                    let priceSlope = slope(i,
                        firstPriceSpikeValue,
                        secondPriceSpikeValue);
                    let rsiSlope = slope(i,
                        firstRsiSpikeValue,
                        secondRsiSpikeValue);
                    if (priceSlope && rsiSlope) {
                        if (x == i) {
                            resolve({
                                divergence: true,
                                period: i,
                                direction: 'bullish',
                                pair: pair,
                                timeFrame: timeFrame,
                                data: column,
                            });
                        }
                    } else {
                        break;
                    }
                }
            }
        });
    });
};